const http = require('http');
const fs = require('fs');

var server = http.createServer(
    (request, response) => {
        if (request.url == '/') {
            fs.readFile('./index.html', 'UTF-8', (error, data) => {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(data);
                response.end();
            })
        } else if (request.url == '/top') {
            fs.readFile('./top.html', 'UTF-8', (error, data) => {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(data);
                response.end();
            })
        } else if (request.url == '/mypage') {
            fs.readFile('./mypage.html', 'UTF-8', (error, data) => {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(data);
                response.end();
            })
        } else if (request.url == '/upload') {
            fs.readFile('./upload.html', 'UTF-8', (error, data) => {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(data);
                response.end();
            })
        } else {
            console.log(request.url)
            fs.readFile(`.${request.url}`, 'UTF-8', (error, data) => {
                if (error) {
                    response.writeHead(404);
                    response.write('File not found!');
                } else {
                    response.writeHead(200, { 'Content-Type': 'text/javascript' });
                    response.write(data);
                }
                response.end();
            });
        }

    }
);
server.listen(3000);