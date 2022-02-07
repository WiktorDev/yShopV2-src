const db = require('../config/database')

exports.addVoucher=(shopID, voucherCode, productID)=>{
    var voucherID = Math.floor((Math.random() * 10000) + 1);
    db.query("INSERT INTO `yshop_vouchers`(`shopID`, `voucherID`, `voucherCode`, `productID`, `createDate`, used) VALUES (?, ?, ?, ?, ?, false)", [
        shopID, voucherID, voucherCode, productID, Date.now()
    ])
}

exports.useVoucher=(shopID, voucherID, nick)=>{
    db.query("UPDATE `yshop_vouchers` SET `useDate`= ?,`nick`= ?,`used`=true WHERE shopID='"+shopID+"' AND voucherID='"+voucherID+"'", [
        Date.now(), nick
    ])
}

const getVouchers = (shopID, call)=>{ 
    db.query("SELECT * FROM yshop_vouchers WHERE shopID = '"+shopID+"' ORDER BY createDate DESC", function(err, result){
        call(result)
    })
}
const getVoucher = (voucherID, call)=>{ 
    db.query("SELECT * FROM yshop_vouchers WHERE voucherID = '"+voucherID+"'", function(err, result){
        call(result)
    })
}

const getVoucherByCode = (voucherCode, call)=>{ 
    db.query("SELECT * FROM yshop_vouchers WHERE voucherCOde = '"+voucherCode+"'", function(err, result){
        call(result)
    })
}

exports.getVoucherByCode = getVoucherByCode
exports.getVoucher = getVoucher;
exports.getVouchers = getVouchers;