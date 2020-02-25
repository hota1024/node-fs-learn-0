import { promises as fs, Dirent } from 'fs'
import * as path from 'path'

export async function tree(filePath: string, depth = 0) {
  const files = await fs.readdir(filePath, {
    withFileTypes: true
  })

  for (const file of files) {
    const sep = depth > 0 ? '├' : ''
    console.log(' '.repeat(depth * 2) + sep + file.name)
    if (file.isDirectory()) {
      await tree(path.resolve(filePath, file.name), depth + 1)
    }
  }
}

export async function importFile(
  filePath: string,
  moduleFilter?: (data: any) => boolean
) {
  const data = await import(filePath)

  if (moduleFilter) {
    for (const [key, value] of Object.entries(data)) {
      if (!moduleFilter(value)) {
        delete data[key]
      }
    }
  }

  return data
}

importFile(
  path.resolve(__dirname, '../test/0.js'),
  data => typeof data === 'function'
).then(console.log)
