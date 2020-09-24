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

const server = http.createServer(async (req, res)=>{

    const msg = await myWriteFile(
        __dirname + '/../data/headers01.txt',
        JSON.stringify(req.headers)
    );
    res.end(msg);
});

server.listen(3000);


