import Database from "bun:sqlite"
import { Context } from "hono"
import WorldsTable from "../../database/tables/worlds"

export default (db: Database) => (c: Context) => {
    const Worlds = new WorldsTable(db)
    return c.json(Worlds.all())
}
