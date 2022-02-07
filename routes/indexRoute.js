const express = require("express");
const router = express.Router();
const moment = require('moment')
const config = require('../config/config')
const cors = require('cors');

var corsOptions = {
    origin: config.baseURL,
    optionsSuccessStatus: 200
}

router.use(function(req,res,next){
    res.locals.moment = moment;
    next();
});

router.get('/',cors(corsOptions), chechHostname, (req, res) => {
    res.render('index')
})

router.get('/privacy', chechHostname, (req, res) => {
    res.render('privacy')
})

router.use("/auth", chechHostname, require("./authRoute"));
router.use("/panel", chechHostname, isLoggedIn, require("./panelRoute"));
router.use("/panel/manage", chechHostname, isLoggedIn, require("./manageRoute"));
router.use("/shop", chechHostname, require("./shopRoute"))
router.use("/panel/manage", chechHostname, isLoggedIn, require("./settingsRoute"));
router.use("/panel/tickets", chechHostname, isLoggedIn, require("./ticketsRoute"));
router.use("/payment", chechHostname, require("./paymentRoute"));
router.use("/api", chechHostname, require("./apiRoute"));
router.use('/notyfication/hotpay', require('./notyfications/HotPayNotyficationServer'));
router.use("/*", chechHostname, require('./errorRoute'));

function isLoggedIn(req,res,next){
	if(req.session.loggedin == true)
		return next();
    req.flash('error', 'Prosze się zalogować!')
	res.redirect('/auth');
}

function chechHostname(req,res,next){
        return next();

}

module.exports = router;