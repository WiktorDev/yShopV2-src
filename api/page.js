const db = require('../config/database')

exports.createNewPage=(req, res)=>{
    db.query("INSERT INTO `yshop_pages`(`shopID`, `name`, `template`, `content`, `createDate`) VALUES (?,?,?,?,?)", [req.params.id, req.body.name, req.body.template, req.body.content, Date.now()],function(err, result){
        if(err) console.log(err);
    })
    req.flash('success', 'Podstrona zostala pomyslnie dodana!')
    res.redirect(`/panel/manage/${req.params.id}/navigation`)
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

exports.getShopPages = (shopID, call)=>{ 
    db.query("SELECT * FROM yshop_pages WHERE shopID = '"+shopID+"'", function(err, result){
        call(result)
    })
}

exports.getShopPage=(shopID, pageName, call)=>{
    db.query("SELECT * FROM yshop_pages WHERE shopID = ? AND name = ?",[shopID, pageName], function(err, result){
        call(result)
    })
}