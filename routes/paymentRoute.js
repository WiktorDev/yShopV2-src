var express = require("express");
var router = express.Router();
const webhook = require('../utils/webhook');
const getPayment = require('../api/payment').getPayment
const payment = require('../api/payment')
const rcon = require('../api/rcon')
const shop = require('../api/shop')
const product = require('../api/products')

router.get('/redirect/:paymentUUID', function(req, res) {
    getPayment(req.params.paymentUUID, function(data){
        if(!data[0]){
            req.flash('error', 'Ta platnosc zostala juz wykonana lub nie istnieje!')
            res.render('status')
            return;
        }
        shop.getShop(data[0].shopID, function(shopData){
            product.getProduct(data[0].productID, function(pData){
                if(data[0].payed == true){
                    req.flash('error', 'Ta platnosc zostala juz wykonana lub nie istnieje!')
                    res.render('status')
                    return;
                }
                payment.completePayment(req.params.paymentUUID)
                var hook_content = shopData[0].hook_content;
                hook_content = hook_content.replace('{player}', data[0].nick).replace('{count}',data[0].count);
                webhook.sendHook(shopData[0].hook_url, hook_content)
                rcon.sendRcon(pData[0].cmd.replace('{player}', data[0].nick).replace('{count}', data[0].count), shopData[0].rconpassword, shopData[0].rconport, shopData[0].serverip, req, res);
                req.flash('success', 'Platnosc zostala zakonczona sukcesem!')
                res.render('status')
            })
        })
    })
})

router.get('/redirect/hotpay/:paymentUUID', function(req, res) {
    getPayment(req.params.paymentUUID, function(data){
        if(!data[0]){
            req.flash('error', 'Ta platnosc zostala juz wykonana lub nie istnieje!')
            res.render('status')
            return;
        }
        if(data[0].payed == true){
            req.flash('error', 'Ta platnosc zostala juz wykonana lub nie istnieje!')
            res.render('status')
            return;
        }
        if(data[0].paymentStatus != "SUCCESS"){
            req.flash('error', 'Ta platnosc zostala nie zostala oplacona!')
            res.render('status')
            return;
        }

        shop.getShop(data[0].shopID, function(shopData){
            product.getProduct(data[0].productID, function(pData){
                webhook.sendHook(shopData[0].hook_url, shopData[0].hook_content.replace('{player}', data[0].nick))
                rcon.sendRcon(pData[0].cmd.replace('{player}', data[0].nick), shopData[0].rconpassword, shopData[0].rconport, shopData[0].serverip, req, res);
                req.flash('success', 'Platnosc zostala zakonczona sukcesem!')
                res.render('status')
                payment.completePayment(req.params.paymentUUID)
            })
        })
    })
})


router.get('/hotpay', function(req, res){
    res.render('templates/hotpay')
})


module.exports = router;