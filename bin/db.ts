import _ from 'lodash'
import { Command } from 'commander'
import { Database } from 'bun:sqlite'

const DB_FILE = Bun.env.DB_NAME || "database.db"

const CREATE_SQL_FILENAME = 'database/create.sql'
const DROP_SQL_FILENAME   = 'database/drop.sql'
const SEED_SQL_FILENAME   = 'database/seed.sql'

const cleanSQL = (file_contents: string): string[] => (
    file_contents.replace(/\-\-.*\n/g, '')
                 .replace(/\n/g, "")
                 .split(";")
                 .filter(line => (line !== ''))
                 .map(line => `${_.trim(line)};`)
)

const runSQLfile = async (filename: string, db: Database | undefined = undefined) => {
    if (!db) {
        db = new Database(DB_FILE)
    }
    const file_contents = await Bun.file(filename).text()
    const SQL = cleanSQL(file_contents)

    _.each(SQL, line => {
        try {
            db!.run(line)
        } catch(err) {
            console.log(`ERROR: ${(err as Error).message}`)
        }
    })

    db.close()
}

const createDb = async () => {
    var create = (!(await Bun.file(DB_FILE).exists()))
    const db = new Database(DB_FILE, { create, readwrite: true })
    await runSQLfile(CREATE_SQL_FILENAME, db)
}
const dropDb = async () => runSQLfile(DROP_SQL_FILENAME)
const seedDb = async () => runSQLfile(SEED_SQL_FILENAME)

const program = new Command()

program
    .version("0.0.1")
    .description("Database migration helper")
    .parse(process.argv)

program
    .command('create')
    .action(createDb)

program
    .command('drop')
    .action(dropDb)

program
    .command('reset')
    .action(async () => {
        await dropDb()
        await createDb()
    })

program
    .command('seed')
    .action(async () => {
        await seedDb()
    })

program.parse()