import _ from 'lodash'

type Response = {
    values: any,
    query: string,
}

const Statement = (() => {

    const where = (possibleParams: any, opts: any = {}): Response => {
        const params: string[] = []
        _.each(possibleParams, (value, key) => {
            if (value !== undefined && (value !== null || opts.keepNull)) {
                params.push(`${key}`)
            }
        })

        const pairs: string[] = []
        _.each(params, (p: string): any => {
            var clause = `${p.substring(1)} = ${p}`
            if (opts.keepNull && possibleParams[p] === null) {
                clause = `${p.substring(1)} IS NULL`
            }

            pairs.push(clause)
        })

        var valid = _.filter(_.pick(possibleParams, params), val => (val !== null))

        return {
            values: valid,
            query: `WHERE ${pairs.join(" AND ")}`
        }
    }

    const stringify = (possibleParams: any): Response => {
        const params: string[] = []
        _.each(possibleParams, (value, key) => {
            if (value != undefined && value != null) {
                params.push(`${key}`)
            }
        })

        // const keys   = `${_.join(params, ", ")}`
        // const values = `${_.map(params, p => `$${p}`).join(", ")}`

        const keys   = `${_.map(params, p => p.substring(1)).join(", ")}`
        const values = `${_.join(params, ", ")}`

        const valid = _.pick(possibleParams, params)

        return {
            values: valid,
            query: `(${keys}) VALUES (${values})`
        }
    }

    const select = (table: string, params: any, opts: any = {}): Response => {
        const { values, query } = where(params, opts)
        return {
            values,
            query: `SELECT * FROM ${table} ${query}`,
        }
    }

    const insert = (table: string, params: any): Response => {
        const { values, query } = stringify(params)
        return {
            values,
            query: `INSERT INTO ${table} ${query}`,
        }
    }

    return {
        select,
        insert,
    }
})()

export default Statement