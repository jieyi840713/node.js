const express = require('express');

const router = express.Router();

router.get('/admin3/:p1?/:p2?', (req, res)=>{
    res.json({
        params: req.params,
        url: req.url,
        baseUrl: req.baseUrl,
    });
});

module.exports = router;










