// program listuje zmienne środowiskowe jakie otrzymuje przy uruchomieniu
// ---------------------------------------------------------
const os = require('os')
const sprintf = require('sprintf-js').sprintf

const TIMEOUT_EXIT = 1000 * 60 * 5

const env = process.env
console.log(`Running on: ${os.hostname()} [${os.type()}, ${os.arch()}]`)
console.log('Environemnt variables:')

// sort env entries
const keysSorted = Object.keys(env).sort(function (a, b) {
  return a.localeCompare(b)
})

// print them out
keysSorted.forEach(function (value) {
  console.log(sprintf('    %20s=%s', value, env[value]))
})

