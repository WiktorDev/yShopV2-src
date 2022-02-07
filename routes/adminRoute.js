const express = require("express");
const ticket = require('../api/ticket')
var router = express.Router();

router.get('/', (req, res)=>{
    ticket.getAllTickets(function(data){
        res.render('admin/index')
    })
})


module.exports = router;