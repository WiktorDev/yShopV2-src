const express = require("express");
const ticket = require('../api/ticket')
var router = express.Router();

router.get('/new', function(req, res) {
    res.render('panel/tickets/newticket', {
        pageName: 'Dodawanie'
    })
})

router.post('/new', (req, res) => {
    ticket.openTicket(req.session.username, req.body.subject, req.body.category, req.body.content)
    req.flash('success', 'Zgloszenie zostalo pomyslnie wyslane! Do 24h otrzymasz odpowiedz.')
    res.redirect('/panel/tickets/new')
})

router.get('/',(req, res) => {
    ticket.getTickets(req.session.username, function(data){
        res.render('panel/tickets/open', {
            tickets: data, 
            pageName: 'Lista'
        })
    })
})



module.exports = router;