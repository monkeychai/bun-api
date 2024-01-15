import { Command } from 'commander'
import { fileURLToPath } from 'url'
import { promises as fs, existsSync } from 'fs'
import * as path from 'path'
import { exec } from 'child_process'

const THIS_FILE = fileURLToPath(import.meta.url)
const PROJECT_ROOT = path.dirname(path.dirname(THIS_FILE))

const TO_REPLACE = new RegExp('todo', 'g')

const IGNORED = [
    path.basename(THIS_FILE),
    ".git",
    "node_modules",
    ".env",
    "bun.lockb",
]

const RECOMMIT_CMD = "rm -rf .git && git init && git add . && git commit -m \"Scaffold from monkeychai/bun-api\""

const run = async (replaceWith: string) => {
    await processDirectory(PROJECT_ROOT, replaceWith)
    await deleteFile(THIS_FILE)
    exec(RECOMMIT_CMD, { cwd: PROJECT_ROOT })
    console.log('Setup complete.')
}

const processDirectory = async (dir: string, replaceWith: string) => {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (!IGNORED.includes(entry.name)) {
            // console.log(`RUN:  ${fullPath}`)

            if (entry.isDirectory()) {
                await processDirectory(fullPath, replaceWith)
                await renameIfContains(fullPath, replaceWith)

            } else if (entry.isFile()) {
                await replaceContent(fullPath, replaceWith)
                await renameIfContains(fullPath, replaceWith)
            }
        } else {
            // console.log(`SKIP: ${fullPath}`)
        }
    }
}

const renameIfContains = async (filePath: string, replaceWith: string) => {
    const fileName = path.basename(filePath)

    if (fileName.match(TO_REPLACE)) {
        const newFileName = fileName.replace(TO_REPLACE, replaceWith)
        const newFilePath = path.join(path.dirname(filePath), newFileName)

        await fs.rename(filePath, newFilePath)
    }
}

const replaceContent = async (filePath: string, replaceWith: string) => {
    let content = await fs.readFile(filePath, 'utf8')
    content = content.replace(TO_REPLACE, replaceWith)

    await fs.writeFile(filePath, content)
}

const deleteFile = async (filePath: string) => {
    if (existsSync(filePath)) {
        await fs.unlink(filePath)
    }
}


const program = new Command()
program
    .version("0.0.1")
    .description("Bun template setup helper")
    .parse(process.argv)
program
    .command('run <replaceWith>')
    .action(run)

program.parse(process.argv)