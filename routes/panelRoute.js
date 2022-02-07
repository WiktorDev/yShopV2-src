const express = require("express");
const shop = require("../api/shop");
const moment = require('moment')
var router = express.Router();

router.use(function(req,res,next){
    res.locals.moment = moment;
    next();
});

router.get('/', function(req, res) {
    shop.getShopsByOwner(req.session.username, function(data){
        res.render('panel/index', {
            result: data,
            pageName: 'root'
        })
    })
})

router.get('/addshop', (req, res) => {
    res.render('panel/addshop', {
        pageName: 'Dodaj sklep'
    })
})

router.post('/addshop', (req, res) => {
    var name = req.body.name;
    var ip = req.body.ip;
    var port = req.body.port;
    var port_rcon = req.body.rcon_port;
    var rcon_pass = req.body.rcon_pass;
    if(!name || !ip || !port || !port_rcon || !rcon_pass) {
        req.flash('error', 'Prosze uzupelnic wszystkie luki w formularzu!')
        res.redirect('/panel/addshop')
    }else{
        shop.createShop(name, ip, port, port_rcon, rcon_pass, req.session.username, req, res)
    }
})

router.get('/account',(req, res) => {
    res.render('panel/account', {
        pageName: 'Twoje konto'
    })
})

module.exports = router;