const express = require("express");
const db = require('../config/database');
const shop = require("../api/shop");
const getPayments = require("../api/payment").getPayments
const getPaymentsLog = require('../api/payment').getPaymentsLog
const getVouchers = require('../api/voucher').getVouchers
const voucher = require('../api/voucher');
const nav = require('../api/navigation')
const product = require('../api/products');
const validator = require('validator');
const webhook = require('../utils/webhook');
const payment = require('../api/payment')
const rcon = require('../api/rcon')
const random = require('../utils/random');
const page = require('../api/page');

var router = express.Router();

router.get('/:id', ifShopExists, isOwner, (req, res) => {
    shop.getShop(req.params.id, function(data){
        res.render('panel/manage', {
            result: data,
            pageName: 'root'
        })
    })
})

router.get('/:id/products',ifShopExists, isOwner,  (req, res)=>{
    shop.getShop(req.params.id, function(data){
        product.getProducts(req.params.id, function(data1){
            getPayments(req.params.id, function(data2){
                res.render('panel/products', {
                    result: data,
                    products: data1,
                    payment: data2,
                    pageName: 'Produkty'
                })
            })
        })
    })
})

router.get('/:id/vouchers', ifShopExists, isOwner, (req, res)=>{
    shop.getShop(req.params.id, function(data){
        getVouchers(req.params.id, function(data1){
            product.getProducts(req.params.id, function(products){
                res.render('panel/vouchers', {
                    result: data,
                    vouchers: data1,
                    products: products,
                    pageName: 'Vouchery'
                })
            })
        })
    })
})

router.get('/:id/addproduct', ifShopExists, isOwner, (req, res)=>{
    shop.getShop(req.params.id, function(data){
        getPayments(req.params.id, function(data1){
            if(!data[0]){
                req.flash('error', 'Ten sklep nie istnieje!')
                res.render('status')
                return;
            }
            res.render('panel/addproduct', {
                result: data,
                payment: data1,
                pageName: 'Dodawanie produktu'
            })
        })
    })
})


router.post('/:id/editproduct/:pid',ifShopExists, isOwner, (req, res) => {
    product.editProduct(req.params.id, req.params.pid, req.body.edit_name, req.body.lvlup, req.body.lvlup_sms, req.body.paypal, req.body.hotpay, req.body.hotpay_sms, req.body.hotpay_psc, req.body.pbl, req.body.pbl_psc, req.body.pbldb, req.body.pblsms, req.body.edit_image, req.body.description, req.body.edit_cmd)
    req.flash('success', 'Produkt zostal pomyslnie zaktualizowany!')
    res.redirect(`/panel/manage/${req.params.id}/products`);
})

router.post('/:id/addproduct', ifShopExists, isOwner, (req, res) => {
    const name = req.body.name;
    const img = req.body.image;
    const description = req.body.description;
    const cmd = req.body.cmd;
    const lvlupsms_price = req.body.lvlup_sms || 0;
    const hotpaysms_price = req.body.hotpay_sms || 0;
    const lvlup_price = req.body.lvlup || 0;
    const paypal_price = req.body.paypal || 0;
    const hotpay_price = req.body.hotpay || 0;
    const hotpaypsc_price = req.body.hotpay_psc || 0;
    const suwak = req.body.select;
    const max = req.body.max || 0;
    const min = req.body.min || 0;

    if(!name || !img || !description || !cmd) {
        req.flash('error', 'Prosze uzupelnic wszystkie luki!')
        res.redirect(`/panel/manage/${req.params.id}/addproduct`)
        return;
    }
    if(validator.isCurrency(lvlup_price.toString()) == false || validator.isCurrency(paypal_price.toString()) == false || validator.isCurrency(hotpay_price.toString()) == false || validator.isCurrency(hotpaypsc_price.toString()) == false ){
        req.flash('error', 'Zostal wprowadzony niepoprawny format ceny!')
        res.redirect(`/panel/manage/${req.params.id}/addproduct`)
        return;
    }
    product.addProduct(req.params.id, name, lvlup_price, lvlupsms_price, paypal_price, hotpay_price, hotpaysms_price, hotpaypsc_price, img, description, cmd, suwak.replace('1', 'suwak').replace('2', 'bezsuw'),min, max)
    req.flash('success', 'Produkt zostal pomyslnie dodany!')
    res.redirect(`/panel/manage/${req.params.id}/addproduct`)
})

router.post('/:id/addvoucher', ifShopExists, isOwner, (req, res)=>{
    const code = req.body.code || random.makeid(7);
    voucher.addVoucher(req.params.id, code, req.body.product)
    req.flash('success', 'Pomyslnie dodano nowy voucher!')
    res.redirect(`/panel/manage/${req.params.id}/vouchers`)

})
router.get('/:id/payments', ifShopExists, isOwner, (req, res)=>{
    shop.getShop(req.params.id, function(shop) {
        getPaymentsLog(req.params.id, function(data){
            const resultsPerPage = 10;
            const numOfResults = data.length;
            const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            let page = req.query.page ? Number(req.query.page) : 1;
            if(page > numberOfPages){
                res.redirect(`/panel/manage/${req.params.id}/payments/?page=`+encodeURIComponent(numberOfPages));
                return;
            }else if(page < 1){
                res.redirect(`/panel/manage/${req.params.id}/payments/?page=`+encodeURIComponent('1'));
                return;
            }
            const startingLimit = (page - 1) * resultsPerPage;

            sql = `SELECT * FROM yshop_payments WHERE shopID = '${req.params.id}' ORDER BY date DESC LIMIT ${startingLimit},${resultsPerPage}`
            db.query(sql, (err, result)=>{
                if(err) throw err;
                let iterator = (page - 5) < 1 ? 1 : page - 5;
                let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                if(endingLink < (page + 4)){
                    iterator -= (page + 4) - numberOfPages;
                }
                res.render('panel/payments', {
                    result: shop,
                    data: result, page, iterator, endingLink, numberOfPages,
                    pageName: 'Logi platnosci'
                })
            });
        })
    })
})

router.get('/:id/navigation', ifShopExists, isOwner, (req, res)=>{
    shop.getShop(req.params.id, function(shop) {
        nav.getShopNavigation(req.params.id, function(nav){
            res.render('panel/navigation', {
                navigation: nav,
                result: shop,
                pageName: 'Nawigacja'
            })
        })
    })
})

router.post('/:id/addnav', ifShopExists, isOwner, (req, res)=>{
    nav.createNavigation(req.params.id, req.body.name, req.body.value, req, res);
})

router.get('/:id/action/delnav/:navID', ifShopExists, isOwner, (req, res)=>{
    nav.removeNavigation(req.params.id, req.params.navID, req, res);
})

router.get('/:id/pages', ifShopExists, isOwner, (req, res)=>{
    shop.getShop(req.params.id, function(shop) {
        page.getShopPages(req.params.id, function(page){
            res.render('panel/pages', { page: page, result: shop,pageName: 'Podstrony' })
        })
    })
})

router.post('/:id/addpage', ifShopExists, isOwner, (req, res)=>{
    if(req.body.template == 'none'){
        page.createNewPage(req, res);
        return;
    }
    req.flash('error', `Wybrany szablon jest niepoprawny lub zle skonfigurowany!`)
    res.redirect(`/panel/manage/${req.params.id}/pages`)
})


router.get('/:id/action/delshop', ifShopExists, isOwner, (req, res)=>{
    shop.removeShop(req.params.id, req.session.username, req, res);
})

router.get('/:id/action/delproduct/:productID', ifShopExists, isOwner, (req, res)=>{
    product.removeProduct(req.params.id, req.params.productID, req, res);
})

router.get('/:id/payment/:uuid/complete', ifShopExists, isOwner, (req, res)=>{
    payment.getPayment(req.params.uuid, function(data){
        if(!data[0]){
            req.flash('error', 'Ta platnosc zostala juz wykonana lub nie istnieje!')
            res.redirect(`/panel/manage/${req.params.id}/payments`);
            return;
        }
        shop.getShop(data[0].shopID, function(shopData){
            product.getProduct(data[0].productID, function(pData){
                if(data[0].payed == true){
                    req.flash('error', 'Ta platnosc zostala juz wykonana lub nie istnieje!')
                    res.render('status')
                    return;
                }
                payment.completePayment(req.params.uuid)
                var hook_content = shopData[0].hook_content;
                hook_content = hook_content.replace('{player}', data[0].nick).replace('{count}',data[0].count);
                var cmd = pData[0].cmd;
                cmd = cmd.replace('{player}', data[0].nick).replace('{count}', data[0].count)
                webhook.sendHook(shopData[0].hook_url, hook_content)
                rcon.sendRcon(cmd, shopData[0].rconpassword, shopData[0].rconport, shopData[0].serverip, req, res);
                req.flash('success', 'Platnosc zostala zakonczona sukcesem!')
                res.redirect(`/panel/manage/${req.params.id}/payments`);
            })
        })
    })
})

router.get('/:id/api',ifShopExists, isOwner, (req, res)=>{
    shop.getShop(req.params.id, function(shop) {
        res.render('panel/api', { result: shop, pageName: 'API' })
    })
})

router.post('/:id/generate', ifShopExists, isOwner, (req, res)=>{
    req.flash('success', 'Klucz API zostal wygenerowany!')
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