const {
  existsSync,
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
} = require('fs')
const { resolve } = require('path')

const WHITE_LIST_EXTENSION = /\.(jsx?|tsx?|txt|css|json)$/

function replaceFileContent (dirPath, originalStr, distStr) {
  if (originalStr === distStr || !existsSync(dirPath)) {
    return
  }

  const fileList = readdirSync(dirPath)
  for (const fileName of fileList) {
    const filePath = resolve(dirPath, fileName)
    const isDir = statSync(filePath).isDirectory()
    if (isDir) {
      replaceFileContent(filePath, originalStr, distStr)
      continue
    }

    if (!WHITE_LIST_EXTENSION.test(filePath)) {
      continue
    }

    let fileContent = readFileSync(filePath, {
      encoding: 'utf-8',
    })

    const replaceRegExp = new RegExp(originalStr, 'g')
    fileContent = fileContent.replace(replaceRegExp, distStr)

    writeFileSync(filePath, fileContent, {
      encoding: 'utf-8',
    })
  }
}

module.exports = {
  replaceFileContent,
}
