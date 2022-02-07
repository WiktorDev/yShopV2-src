const db = require('../config/database')
const config = require('../config/config')
const Payment = require('polish-payments-lib');
const payment = require('../api/payment')
const product = require('../api/products');

exports.makePayment = (secret, notyficationPass, shopID, productID, name, price, uuid, nick, req, res, next)=>{
    const hpay = new Payment.HotPayPSC(secret, notyficationPass);
    if(req.body.count){
        totalPrice = price*req.body.count
    }else{
        totalPrice = price;
    }
    hpay.generatePayment(totalPrice, name, config.baseURL+"/payment/redirect/"+uuid, uuid).then((data)=>{
        if(JSON.parse(data).URL == null){
            req.flash('error', 'Wystąpił błąd podczas wykonywania płatności.')
            res.render('status')
        }else{
            product.getProduct(productID, function(pr){
                req.flash('redirect', JSON.parse(data).URL)
                if(req.body.count){
                    req.flash('redirect2', `Trwa realizacja płatności na nick <b>${nick}</b> i usluge <span style="text-decoration: underline">${req.body.count}x ${pr[0].name}</span>`)
                    payment.savePayment(shopID, uuid, 'hotpay-psc', productID,req.body.count, false, nick)
                }else{
                    req.flash('redirect2', `Trwa realizacja płatności na nick <b>${nick}</b> i usluge <span style="text-decoration: underline">${pr[0].name}</span>`)
                    payment.savePayment(shopID, uuid, 'hotpay-psc', productID,1, false, nick)
                }
                res.render('status')
            })
        }
    });
}

exports.setSecret = (shopID, secret)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `hotpaypsc_secret`='"+secret+"' WHERE `shopID`='"+shopID+"'")
}

exports.setNotyficationPass = (shopID, notyfication)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `hotpaypsc_notification`='"+notyfication+"' WHERE `shopID`='"+shopID+"'")
}

exports.setName = (shopID, name)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `hotpaypsc_name`='"+name+"' WHERE `shopID`='"+shopID+"'")
}

exports.generatePaymentURL= (price, service_name, redirec_url, order_id, email, personal_data) =>{

}