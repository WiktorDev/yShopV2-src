require("dotenv").config()
global.logger = require('./utils/logger')
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cors = require('cors')
const config = require("./config/config")
const db = require('./config/database')

const app = express();
const cdn = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(session({ secret: config.session, resave: true, saveUninitialized: true }));
app.use(cors())
//app.use(require('./middleware/CustomDomainMiddleware'))

app.get('/test', (req, res)=>{
  require('./utils/nginx').reloadNginx()
  res.send('r')
})
app.use("/", require("./routes/indexRoute"));
app.use(require("./utils/error").handler);

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        code: '500',
        message: 'Internal server error'
    });
});

require('./runnables/ServersUpdateRunnable').run();

db.getConnection(function (err) {
  if(err) {
    logger.error("Could not connect to database! Please check config and database server!");
    process.exit(1);
  }
});

require('./functions').checkTables(db)

app.listen(config.port, ()=>{
  logger.ready(`App has started at port ${config.port} (${config.baseURL})`)
})

//Init CDN server
require('./cdn/init')(cdn); 

cdn.listen(config.cdn_port, ()=>{
  logger.ready(`CDN server has started at port ${config.cdn_port} (${config.cdn_baseURL})!`)
})