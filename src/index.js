const express = require('express');

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