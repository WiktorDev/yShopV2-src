const db = require('../config/database')
const validator = require('validator');

exports.validatePrice = (lvlup_price, paypal_price, hotpay_price, hotpaypsc_price, shopID, req, res)=>{
    if(validator.isCurrency(lvlup_price.toString()) == false){
        req.flash('error', 'Zostal wprowadzony niepoprawny format ceny LVLUP!')
        res.redirect(`/panel/manage/${shopID}/addproduct`)
        return;
    }
    if(validator.isCurrency(paypal_price.toString()) == false){
        req.flash('error', 'Zostal wprowadzony niepoprawny format ceny PayPal!')
        res.redirect(`/panel/manage/${shopID}/addproduct`)
        return;
    }
    if(validator.isCurrency(hotpay_price.toString()) == false){
        req.flash('error', 'Zostal wprowadzony niepoprawny format ceny HOTPAY!')
        res.redirect(`/panel/manage/${shopID}/addproduct`)
        return;
    }
    if(validator.isCurrency(hotpaypsc_price.toString()) == false){
        req.flash('error', 'Zostal wprowadzony niepoprawny format ceny HOTPAY PSC!')
        res.redirect(`/panel/manage/${shopID}/addproduct`)
        return;
    }
}


//Setters
exports.enableLVLUP = (shopID, boolean)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `lvlup_enable`="+boolean+" WHERE `shopID`='"+shopID+"'")
}

exports.enablePayPal = (shopID, boolean)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `paypal_enable`="+boolean+" WHERE `shopID`='"+shopID+"'")
}

exports.enableHotPay = (shopID, boolean)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `hotpay_enable`="+boolean+" WHERE `shopID`='"+shopID+"'")
}

exports.enableHotPayPSC = (shopID, boolean)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `hotpaypsc_enable`="+boolean+" WHERE `shopID`='"+shopID+"'")
}

exports.enablePayByLink = (shopID, boolean)=>{
    db.query("UPDATE `yshop_payment_gateway` SET `pbl_enable`="+boolean+" WHERE `shopID`='"+shopID+"'")
}

exports.savePayment = (shopID, uuid, type, productID, count, payed, nick, control=null)=>{
    db.query("SELECT * FROM `yshop_products` WHERE productID='"+productID+"'", function(err, result){
        db.query("INSERT INTO `yshop_payments`(`shopID`, `paymetUUID`, `type`, `productID`, `count`, `productName`, `payed`, `paymentStatus`, `nick`, `date`, `control`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)", [shopID, uuid, type, productID, count, result[0].name, payed, 'FAILURE', nick, Date.now(), control])
    })
}

exports.completePayment=(uuid)=>{
    db.query("UPDATE `yshop_payments` SET `payed`=true WHERE paymetUUID='"+uuid+"'")
}

exports.changeStatus=(status, uuid)=>{
    db.query("UPDATE `yshop_payments` SET `paymentStatus`='"+status+"' WHERE paymetUUID='"+uuid+"'")
}


//Getters
const getPayments = (shopID, call)=>{
    db.query("SELECT * FROM yshop_payment_gateway WHERE shopID = '"+shopID+"'", function(err, result){
        call(result)
    })
}

const getPayment = (uuid, call)=>{
    db.query("SELECT * FROM yshop_payments WHERE paymetUUID = '"+uuid+"'", function(err, result){
        call(result)
    })
}

const getPaymentsLog= (shopID, call)=>{
    db.query("SELECT * FROM yshop_payments WHERE shopID = '"+shopID+"' ORDER BY date DESC", function(err, result){
        call(result)
    })
}

const getLastPayments= (shopID, count, call)=>{
    db.query("SELECT * FROM yshop_payments WHERE shopID = '"+shopID+"' AND payed = true ORDER BY date DESC LIMIT "+count, function(err, result){
        call(result)
    })
}


exports.getLastPayments = getLastPayments
exports.getPaymentsLog = getPaymentsLog;
exports.getPayment = getPayment;
exports.getPayments = getPayments;