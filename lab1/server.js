// program listuje zmienne środowiskowe jakie otrzymuje przy uruchomieniu
// ---------------------------------------------------------
const os = require('os');
var env = process.env;

console.log(`Running on: ${os.hostname()} [${os.type()}, ${os.arch()}]`);
console.log("Environemnt variables:");
Object.keys(env).forEach(function(key) {
  console.log('      ' + key + '="' + env[key] +'"');
});



