const express = require('express');
const db = require(__dirname + '/../db_connect2');

const router = express.Router();

router.get('/', (req, res)=>{
    res.send('address-book');
});

module.exports = router;
