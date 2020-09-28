//讀取內置物件http,這個物件開發服務器用的
const http = require('http');
//創建一個伺服器
const server = http.createServer((req,res)=>{
    res.writeHead(200,{
        'Content-Type': 'text/html'
    });
//end裡面必須是字串
    res.end(` 
    <h2>Hello</h2>
    <p>${req.url}</p>
    `);
});
//監聽伺服器
server.listen(3000);