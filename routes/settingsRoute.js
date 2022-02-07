var express = require("express");
const getShop = require("../api/shop").getShop
const getPayments = require("../api/payment").getPayments
const pay = require("../api/payment")
const shop = require("../api/shop")
const moment = require('moment')
const db = require('../config/database')
const lvlup = require('../payments/lvlup')
const paypal = require('../payments/paypal')
const hotpay = require('../payments/hotpay')
const hpaypsc = require('../payments/hotpay-psc')
const pbl = require('../payments/paybylink');
const CryptoJS = require('crypto-js')
const nginx = require('../utils/nginx')
var router = express.Router();

router.use(function(req,res,next){
    res.locals.moment = moment;
    next();
});

router.get('/:id/settings/general',ifShopExists, isOwner, (req, res) => {
    getShop(req.params.id, function(data){
        res.render('panel/settings/general.ejs', {
            result: data,
            pageName: 'Ogolne'
        })
    })
})

router.get('/:id/settings/payments',ifShopExists, isOwner, (req, res) => {
    getShop(req.params.id, function(data){
        getPayments(req.params.id, function(dataq){
            res.render('panel/settings/payments.ejs', {
                result: data,
                payment: dataq,
                pageName: 'Platnosci',
                CryptoJS: CryptoJS
            })
        })
    })
})

router.get('/:id/settings/appearance',ifShopExists, isOwner, (req, res)=>{
    getShop(req.params.id, function(data){
        res.render('panel/settings/appearance.ejs', {
            result: data,
            pageName: 'Wyglad'
        })
    })
})

router.get('/:id/settings/connection',ifShopExists, isOwner, (req, res)=>{
    getShop(req.params.id, function(data){
        res.render('panel/settings/connection.ejs', {
            result: data,
            pageName: 'Polaczenie'
        })
    })
})

router.post('/:id/settings/appearance/submit', ifShopExists, isOwner, (req, res)=>{
    shop.setStyle(req.params.id, req.body.css);
    if(req.body.theme == "light"){
        shop.setTheme(req.params.id, "light")
    }else{
        shop.setTheme(req.params.id, "dark")
    }
    req.flash('success', 'Pomyslnie zapisano ustawienia!')
    res.redirect(`/panel/manage/${req.params.id}/settings/appearance`)
})

router.post('/:id/panel/settings/payments/lvlup',ifShopExists, isOwner, (req, res)=>{
    lvlup.setApiKey(req.params.id, req.body.apikey)
    lvlup.setLvlupName(req.params.id, req.body.name)
    if(!req.body.status_lvlup){
        pay.enableLVLUP(req.params.id, false)
    }else{
        pay.enableLVLUP(req.params.id, true)
    }
    req.flash('success', 'Pomyslnie zapisano ustawienia!')
    res.redirect(`/panel/manage/${req.params.id}/settings/payments`)
})

router.post('/:id/panel/settings/payments/lvlupsms',ifShopExists, isOwner, (req, res)=>{
    lvlup.setID(req.params.id, req.body.id)
    lvlup.setLvlupSMSName(req.params.id, req.body.name)
    if(!req.body.status_lvlupsms){
        pay.enableLVLUPSMS(req.params.id, false)
    }else{
        pay.enableLVLUPSMS(req.params.id, true)
    }
    req.flash('success', 'Pomyslnie zapisano ustawienia!')
    res.redirect(`/panel/manage/${req.params.id}/settings/payments`)
})

router.post('/:id/panel/settings/payments/paypal', ifShopExists, isOwner, (req, res)=>{
    paypal.setEmail(req.params.id, req.body.email);
    paypal.setName(req.params.id, req.body.name);
    paypal.setClient(req.params.id, req.body.clientID, req.body.clientSecret);
    if(!req.body.status_pp){
        pay.enablePayPal(req.params.id, false)
    }else{
        pay.enablePayPal(req.params.id, true)
    }
    req.flash('success', 'Pomyslnie zapisano ustawienia!')
    res.redirect(`/panel/manage/${req.params.id}/settings/payments`)
})

router.post('/:id/panel/settings/payments/hotpay', ifShopExists, isOwner, (req, res)=>{
    var hashedPassword = CryptoJS.AES.encrypt(req.body.password, require('../config/config').hashSecret).toString();
    hotpay.setNotyficationPass(req.params.id, hashedPassword);
    hotpay.setSecret(req.params.id, req.body.secret);
    hotpay.setName(req.params.id, req.body.name)
    if(!req.body.status_pp){
        pay.enableHotPay(req.params.id, false)
    }else{
        pay.enableHotPay(req.params.id, true)
    }
    req.flash('success', 'Pomyslnie zapisano ustawienia!')
    res.redirect(`/panel/manage/${req.params.id}/settings/payments`)
})

router.post('/:id/panel/settings/payments/hotpaypsc', ifShopExists, isOwner, (req, res)=>{
    var hashedPassword = CryptoJS.AES.encrypt(req.body.password, require('../config/config').hashSecret).toString();
    hpaypsc.setNotyficationPass(req.params.id, hashedPassword);
    hpaypsc.setSecret(req.params.id, req.body.secret);
    hpaypsc.setName(req.params.id, req.body.name)
    if(!req.body.status_hpaypsc){
        pay.enableHotPayPSC(req.params.id, false)
    }else{
        pay.enableHotPayPSC(req.params.id, true)
    }
    req.flash('success', 'Pomyslnie zapisano ustawienia!')
    res.redirect(`/panel/manage/${req.params.id}/settings/payments`)
})

router.post('/:id/panel/settings/payments/hotpaypsc', ifShopExists, isOwner, (req, res)=>{
    var hashedPassword = CryptoJS.AES.encrypt(req.body.password, require('../config/config').hashSecret).toString();
    hpaypsc.setNotyficationPass(req.params.id, hashedPassword);
    hpaypsc.setSecret(req.params.id, req.body.secret);
    hpaypsc.setName(req.params.id, req.body.name)
    if(!req.body.status_hpaypsc){
        pay.enableHotPayPSC(req.params.id, false)
    }else{
        pay.enableHotPayPSC(req.params.id, true)
    }
    req.flash('success', 'Pomyslnie zapisano ustawienia!')
    res.redirect(`/panel/manage/${req.params.id}/settings/payments`)
})

router.post('/:id/panel/settings/payments/pbl', ifShopExists, isOwner, (req, res)=>{
    pbl.setHash(req.params.id, req.body.hash);
    pbl.setshopID(req.params.id, req.body.shopid);
    pbl.setName(req.params.id, req.body.name)
    if(!req.body.status_pbl){
        pay.enablePayByLink(req.params.id, false)
    }else{
        pay.enablePayByLink(req.params.id, true)
    }
    req.flash('success', 'Pomyslnie zapisano ustawienia!')
    res.redirect(`/panel/manage/${req.params.id}/settings/payments`)
})

router.post('/:id/settings/general',ifShopExists,isOwner, (req, res)=>{
    shop.setBuyersCount(req.params.id, req.body.last_count);
    shop.setName(req.params.id, req.body.name);
    shop.updateWebHook(req.params.id, req.body.webhook_title, req.body.webhook_content, req.body.webhook_color, req.body.webhook_url);
    if(req.body.domain){
        db.query("SELECT * FROM `yshop_shops` WHERE domain = ?", [req.body.domain], function(err, result){
            if(!result[0] || result[0].id == req.params.id){
                if(req.body.domain == 'yshop.pl' || req.body.domain == 'localhost'){
                    req.flash('error', 'Ta domena jest juz zapisana w naszym systemie!')
                    res.redirect(`/panel/manage/${req.params.id}/settings/general`)
                    return
                }
                const conf = nginx.generateConfig(req.body.domain);
                switch(conf){
                    case 'success':
                        nginx.reloadNginx();
                        shop.setDomain(req.body.domain, req.params.id);
                        break;
                    case 'error':
                        req.flash('error', 'Wystapil blad!')
                        break
                }
                req.flash('success', 'Pomyslnie zapisano ustawienia!')
                res.redirect(`/panel/manage/${req.params.id}/settings/general`)
            }else{
                req.flash('error', 'Ta domena jest juz zapisana w naszym systemie!')
                res.redirect(`/panel/manage/${req.params.id}/settings/general`)
            }
        })
        return;
    }
    req.flash('success', 'Pomyslnie zapisano ustawienia!')
    res.redirect(`/panel/manage/${req.params.id}/settings/general`)
})

router.post('/:id/settings/connection',ifShopExists, isOwner, (req, res)=>{
    shop.updateConnection(req.params.id, req.body.ip, req.body.port, req.body.port_rcon, req.body.pass_rcon)
    req.flash('success', 'Pomyslnie zapisano ustawienia!')
    res.redirect(`/panel/manage/${req.params.id}/settings/connection`)
})

function isOwner(req, res, next){
    db.query("SELECT * FROM yshop_shops WHERE id = '"+req.params.id+"'", function(err, result){
        if(result[0].owner == req.session.username) return next();
        req.flash('error', 'Ten sklep nie nalezy do ciebie!')
        res.render('status')
    })
}

function ifShopExists(req, res, next){
    db.query("SELECT * FROM yshop_shops WHERE id = '"+req.params.id+"'", function(err, result){
        if(!result[0]){
            req.flash('error', 'Ten sklep nie istnieje!')
            res.render('status')
        }else{
            return next();
        }
    })
}
module.exports = router;