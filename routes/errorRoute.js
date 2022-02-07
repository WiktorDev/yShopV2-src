const express = require("express");
var router = express.Router();

router.get('/', (req, res)=>{
    res.status(404)
    res.render('error', {
        code: '404',
        message: 'Page not found'
    })
})

router.post('/', (req, res)=>{
    res.status(500)
    res.render('error', {
        code: '500',
        message: 'Internal server error'
    })
})

module.exports = router;