const fileUpload = require('express-fileupload');
const express = require('express')
const path = require('path')
const config = require('../config/config')

module.exports = function(app) {
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '/views'));
    app.use(fileUpload());
    app.get('/', function(req, res) {
        res.render('index', {
            error: false
        })
    })
    app.use(express.static(__dirname + '/files'));
    
    app.post('/', function (req, res) {
      if (!req.files)
          return res.status(400).send('No files were uploaded.');
    
      let sampleFile = req.files.sampleFile;
      if(req.body.token != config.cdn_token){a
          res.send('Wpisany token jest niepoprawny!')
      }
      sampleFile.mv(__dirname + `/files/${sampleFile.name}`, function (err) {
          if (err)
              return res.status(500).send(err);
          res.send(`Plik zostal pomyslnie wyslany! Znajduje sie pod linkiem: <a href="${config.cdn_baseURL}/${sampleFile.name}">${config.cdn_baseURL}/${sampleFile.name}</a> <br> Kliknij <a href="/">tutaj</a> aby powrocic na glowna!`)
    
      });
    });
};
