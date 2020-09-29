const express = require('express');
const moment = require('moment-timezone');
const db = require(__dirname + '/../db_connect2');

const router = express.Router();

router.get('/', (req, res)=>{
    res.send('address-book');
});

async function getListData (req) {
    const output = {
        page: 0,
        perPage: 5,
        totalRows: 0,
        totalPages: 0,
        rows: [],
        pages: []
    };

    const [[{ totalRows }]] = await db.query("SELECT COUNT(1) totalRows FROM address_book");
    if(totalRows>0){
        let page = parseInt(req.query.page) || 1;
        output.totalRows = totalRows;
        output.totalPages = Math.ceil(totalRows/output.perPage);

        if(page < 1) {
            output.page = 1;
        } else if(page > output.totalPages) {
            output.page = output.totalPages;
        } else {
            output.page = page;
        }

        // 處理頁碼按鈕
        if(output.totalPages <= 7){
            for(let i=1; i<=output.totalPages; i++){
                output.pages.push(i);
            }
        } else {
            const fAr = [], bAr = [];
            // 從前面開始數
            for(let i=output.page-3; i<=output.totalPages; i++){
                if(i>=1){
                    fAr.push(i);
                }
                if(fAr.length >= 7) break;
            }
            // 從後面開始數
            for(let i=output.page+3; i>=1; i--){
                if(i<=output.totalPages){
                    bAr.unshift(i);
                }
                if(bAr.length >= 7) break;
            }
            output.pages = fAr.length > bAr.length ? fAr : bAr;
        }

        let sql = `SELECT * FROM address_book ORDER BY sid DESC LIMIT ${(output.page-1)*output.perPage}, ${output.perPage}`;

        const [r2] = await db.query(sql);
        r2.forEach(el=>{
            el.birthday2 = moment(el.birthday).format('YYYY-MM-DD');
        });
        output.rows = r2;
    }

   return output;
}


/* RESTful API
    列表
    /api/ GET

    新增
    /api/ POST

    呈現單筆
    /api/:sid GET

    修改單筆
    /api/:sid PUT

    刪除單筆
    /api/:sid DELETE
*/

router.get('/api', async (req, res)=>{
    res.json(await getListData(req) );
});

router.get('/list', async (req, res)=>{
    const output = await getListData(req);
    res.render('address-book/list', output);
});

router.get('/add', (req, res)=>{
    res.render('address-book/add');
});
router.post('/add', (req, res)=>{

});
/*
    列表  /list
        列表呈現 GET

    新增  /add
        表單呈現 GET, 接收資料 POST

    修改  /edit/:sid
        修改的表單呈現 GET, 接收資料 POST

    修改  /del/:sid
        POST
*/


module.exports = router;
