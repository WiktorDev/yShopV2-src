const express = require("express");
const crypto = require('crypto')
const payment = require('../../api/payment')
const CryptoJS = require('crypto-js')
var router = express.Router();

router.post('/:shopID', (req, res)=>{
    payment.getPayments(req.params.shopID, function(data){
        var bytes = CryptoJS.AES.decrypt(data[0].hotpay_notification, 'ScgscJsDepcPqA2vhTJjd4FGN3kNEKY25Mf5skDcjLkwjgD67WBjx3PpDLbgD6j7YKuMND7jxarkEzhU3jstbudQUQgMNrqbf5Np')
        var notyficationPassword = bytes.toString(CryptoJS.enc.Utf8);
        var string = notyficationPassword+";"+req.body.KWOTA+";"+req.body.ID_PLATNOSCI+";"+req.body.ID_ZAMOWIENIA+";"+req.body.STATUS+";"+req.body.SECURE+";"+req.body.SEKRET;
        const hash = crypto.createHash('sha256').update(string).digest('hex');
        if(hash == req.body.HASH){
            logger.info(`Received POST request from HotPay with status: ${req.body.STATUS}`)
            switch(req.body.STATUS){
                case "SUCCESS":
                    payment.changeStatus('SUCCESS', req.body.ID_ZAMOWIENIA)
                    break;
                case "FAILURE":
                    payment.changeStatus('FAILURE', req.body.ID_ZAMOWIENIA)
                    break;
                case "PENDING":
                    payment.changeStatus('PENDING', req.body.ID_ZAMOWIENIA)
                    break;
            }
        }
    })
})

router.post('/psc/:shopID', (req, res)=>{
    payment.getPayments(req.params.shopID, function(data){
        var bytes = CryptoJS.AES.decrypt(data[0].hotpaypsc_notification, 'ScgscJsDepcPqA2vhTJjd4FGN3kNEKY25Mf5skDcjLkwjgD67WBjx3PpDLbgD6j7YKuMND7jxarkEzhU3jstbudQUQgMNrqbf5Np')
        var notyficationPassword = bytes.toString(CryptoJS.enc.Utf8);
        var string = notyficationPassword+";"+req.body.KWOTA+";"+req.body.ID_PLATNOSCI+";"+req.body.ID_ZAMOWIENIA+";"+req.body.STATUS+";"+req.body.SECURE+";"+req.body.SEKRET;
        const hash = crypto.createHash('sha256').update(string).digest('hex');
        if(hash == req.body.HASH){
            logger.info(`Received POST request from HotPayPSC with status: ${req.body.STATUS}`)
            switch(req.body.STATUS){
                case "SUCCESS":
                    payment.changeStatus('SUCCESS', req.body.ID_ZAMOWIENIA)
                    break;
                case "FAILURE":
                    payment.changeStatus('FAILURE', req.body.ID_ZAMOWIENIA)
                    break;
                case "PENDING":
                    payment.changeStatus('PENDING', req.body.ID_ZAMOWIENIA)
                    break;
            }
        }
    })
})

module.exports = router;