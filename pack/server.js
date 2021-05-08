// wymagane przez aplikację moduły nodejs
// nalezy je zainstalować aby aplikacja działała poprawnie
// ---------------------------------------------------------
const http = require('http')
const os = require('os')
const serve = require('./serve.js')
const { AppConfig } = require('./appConfig.js')
const info = require('./info.js')
const args = require('minimist')(process.argv.slice(2))
const auth = require('http-auth')

// konfiguracja programu
let appConfig

// ---- Konfiguracja programu
// flaga --mode [FILES, ENV] ustawia tryb konfiguracji
// jesli jej nie ma zakładamy tryb ENV

if (args.hasOwnProperty('mode')) {
  if (args.mode === 'FILES') {
    appConfig = new AppConfig()
  } else if (args.mode === 'ENV') {
    appConfig = new AppConfig(process.env)
  } else {
    console.log(
      'Command line error: Unknown command line switch "mode" value: ' +
        args.mode
    )
    console.log('Supported modes: FILES, ENV')
    process.exit(1)
  }
} else {
  console.log('No command line switch "mode", assuming ENV mode')
  appConfig = new AppConfig(process.env)
}

// przekaz objekt konfiguracyjny do innych modułów
info.setConfig(appConfig)
serve.setConfig(appConfig)

// przygotowujemy nasz serwer
let server
let basic

// ustawiamy autentykację
if (appConfig.authRequired) {
  basic = auth.basic({
    realm: 'Login'
  }, (username, password, callback) => {
    callback(username === appConfig.username && password === appConfig.password)
  })
  // inicjujemy serwer http z autentykacją
  console.log('Activate basic auth')
  server = http.createServer(basic.check(serve.processRequest))
} else {
  // inicjujemy serwer http bez autentykacji
  server = http.createServer(serve.processRequest)
}

// uruchamiamy serwer
console.log(`Running on: ${os.hostname()} [${os.type()}, ${os.arch()}]`)
console.log(
  `Starting nodejs server on port ${appConfig.appPort} serving files from "${appConfig.filePath}"`
)
server.listen(appConfig.appPort)
