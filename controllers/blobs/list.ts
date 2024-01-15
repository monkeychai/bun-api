import Database from "bun:sqlite"
import { Context } from "hono"

import WorldsTable    from "../../database/tables/worlds"
import BlobsTable from "../../database/tables/blobs"

export default (db: Database) => (c: Context) => {
    const world_id = c.req.query('world_id') || ""

    const Worlds = new WorldsTable(db)
    const world  = Worlds.get(world_id)
    if (!world) {
        return c.json({ error: "World not found" })
    }

    const Blobs = new BlobsTable(db)
    const blobs = Blobs.forWorld(Number(world_id))

    return c.json(blobs)
}
