const db = require('../config/database');
const logger = require('../utils/logger')


exports.addProduct = (shopID, name, lvlup_price, lvlupsms_price, paypal_price, hotpay_price, hotpaysms_price, hotpaypsc_price, image, description, cmd, type, mincount, maxcount)=>{
    var productID = Math.floor((Math.random() * 10000) + 1);
    db.query("INSERT INTO `yshop_products`(`shopID`, `productID`, `name`, `lvlup_price`, `lvlupsms_price`, `paypal_price`, `hotpay_price`, `hotpaysms_price`, `hotpaypsc_price`, `image`, `description`, `cmd`, `type`, `mincount`, `maxcount`, `buyCount`, `date`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        shopID, productID, name, lvlup_price, lvlupsms_price, paypal_price, hotpay_price, hotpaysms_price, hotpaypsc_price, image, description, cmd, type, mincount, maxcount, 0, Date.now()
    ], function(err, result) {
        if (err) {
            logger.error("Wystapil blad!")
        }
    })
}

exports.editProduct=(shopID, productID, name, lvlup_price, lvlupsms_price, paypal_price, hotpay_price, hotpaysms_price, hotpaypsc_price, pbl_price, pblpsc_price, pbldb_price, pblsms_price, image, description, cmd)=>{
    db.query("UPDATE `yshop_products` SET `name`=?,`lvlup_price`=?,`lvlupsms_price`=?,`paypal_price`=?,`hotpay_price`=?,`hotpaysms_price`=?,`hotpaypsc_price`=?, `pbl_price`=?, `pblpsc_price`=?, `pbldb_price`=?, `pblsms_price`=?, `image`=?,`description`=?,`cmd`=? WHERE shopID='"+shopID+"' AND productID='"+productID+"'", [
        name, lvlup_price, lvlupsms_price, paypal_price, hotpay_price, hotpaysms_price, hotpaypsc_price, pbl_price, pblpsc_price, pbldb_price, pblsms_price, image, description, cmd
    ])
}

exports.removeProduct = (shopID, productID, req, res, next) =>{
    db.query("DELETE FROM `yshop_products` WHERE shopID = '"+shopID+"' AND productID = '"+productID+"'", function(err, result){
        if(err) {
            req.flash('error', 'Wystapil blad podczas usuwania produktu!')
            res.status(200).send();
            logger.error("Wystapil blad!")
        }
    })
    req.flash('success', `Produkt o id <b>${productID}</b> zostal pomyslnie usuniety!`)
    res.redirect(`/panel/manage/${shopID}/products`)
}

const getProducts = (shopID, call)=>{ 
    db.query("SELECT * FROM yshop_products WHERE shopID = '"+shopID+"'", function(err, result){
        call(result)
    })
}
const getProduct = (productID, call)=>{ 
    db.query("SELECT * FROM yshop_products WHERE productID = '"+productID+"'", function(err, result){
        call(result)
    })
}

exports.getProduct = getProduct;
exports.getProducts = getProducts;