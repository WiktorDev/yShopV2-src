const db = require('../config/database');

exports.openTicket = (user, subject, category, content) =>{
    db.query("INSERT INTO `yshop_tickets`(`user`, `subject`, `category`, `content`, `status`, `openDate`) VALUES (?, ?, ?, ?, ?, ?)", [
        user, subject, category, content, "open", Date.now()
    ])
}

const getTickets = (user, call)=>{
    db.query("SELECT * FROM `yshop_tickets` WHERE user = '"+user+"'", function(err, result){
        call(result)
    })
}

const getAllTickets = (call)=>{
    db.query("SELECT * FROM `yshop_tickets`", function(err, result){
        call(result)
    })
}

exports.getAllTickets = getAllTickets;
exports.getTickets = getTickets;