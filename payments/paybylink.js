const db = require('../config/database')
const config = require('../config/config')
const Payment = require('polish-payments-lib');
const payment = require('../api/payment')
const product = require('../api/products');

exports.makePayment = (serviceID, hash, shopID, productID, name, price, uuid, nick, req, res, next)=>{
    const pbl = new Payment.PayByLink(parseInt(serviceID), hash);
    if(req.body.count){
        totalPrice = price*req.body.count
    }else{
        totalPrice = price;
    }
    pbl.generatePayment(totalPrice, uuid, null, null, config.baseURL+"/payment/redirect/"+uuid, 'https://yshop.pl/notyfication/paybylink/'+shopID).then((response)=>{
        if(response.errorCode){
            req.flash('error', `Wystapil blad podczas generowania platnosci!`)
            res.redirect(`/shop/${shopID}/buy/${productID}`)   
            return;
        }
        product.getProduct(productID, function(pr){
            req.flash('redirect', response.url)
            if(req.body.count){
                req.flash('redirect2', `Trwa realizacja płatności na nick <b>${nick}</b> i usluge <span style="text-decoration: underline">${req.body.count}x ${pr[0].name}</span>`)
                payment.savePayment(shopID, uuid, 'PayBylink', productID,req.body.count, false, nick, response.transactionId)
            }else{
                req.flash('redirect2', `Trwa realizacja płatności na nick <b>${nick}</b> i usluge <span style="text-decoration: underline">${pr[0].name}</span>`)
                payment.savePayment(shopID, uuid, 'PayByLink', productID,1, false, nick, response.transactionId)
            }
            res.render('status')
        })
    })
}

exports.setshopID = (shopID, id)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `pbl_shopid`='"+id+"' WHERE `shopID`='"+shopID+"'")
}

exports.setHash = (shopID, hash)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `pbl_hash`='"+hash+"' WHERE `shopID`='"+shopID+"'")
}

exports.setName = (shopID, name)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `pbl_name`='"+name+"' WHERE `shopID`='"+shopID+"'")
}