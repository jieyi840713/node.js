const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res)=>{
    fs.writeFile(
        __dirname + '/../data/headers01.txt',
        JSON.stringify(req.headers),
        error=>{
            if(error){
                res.end('Fail: ' + error);
            } else {
                res.end('OK');
            }
        }
    );
});

server.listen(3000);


