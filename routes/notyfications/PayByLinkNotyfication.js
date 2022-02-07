const express = require("express");
const payment = require('../../api/payment')
const Payment = require('polish-payments-lib')
var router = express.Router();

router.post('/', (req, res)=>{
    const pbl = new Payment.PayByLink('shopID (int)', 'hash');
    var ipnHash = pbl.generateIpnHash(req.body)
    console.log(`Received ${req.method} request!`)
    if(ipnHash == req.body.signature){
        console.log(`Payment ID: ${req.body.transactionId}`)
        res.set('Content-Type', 'text/plain');
        return res.status(200).send("OK");
    }
})