import { Hono } from 'hono'
import { Database } from 'bun:sqlite'

import Actions from './controllers'

const {
    PORT,
 } = Bun.env

const app = new Hono()
const db = new Database(Bun.env.DB_NAME, { create: true })

// Hello
app.get('/', c => c.text("Hello, API."))

// Controller Actions
//
app.get('/worlds',  Actions.worlds.list(db))
app.get('/blobs', Actions.blobs.list(db))

const server: any = {
    port: PORT,
    fetch: app.fetch,
}
export default server