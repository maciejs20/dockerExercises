// moduł obsługuje ządania od klientów
// -------------------------------------
const fs = require('fs')
const url = require('url')
const path = require('path')
const info = require('./info.js')

let appConfig
const setConfig = function (value) {
  appConfig = value
}

// obsługiwane typy plików
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.ttf': 'aplication/font-sfnt',
  '.txt': 'text/plain'
}

function baseName (str) {
  // zwraca basename pliku
  const li = Math.max(str.lastIndexOf('/'), str.lastIndexOf('\\'))

  return String(str).substring(li + 1)
}

const send200 = function (response) {
  response.writeHead(200, {
    'Content-Type': 'text/html;charset=utf8'
  })
}

// const send503 = function (response) {
//   response.writeHead(503, {
//     'Content-Type': 'text/html;charset=utf8'
//   })
// }

const send404 = function (response) {
  response.writeHead(404, {
    'Content-Type': 'text/html;charset=utf8'
  })
}

function serveFile (urlExt, urlPath, targetFile, response) {
  if (mimeTypes[urlExt] !== undefined) {
    // obsługiwany typ plików

    // otwieramy stream z plikiem
    const fileStream = fs.createReadStream(targetFile)

    fileStream.on('error', function (data) {
      // blad otwarcia pliku
      console.log('  Not found:', targetFile)
      send404(response)
      response.write(`<H1>File "<strong>${urlPath}</strong>": I don't have such file.</H1>`)
      response.end()
    })

    fileStream.on('ready', function (data) {
      // otwarcie pliku się udało
      console.log('  Serving file:', targetFile)
      send200(response)
    })
    fileStream.on('data', function (data) {
      // wysyłamy dane
      response.write(data)
    })
    fileStream.on('end', function () {
      // koniec pliku
      response.end()
    })
  } else {
    // nieobsługiwany typ pliku
    send404(response)
    response.write(`<H1>File extension: "<strong>${urlExt}</strong>": I don't serve such content</H1>`)
    console.log('  Not supported:', targetFile)
    response.end()
  }
}

const processRequest = function (request, response) {
  // adres IP Klienta
  const ip =
    request.headers['x-forwarded-for'] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress

  // url z zapytania
  let urlPath = url.parse(request.url).path
  if (urlPath === '/') urlPath = '/index.html'

  // wytnij ewentualne podkatalogi
  urlPath = baseName(urlPath)

  // rozszerzenie pliku
  const urlExt = path.extname(urlPath)

  // docelowa lokalizacja w systemie plików
  const targetFile = path.join(appConfig.filePath, urlPath)

  console.log(`${ip} request for ${urlPath}`)

  switch (urlPath) {
    case 'ping':
      info.ping(response)
      break
    case 'info':
      info.info(response)
      break
    case 'liveness':
      info.livenessProbe(response)
      break
    case 'readiness':
      info.readinessProbe(response)
      break
    default:
      serveFile(urlExt, urlPath, targetFile, response)
      break
  }
}

module.exports = {
  processRequest: processRequest,
  setConfig: setConfig
}
