const http = require('http');
const fs = require('fs');

function myWriteFile(path, content) {

    return new Promise((resolve, reject)=>{
        fs.writeFile(
            path,
            content,
            error=>{
                if(error){
                    reject(error);
                } else {
                    resolve('ok');
                }
            }
        );
    });

}

const server = http.createServer((req, res)=>{
    myWriteFile(
        __dirname + '/../data/headers01.txt',
        JSON.stringify(req.headers)
    ).then(msg=>{
        res.end(msg);
    }).catch(ex=>{
        res.end('Fail: ' + error);
    })

});

server.listen(3000);


