var express = require("express");
const bcrypt = require('bcrypt');
const config = require('../config/config')
const connection = require('../config/database')
const mail = require('../api/email')
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const ejs = require('ejs')

var recaptcha = new Recaptcha(config.site_key, config.secret_key);
var router = express.Router();

router.get('/', function(req, res) {
    res.render('auth/login')
})

router.post('/', (req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        connection.query('SELECT * FROM yshop_users WHERE email = ?', [username], function(error, results) {
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, function(err, response) {
                    if(response == true){
                        if(results[0].activate == 'false'){
                            req.flash('error', 'To konto nie jest aktywowane!')
                            res.redirect('/auth')
                        }else{
                            if(results[0].rank == 'admin'){
                                res.send('Wykryto logowanie konta ROOT!')
                                return;
                            }
                            req.session.loggedin = true;
                            req.session.username = username;
                            req.flash('success', 'Pomyślnie zalogowano!')
                            res.redirect('/panel')
                        }
                    }else{
                        req.flash('error', 'Wpisane haslo jest niepoprawne!')
                        res.redirect('/auth')
                    }
                });
            } else {
                req.flash('error', 'Niepoprawna nazwa uzytkownika!')
                res.redirect('/auth')
            }

        });
    } else {
        req.flash('error', 'Prosze wpisac haslo i uzytkownika!')
        res.redirect('/auth')
        res.end();
    }
})

router.get('/activate/', (req,res)=>{
    connection.query("SELECT * FROM yshop_users WHERE code = ?", [req.query.code], function(err,result){
        if(err)throw err;
        if(!result[0]){
            req.flash('error', 'To konto jest już aktywowane lub ten kod jest niepoprawny!')
            res.render('status')
        }else{
            connection.query("SELECT * FROM `yshop_users` WHERE `code`= ?", [req.query.code], function(err, result2){
                if(result2[0].activate == 'true'){
                    req.flash('error', 'To konto jest już aktywowane lub ten kod jest niepoprawny!')
                    res.render('status')
                }else{
                  connection.query("UPDATE `yshop_users` SET `activate`= 'true' WHERE code = '" + req.query.code + "'", function(err, result1){
                      req.flash('success', 'Konto zostało pomyślnie aktywowane')
                      res.redirect('/auth')
                  })
                }
            })
        }
    })
})

router.get('/register',recaptcha.middleware.render, function(req, res) {
    res.render('auth/register', {
        captcha: res.recaptcha
    })
})

router.get('/:userID/resend', function(req, res, next){
    connection.query("SELECT * FROM `yshop_users` WHERE email = ?", [req.params.userID], function(err, result){
        if(!result[0]){
            res.render('error', { code: '404', message: 'Page not found'})
            return;
        }
        if(result[0].activate == 'true'){
            res.redirect('/auth')
        }else{
            ejs.renderFile(__dirname + "/activate.ejs", { username: result[0].username, code: result[0].code, baseURL: config.baseURL }, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    mail.sendMail(result[0].email, "Aktywacja konta yShop.pl", data)
                }
            });
            res.status(204).send();
        }
    })
})

router.post('/register',recaptcha.middleware.verify, (req,res)=>{
    var code = Math.floor((Math.random() * 10000) + 1);
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var rpassword = req.body.password_repeat;
    if(password != rpassword){
        req.flash('error', 'Podane hasla sie różnią!')
        res.redirect('/auth/register')
        return;
    }

    /**if(req.recaptcha.error){
        req.flash('error', 'Prosze uzupelnic captche!')
        res.redirect('/auth/register')
        return;
    }**/

    connection.query("SELECT * FROM `yshop_users` WHERE email = ?", [email], function(err, result1){
        if(!result1[0]){
            bcrypt.hash(password, 10, (err, hash) => {
                connection.query("INSERT INTO `yshop_users`(`username`, `password`, `email`, `code`, `activate`, `rank`) VALUES (?, ?, ?, ?, ?, ?)", [username, hash, email, code, 'false', 'user'], function(err, result){
                    ejs.renderFile(__dirname + "/activate.ejs", { username: username, code: code, baseURL: config.baseURL }, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            mail.sendMail(email, "Aktywacja konta yShop.pl", data)
                        }
                    });
                    req.flash('success', `Konto zostalo utworzone wejdź na swojego maila aby je aktywowac! <br><br> <a href="/auth/${email}/resend" class="btn btn-primary">Wyslij ponownie</a>`);
                    res.render('status');
                })
            });
        }else{
            req.flash('error', 'Ten e-mail juz istnieje w naszej bazie!')
            res.redirect('/auth/register')
        }
    })

})

router.get('/logout',isLoggedIn, (req,res)=>{
    req.session.destroy()
    res.redirect('/auth')
})

function isLoggedIn(req,res,next){
	if(req.session.loggedin == true)
		return next();
    req.flash('error', 'Prosze się zalogować!')
	res.redirect('/auth');
}

module.exports = router;