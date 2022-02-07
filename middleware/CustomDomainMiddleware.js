const db = require('../config/database');
const shop1 = require("../api/shop");
const product = require("../api/products");
const payment = require("../api/payment");
const getLastPayments = require("../api/payment").getLastPayments;
const voucher = require('../api/voucher')
const nav = require('../api/navigation')

module.exports = function(req, res, next){
    /**if(req.hostname == 'localhost' || req.hostname == 'yshop.pl'){
        return next();
    }*/
    db.query("SELECT * FROM `yshop_shops`", function(err, result){
        const shop = result.find(shop => shop.domain == req.hostname);
        if(!shop){
            return next()
        }
        var shopID = shop.id;

        shop1.getShop(shopID, function(result) {
            product.getProducts(shopID, function(data){
                payment.getPayments(shopID, function(payment){
                    getLastPayments(shopID, result[0].lastbuyers_count, function(log){
                        nav.getShopNavigation(shopID, function(navi){
                            if(result[0].theme == 'dark'){
                                res.render('templates/shop', { result: result, products: data, payment: payment, logs: log, nav: navi })
                            }else{
                                res.render('templates/shop2', { result: result, products: data, payment: payment, logs: log, nav: navi})
                            }
                        })
                    })
                })
            })
        })
        return
    })
}