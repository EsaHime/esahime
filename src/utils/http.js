const { get } = require('https')

function getJson (url) {
  return new Promise((resolve, reject) => {
    get(url, (response) => {
      const status = response.statusCode
      if (status >= 400) {
        reject({ code: status, message: response.statusMessage })
      } else if (status >= 300) {
        getJson(response.headers.location).then(resolve, reject)
      } else {
        let rawResponse = ''
        response.on('data', (chunk) => {
          rawResponse += chunk
        })
        response.on('end', () => {
          resolve(JSON.parse(rawResponse))
        })
      }
    }).on('error', reject)
  })
}

module.exports = {
  getJson
}
