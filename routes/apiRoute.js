var express = require("express");
const db = require('../config/database')
var router = express.Router();

router.get('/stats', (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    res.status(200)
    db.query("SELECT * FROM yshop_shops; SELECT * FROM `yshop_products`; SELECT * FROM `yshop_users`", function(err, result){
        res.send(JSON.stringify({
            status: 200,
            message: "OK",
            shops: result[0].length,
            products: result[1].length+6,
            users: result[2].length
        }));
    })
    //res.send({ message: 200, shops: 0, products: 0, users: 0})
})

router.post('/shop/payments', (req, res)=>{
    
})

router.get('/shop/:id/execute', (req, res)=>{
    res.json({
        code: 200,
        message: 'OK',
        products: [
            {
                command: 'say {nick}',
                nick: 'e',
                count: 1
            }
        ]
    })
})
module.exports = router;