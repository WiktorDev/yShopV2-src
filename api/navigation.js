const db = require('../config/database')

exports.createNavigation=(shopID, name, value, req, res)=>{
    db.query("INSERT INTO `yshop_navigation`(`shopID`, `name`, `type`, `value`, `date`) VALUES (?,?,?,?,?)", [shopID, name, "REDIR", value, Date.now()], function(err, result){
        if(err) {
            req.flash('error', 'Wystapil blad podczas usuwania sklepu!')
            res.redirect(`/panel/manage/${shopID}/navigation`)
            logger.error("Wystapil blad!")
            return;
        }
    })
    req.flash('success', 'Przekierowanie zostalo pomyslnie dodane do nawigacji!')
    res.redirect(`/panel/manage/${shopID}/navigation`)
}

exports.removeNavigation = (shopID, navID, req, res, next) =>{
    db.query("DELETE FROM `yshop_navigation` WHERE shopID = '"+shopID+"' AND id = '"+navID+"'", function(err, result){
        if(err) {
            req.flash('error', 'Wystapil blad podczas usuwania linku!')
            res.redirect(`/panel/manage/${shopID}/navigation`)
            logger.error("Wystapil blad!")
        }
    })
    req.flash('success', `Link o id <b>${navID}</b> zostal pomyslnie usuniety!`)
    res.redirect(`/panel/manage/${shopID}/navigation`)
}

const getShopNavigation = (shopID, call)=>{ 
    db.query("SELECT * FROM yshop_navigation WHERE shopID = '"+shopID+"'", function(err, result){
        call(result)
    })
}

exports.getShopNavigation = getShopNavigation;