const db= require('../config/database')
const config = require('../config/config')
const payment1 = require('../api/payment')
const paypal = require('paypal-rest-sdk');

exports.makePayment= (clientId, clientSecret, email, shopID, productID, uuid, nick, req, res, next)=>{
    db.query("SELECT * FROM `yshop_products` WHERE shopID =? AND productID = ?", [shopID, productID], function(err, result){
        paypal.configure({
            'mode': 'live',
            'account': email,
            'client_id': clientId,
            'client_secret': clientSecret
        });
      
        if(req.body.count){
            totalPrice = parseInt(result[0].paypal_price)*req.body.count
        }else{
            totalPrice = result[0].paypal_price;
        }
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": config.baseURL+"/payment/redirect/"+uuid,
                "cancel_url": config.baseURL+"/shop/"+shopID
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": result[0].name,
                        "sku": "001",
                        "price": parseFloat(totalPrice),
                        "currency": "PLN",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "PLN",
                    "total": parseFloat(totalPrice)
                },
                "description": "yshop.pl product " + productID
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response.details)
            } else {
                for(let i = 0;i < payment.links.length;i++){
                    if(payment.links[i].rel === 'approval_url'){
                        req.flash('redirect', payment.links[i].href)
                        if(req.body.count){
                            req.flash('redirect2', `Trwa realizacja płatności na nick <b>${nick}</b> i usluge <span style="text-decoration: underline">${req.body.count}x ${result[0].name}</span>`)
                            payment1.savePayment(shopID, uuid, 'paypal', productID,req.body.count, false, nick)
                        }else{
                            req.flash('redirect2', `Trwa realizacja płatności na nick <b>${nick}</b> i usluge <span style="text-decoration: underline">${result[0].name}</span>`)
                            payment1.savePayment(shopID, uuid, 'paypal', productID,1, false, nick)
                        }
                        res.render('status')
                    }
                }
            }
        });
    })
}

exports.setEmail = (shopID, email)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `paypal_email`='"+email+"' WHERE `shopID`='"+shopID+"'")
}

exports.setName = (shopID, name)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `paypal_name`='"+name+"' WHERE `shopID`='"+shopID+"'", function(err, result){
        if(err){
            console.log(err);
        }
    })
}

exports.setClient = (shopID, id, secret)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `paypal_clientID`='"+id+"', `paypal_clientSecret`='"+secret+"' WHERE `shopID`='"+shopID+"'", function(err, result){
        if(err){
            console.log(err);
        }
    })
}