// wymagane przez aplikację moduły nodejs
// nalezy je zainstalować aby aplikacja działała poprawnie
// ---------------------------------------------------------
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const os = require('os');


// ---- Konfiguracja programu
// program pobiera ją ze zmiennych środowiskowych
// lub (w razie ich braku) wykorzystuje wartości domyślne

//directory for our files
const filePath = process.env.FILEDIR || "files";
//listening port
const myPort = process.env.PORT || 8081;

//obsługiwane typy plików
let mimeTypes = {
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
};

function baseName(str) {
    //zwraca basename pliku 
    let li = Math.max(str.lastIndexOf('/'), str.lastIndexOf('\\'));
    return new String(str).substring(li + 1);
}

//inicjujemy serwer http
var server = http.createServer(function (request, response) {

    //adres IP Klienta
    var ip = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;


    //url z zapytania
    let urlPath = url.parse(request.url).path;
    if (urlPath === '/') urlPath = '/index.html';

    //wytnij ewentualne podkatalogi
    urlPath = baseName(urlPath);

    //rozszerzenie pliku
    urlExt = path.extname(urlPath);

    //docelowa lokalizacja w systemie plików
    targetFile = `${__dirname}/${filePath}/${urlPath}`;

    console.log(`Request from: ${ip} for ${urlPath}`);

    if (mimeTypes[urlExt] !== undefined) {
        //obsługiwany typ plików



        //otwieramy stream z plikiem
        var fileStream = fs.createReadStream(targetFile);

        fileStream.on('error', function (data) {
            //blad otwarcia pliku
            console.log("Not found:", targetFile);
            response.writeHead(404, {
                'Content-Type': 'text/html;charset=utf8'
            });
            response.write(`<strong>${urlPath}</strong>: I don't have such file.`);
            response.end();
        });

        fileStream.on('ready', function (data) {
            //otwarcie pliku się udało
            console.log("Serving file:", targetFile);
            response.writeHead(200, {
                'Content-Type': mimeTypes[urlExt]
            });
        });
        fileStream.on('data', function (data) {
            //wysyłamy dane
            response.write(data);
        });
        fileStream.on('end', function () {
            //koniec pliku
            response.end();
        });

    } else {
        //nieobsługiwany typ pliku
        response.writeHead(404, {
            'Content-Type': 'text/html;charset=utf8'
        });
        response.write(`<strong>${urlExt}</strong>: I don't serve such content`);
        response.end();
    }
});

//uruchamiamy serwer
console.log(`Running on: ${os.hostname()} [${os.type()}, ${os.arch()}]`);
console.log(`Starting nodejs server on port ${myPort} serving files from "${filePath}"`);
server.listen(myPort);