const db = require('../config/database');
const fetch = require('node-fetch')
const logger = require('../utils/logger')

exports.createShop = (name, ip, port, rconport, rconpass, owner, req, res, next)=>{
    fetch(`https://api.mcsrvstat.us/2/${ip}:${port}`).then((response) => {
        return response.json() 
    }).then((jsonData) => {
        if(jsonData.online == false){
            req.flash('error', 'Serwer jest offline!')
            res.redirect('/panel/addshop')
        }else{
            var x = Math.floor((Math.random() * 10000) + 1);
            db.query("INSERT INTO `yshop_shops`(`id`, `title`, `owner`, `status`, `money`, `serverip`, `serverport`, `rconport`, `rconpassword`, `shoptitle`, `shopname`, `shopcss`, `theme`, `createdate`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
                x, name, owner, true, 0, ip, port, rconport, rconpass, name, name, "Brak", "dark", Date.now()
            ], function(err, result) {
                if (err) {
                    logger.error("Wystapil blad!")
                    req.flash('error', 'Wystapil blad podczas tworzenia sklepu!')
                    res.redirect('/panel/addshop')
                }
            })

            db.query("INSERT INTO `yshop_payment_gateway`(`shopID`, `lvlup_enable`, `lvlupsms_enable`, `paypal_enable`, `hotpay_enable`, `hotpaypsc_enable`, `hotpaysms_enable`) VALUES (?,?,?,?,?,?,?)", [
                x, false, false, false, false, false, false
            ])
            req.flash('success', 'Sklep zostal pomyslnie utworzony!')
            res.redirect('/panel')
        }
    }).catch((err) => {
        console.log(err)
        req.flash('error', 'Wystapil blad podczas tworzenia sklepu!')
        res.redirect('/panel/addshop')
    });
}

exports.removeShop = (id, owner, req, res, next) =>{
    db.query("DELETE FROM `yshop_shops` WHERE id = '"+id+"' AND owner = '"+owner+"'", function(err, result){
        if(err) {
            req.flash('error', 'Wystapil blad podczas usuwania sklepu!')
            res.status(200).send();
            logger.error("Wystapil blad!")
            return;
        }
    })
    req.flash('success', `Sklep o id <b>${id}</b> zostal pomyslnie usuniety!`)
    res.redirect('/panel')
}

exports.setStyle = (id, link)=>{
    db.query("UPDATE `yshop_shops` SET `shopcss`='"+link+"' WHERE id = '"+id+"'", function(err, result){})
}

exports.setTheme = (id, theme)=>{
    db.query("UPDATE `yshop_shops` SET `theme`='"+theme+"' WHERE id = '"+id+"'", function(err, result){})
}

exports.setBuyersCount = (id, count)=>{
    db.query("UPDATE `yshop_shops` SET `lastbuyers_count`=? WHERE id = '"+id+"'",[count], function(err, result){})
}

exports.setName = (id, name)=>{
    db.query("UPDATE `yshop_shops` SET `title`=? WHERE id = '"+id+"'",[name], function(err, result){})
}

exports.updateConnection = (id, serverip, serverport, rcon_port, rcon_pass)=>{
    db.query("UPDATE `yshop_shops` SET `serverip`=?,`serverport`=?,`rconport`=?,`rconpassword`=? WHERE id = '"+id+"'",[serverip, serverport, rcon_port, rcon_pass], function(err, result){})
}

exports.updateWebHook=(id, title, content, color, url)=>{
    db.query("UPDATE `yshop_shops` SET `hook_title`=?,`hook_content`=?,`hook_color`=?,`hook_url`=? WHERE id = '"+id+"'", [title, content, color, url])
}

exports.setDomain=(name, shopID)=>{
    db.query("UPDATE `yshop_shops` SET `domain`=? WHERE id = ?", [name, shopID])
}

const getShop = (id, call)=>{
    db.query("SELECT * FROM yshop_shops WHERE id = '"+id+"'", function(err, result){
        call(result)
    })
}

const getShopsByOwner = (owner, call)=>{
    db.query("SELECT * FROM `yshop_shops` WHERE owner = '"+owner+"'", function(err, result){
        call(result)
    })
}

exports.getShop = getShop;
exports.getShopsByOwner = getShopsByOwner;