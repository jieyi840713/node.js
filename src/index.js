const express = require('express');
const multer = require('multer');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');
const upload = multer({dest: __dirname + '/../tmp_uploads'});

const app = express();

app.set('view engine', 'ejs');

app.use( express.urlencoded({extended: false}) );
app.use( express.json() );


app.get('/', (req, res)=>{
    // res.send('<h2>Hola </h2>');
    res.render('home', {name: 'Shinder'});
});

app.get('/json-sales', (req, res)=>{
    const sales = require(__dirname + '/../data/sales');
    // res.json(sales);
    res.render('json-sales', {sales})
});
app.get('/json-sales2', (req, res)=>{
    const sales = require(__dirname + '/../data/sales');
    // res.json(sales);
    res.render('abc/def/json-sales2', {sales})
});

app.get('/try-qs', (req, res)=>{
    res.json(req.query);
});


app.post('/try-post',(req, res)=>{
    res.json(req.body);
});

app.get('/try-post-form',(req, res)=>{
    res.render('try-post-form');
});

app.post('/try-post-form',(req, res)=>{
    res.render('try-post-form', req.body);
});

app.post('/try-upload', upload.single('avatar'), (req, res)=>{
    console.log(req.file);

    if(req.file && req.file.originalname){
        let ext = '';

        switch(req.file.mimetype){
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':

                fs.rename(
                    req.file.path,
                    __dirname + '/../public/img/' + req.file.originalname,
                    error=>{

                        return res.json({
                            success: true,
                            path: '/img/'+ req.file.originalname
                        });
                    });

                break;
            default:
                fs.unlink(req.file.path, error=>{
                    return res.json({
                        success: false,
                        msg: '不是圖檔'
                    });
                });

        }
    } else {
        return res.json({
            success: false,
            msg: '沒有上傳檔案'
        });
    }
});

app.get('/try-uuid',(req, res)=>{
    res.json({
        uuid1: uuidv4(),
        uuid2: uuidv4(),
    });
});

const upload2 = require(__dirname + '/upload-img-module');
app.post('/try-upload2', upload2.single('avatar'), (req, res)=> {
    res.json(req.file);
});

app.get('/my-params1/:action?/:id?', (req, res)=> {
    res.json(req.params);
});
app.get('/my-params2/*?/*?', (req, res)=> {
    res.json(req.params);
});

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res)=> {
    let u = req.url.slice(3).split('?')[0];
    u = u.replace(/-/g, '');
    res.send(u);
});

app.use(require(__dirname + '/routes/admin2'));

app.use( express.static(__dirname + '/../public'));

app.use((req, res )=>{
    res
        .type('text/plain')
        .status(404)
        .send('找不到網頁');
});

app.listen(3000, ()=>{
    console.log('伺服器已啟動...');
})