import Database from "bun:sqlite"
import Statement from "../../lib/statement"

type Blob = {
    $world_id: (number | null)
}
type BlobRecord = {
    id: number
    is_ready: (0 | 1)
    world_id: (number | null)
}

class BlobsTable {
    db: Database

    constructor(db: Database) {
        this.db = db
    }

    isInWorld($world_id: number, $id: number): boolean {
        const query = this.db.prepare('SELECT * FROM blobs WHERE world_id = $world_id AND id = $id')
        const blobs = query.all({ $world_id, $id })

        return (blobs.length > 0)
    }

    forWorld($worldId: number): BlobRecord[] {
        const query = this.db.query('SELECT * FROM blobs WHERE world_id = $worldId')
        return query.all({ $worldId }) as BlobRecord[]
    }

    insert(blob: Blob): boolean {
        const { values, query } = Statement.insert("blobs", blob)
        const insert = this.db.prepare(query);
        const insertBlob = this.db.transaction(blobs => {
            for (const blob of blobs) insert.run(blob)
            return blobs.length
        })

        return (insertBlob([values]) > 0)
    }

    get(blob: Blob): (BlobRecord | undefined) {
        const { values, query } = Statement.select("blobs", blob, { keepNull: true })
        const blobRecord = this.db.query(query).get(values)
        return blobRecord ? (blobRecord as BlobRecord) : undefined
    }

    setReady($id: number) {
        const update = this.db.prepare('UPDATE blobs SET is_ready = true WHERE id = $id')
        this.db.transaction(blob => update.run(blob))({ $id })
    }
}

export default BlobsTable