const express = require('express');
const moment = require('moment-timezone');
const db = require(__dirname + '/../db_connect2');
const upload = require(__dirname + '/../upload-img-module');

const router = express.Router();

router.get('/', (req, res)=>{
    res.send('address-book');
});

async function getListData (req) {
    const output = {
        page: 0,
        perPage: 10,
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
        (function(page, totalPages, prevNum){
            let pages = [];
            if(totalPages <= prevNum*2+1){
                for(let i=1; i<=totalPages; i++){
                    pages.push(i);
                }
            } else {
                const fAr = [], bAr = [];
                // 從前面開始數
                for(let i=page-prevNum; i<=totalPages; i++){
                    if(i>=1){
                        fAr.push(i);
                    }
                    if(fAr.length >= prevNum*2+1) break;
                }
                // 從後面開始數
                for(let i=page+prevNum; i>=1; i--){
                    if(i<=totalPages){
                        bAr.unshift(i);
                    }
                    if(bAr.length >= prevNum*2+1) break;
                }
                pages = fAr.length > bAr.length ? fAr : bAr;
            }
            output.pages = pages;
        })(page, output.totalPages, 3);

        // 處理頁碼按鈕 2
        (function(page, totalPages, prevNum){
            let beginPage, endPage;
            if(totalPages <= prevNum*2+1){
                beginPage = 1;
                endPage = totalPages;
            } else if(page-1 < prevNum) {
                beginPage = 1;
                endPage = prevNum*2+1;
            } else if(totalPages-page < prevNum) {
                beginPage = totalPages-(prevNum*2+1);
                endPage = totalPages;
            } else {
                beginPage = page-prevNum;
                endPage = page+prevNum;
            }
            output.beginPage = beginPage;
            output.endPage = endPage;
        })(page, output.totalPages, 3);


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
router.post('/add', upload.none(), async (req, res)=>{
    const data = {...req.body};
    data.created_at = new Date();
    const sql = "INSERT INTO `address_book` set ?";
    const [{affectedRows, insertId}] = await db.query(sql, [ data ]);
    // [{"fieldCount":0,"affectedRows":1,"insertId":860,"info":"","serverStatus":2,"warningStatus":1},null]

    res.json({
        success: !!affectedRows,
        affectedRows,
        insertId,
    });
});

router.get('/edit/:sid', async (req, res)=>{
    const sql = "SELECT * FROM address_book WHERE sid=?";

    const [results] = await db.query(sql, [req.params.sid]);
    if(! results.length){
        return res.redirect('/address-book/list');
    }

    results[0].birthday = moment(results[0].birthday).format('YYYY-MM-DD');
    res.render('address-book/edit', results[0]);
});
router.post('/edit/:sid', upload.none(), async (req, res)=>{
    const data = {...req.body};
    const sql = "UPDATE `address_book` SET ? WHERE `sid`=?";
    const [results] = await db.query(sql, [ data, req.params.sid ]);
    // {"fieldCount":0,"affectedRows":1,"insertId":0,"info":"Rows matched: 1  Changed: 0  Warnings: 0","serverStatus":2,"warningStatus":0,"changedRows":0}


    res.json(results);
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
