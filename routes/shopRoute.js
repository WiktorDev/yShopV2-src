var express = require("express");
const { uuid } = require('uuidv4');
const shop = require("../api/shop");
const product = require("../api/products");
const payment = require("../api/payment");
const getLastPayments = require("../api/payment").getLastPayments;
const voucher = require('../api/voucher')
const nav = require('../api/navigation')
const webhook = require('../utils/webhook')
const lvlup = require('../payments/lvlup')
const hotpay = require('../payments/hotpay')
const pbl = require('../payments/paybylink')
const rcon = require('../api/rcon')
const db = require('../config/database')
const paypal = require('../payments/paypal');
const CryptoJS = require('crypto-js')
const page = require('../api/page')
var router = express.Router();

router.get('/:id', function(req, res) {
    shop.getShop(req.params.id, function(result) {
        product.getProducts(req.params.id, function(data){
            payment.getPayments(req.params.id, function(payment){
                if(!result[0]){
                    req.flash('error', 'Ten sklep nie istnieje!')
                    res.render('status')
                    return;
                }
                getLastPayments(req.params.id, result[0].lastbuyers_count, function(log){
                    nav.getShopNavigation(req.params.id, function(navi){
                        if(result[0].theme == 'dark'){
                            res.render('templates/tmpl3/index', {
                                result: result,
                                products: data,
                                payment: payment,
                                logs: log,
                                nav: navi
                            })
                        }else{
                            res.render('templates/shop2', {
                                result: result,
                                products: data,
                                payment: payment,
                                logs: log,
                                nav: navi
                            })
                        }
                    })
                })
            })
        })
    })
})

router.get('/:id/buy/:productID', (req, res)=>{
    shop.getShop(req.params.id, function(result) {
        product.getProduct(req.params.productID, function(data){
            payment.getPayments(req.params.id, function(payment){
                if(!result[0]){
                    req.flash('error', 'Ten sklep nie istnieje!')
                    res.render('status')
                    return;
                }
                if(!data[0]){
                    req.flash('error', 'Ten produkt nie istnieje!')
                    res.render('status')
                    return;
                }
                nav.getShopNavigation(req.params.id, function(navi){
                    res.render('templates/tmpl3/buy', { result: result, product: data, payment: payment, nav: navi})
                })
            })
        })
    })
})

router.get('/:id/page/:name', (req, res)=>{
    shop.getShop(req.params.id, function(result) {
        if(!result[0]){
            req.flash('error', 'Ten sklep nie istnieje!')
            res.render('status')
            return;
        }
        page.getShopPage(req.params.id, req.params.name, function(page){
            if(!page[0]){
                req.flash('error', 'Ta podstrona nie istnieje!')
                res.render('status')
                return;
            }
            nav.getShopNavigation(req.params.id, function(navi){
                res.render('templates/tmpl3/page', { result: result, nav: navi, page: page})
            })
        })
    })
})
router.post('/:shopID/service/:productID/payment', (req, res) => {
    const paymentMethod = req.body.method
    switch(paymentMethod){
        case 'lvlup':
            product.getProduct(req.params.productID, function(data){
                db.query("SELECT * FROM `yshop_payment_gateway` WHERE shopID = ?", [req.params.shopID], function(err, result){
                    const price = data[0].lvlup_price;
                    lvlup.makePayment(result[0].lvlup_apikey, req.params.shopID, req.params.productID, price.toString(), uuid(),req.body.nick, req, res)
                })
            })
            break;
        case 'paypal':
            product.getProduct(req.params.productID, function(data){
                db.query("SELECT * FROM `yshop_payment_gateway` WHERE shopID = ?", [req.params.shopID], function(err, result){
                    paypal.makePayment(result[0].paypal_clientID, result[0].paypal_clientSecret, result[0].paypal_email, req.params.shopID, req.params.productID, uuid(), req.body.nick, req, res)
                })
            })
            break;
        case 'hotpay':
            product.getProduct(req.params.productID, function(data){
                db.query("SELECT * FROM `yshop_payment_gateway` WHERE shopID = ?", [req.params.shopID], function(err, result){
                    const price = data[0].hotpay_price;
                    var bytes = CryptoJS.AES.decrypt(result[0].hotpay_notification, 'ScgscJsDepcPqA2vhTJjd4FGN3kNEKY25Mf5skDcjLkwjgD67WBjx3PpDLbgD6j7YKuMND7jxarkEzhU3jstbudQUQgMNrqbf5Np')
                    hotpay.makePayment(result[0].hotpay_secret, bytes.toString(CryptoJS.enc.Utf8), req.params.shopID, req.params.productID, data[0].name, price, uuid(), req.body.nick, req, res)
                })
            })
            break;
        case 'hotpay_sms':
            req.flash('success', 'HOTPAY SMS')
            res.render('status')
            break;
        case 'hotpay_psc':
            req.flash('success', 'HOTPAY PSC')
            res.render('status')
            break;
        case 'pbl':
            product.getProduct(req.params.productID, function(data){
                db.query("SELECT * FROM `yshop_payment_gateway` WHERE shopID = ?", [req.params.shopID], function(err, result){
                    const price = data[0].pbl_price;
                    pbl.makePayment(result[0].pbl_shopid, result[0].pbl_hash, req.params.shopID, req.params.productID, data[0].name, price, uuid(), req.body.nick, req, res)
                })
            })
            break;
        default:
            req.flash('error', 'Prosze wybrac metode platnosci! ' + req.body.method)
            res.redirect(`/shop/${req.params.shopID}/buy/${req.params.productID}`)
    }
})
router.get('/:id/buy/:productID', function(req, res) {
    shop.getShop(req.params.id, function(data){
        if(!data[0]){
            req.flash('error', 'Ten sklep nie istnieje!')
            res.render('status')
            return;
        }
        res.render('templates/buy', {
            result: data
        })
    })
})

router.post('/:id/usevoucher', (req, res)=>{
    shop.getShop(req.params.id, function(shop){
        if(shop[0].srv_status == false){
            req.flash('error', 'Serwer jest wylaczony!')
            res.redirect(`/shop/${req.params.id}`)
        }else{
            voucher.getVoucherByCode(req.body.voucher_code, function(data){
                if(!data[0]){
                    req.flash('error', 'Wpisany kod vouchera jest niepoprawny!')
                    res.redirect(`/shop/${req.params.id}`)
                    return;
                }
                if(data[0].used == true){
                    req.flash('error', 'Ten voucher zostal juz uzyty!')
                    res.redirect(`/shop/${req.params.id}`)
                    return;
                }
                product.getProduct(data[0].productID, function(p){
                    webhook.sendHook('https://discord.com/api/webhooks/879741889253875712/BA9khH9-Qri2UmLCMUoUf4icdawcfOg_xHV30xtnzN8smg2cM9brig86L4hMbQ83qGNy', `Gracz ${req.body.voucher_nick} zakupil ${p[0].name}`)
                    voucher.useVoucher(req.params.id, data[0].voucherID, req.body.voucher_nick)
                    rcon.sendRcon(p[0].cmd.replace('{player}', req.body.voucher_nick), shop[0].rconpassword, shop[0].rconport, shop[0].serverip, req, res);
                    req.flash('success', 'Pomyslnie wykorzystano voucher!')
                    res.redirect(`/shop/${req.params.id}`)
                })
            })
        }
    })
})

module.exports = router;