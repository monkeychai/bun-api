import Database from "bun:sqlite"
import Statement from "../../lib/statement"

type World = {
    $name: string
    $num_blobs: number
}
type WorldRecord = {
    id: number
    created_at: string
    name: string
    num_blobs: number
    status: ('created' | 'running' | 'stopped')
}

class WorldsTable {
    db: Database

    constructor(db: Database) {
        this.db = db
    }

    all(): WorldRecord[] {
        const query = this.db.query('SELECT * FROM worlds')
        return query.all() as WorldRecord[]
    }

    insert(world: World): boolean {
        const { values, query } = Statement.insert("worlds", world)
        const insert = this.db.prepare(query);
        const insertWorld = this.db.transaction(worlds => {
            for (const world of worlds) insert.run(world)
            return worlds.length
        })

        return (insertWorld([values]) > 0)
    }

    get($id: string): (WorldRecord | undefined) {
        const query = this.db.query('SELECT * FROM worlds WHERE id = $id')
        const worlds = query.all({ $id })

        return (worlds.length > 0) ? (worlds[0] as WorldRecord) : undefined
    }

    delete($id: number) {
        const destroy = this.db.prepare('DELETE FROM worlds WHERE id = $id')
        this.db.transaction(world => destroy.run(world))({ $id })
    }
}

export default WorldsTable