const LvlupApi = require('lvlup-js');
const db = require('../config/database')
const config = require('../config/config')
const payment = require('../api/payment')
const product = require('../api/products');

exports.makePayment = (apikey, shopID, productID, price, uuid, nick, req, res, next)=>{
    const lvlup = new LvlupApi(apikey);
    (async () => {
        if(req.body.count){
            totalPrice = price*req.body.count
        }else{
            totalPrice = price;
        }
        const linkForPayment = await lvlup.createPayment(totalPrice.toString(), config.baseURL+"/payment/redirect/"+uuid, 'https://ab7ac2cd6b28.ngrok.io/webhook');
        if(linkForPayment.statusCode == '401'){
            req.flash('error', 'Wystąpił błąd podczas wykonywania płatności. Prawdopodobnie nieprawidłowy klucz API lvlup')
            res.render('status')
        }else{
            product.getProduct(productID, function(pr){
                req.flash('redirect', linkForPayment.url)
                if(req.body.count){
                    req.flash('redirect2', `Trwa realizacja płatności na nick <b>${nick}</b> i usluge <span style="text-decoration: underline">${req.body.count}x ${pr[0].name}</span>`)
                    payment.savePayment(shopID, uuid, 'lvlup', productID,req.body.count, false, nick)
                }else{
                    req.flash('redirect2', `Trwa realizacja płatności na nick <b>${nick}</b> i usluge <span style="text-decoration: underline">${pr[0].name}</span>`)
                    payment.savePayment(shopID, uuid, 'lvlup', productID,1, false, nick)
                }
                res.render('status')
            })
        }
    })()
}

exports.setApiKey = (shopID, apikey)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `lvlup_apikey`='"+apikey+"' WHERE `shopID`='"+shopID+"'", function(err, result){
        if(err){
            console.log(err);
        }
    })
}

exports.setLvlupName = (shopID, name)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `lvlup_name`='"+name+"' WHERE `shopID`='"+shopID+"'", function(err, result){
        if(err){
            console.log(err);
        }
    })
}

exports.setLvlupSMSName = (shopID, name)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `lvlupsms_name`='"+name+"' WHERE `shopID`='"+shopID+"'", function(err, result){
        if(err){
            console.log(err);
        }
    })
}

exports.setID = (shopID, id)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `lvlup_id`='"+id+"' WHERE `shopID`='"+shopID+"'")
}