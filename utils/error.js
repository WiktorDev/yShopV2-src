const { uuid } = require('uuidv4');
const webhook = require('./webhook')
const fs = require("fs")

exports.error = function(err, req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const time = new Date()
    const errid = uuid();
    const errinfo = `IP: ${ip}
Path: ${req.path}
Time: ${time}
Method: ${req.method}
Params: ${req.params ? req.params : "None"}
Data: ${req.data ? req.data : "None, or no POST"}
Executed: Inside router
Error Stack:
${err.stack}`
    fs.writeFile(`errors/${errid}.txt`, errinfo, function (err) {if (err) return logger.error(err)});
    webhook.sendErrorHook(errid, err.stack);
    res.status('500').render('500',{errorid: errid});
    logger.error(`[Inside router] ${ip} ${req.method.toUpperCase()} ${req.path} UUID: ${errid}`);
}

exports.handler = function(err, req, res, next){
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const errid = uuid();
    const time = new Date()
    const errinfo = `IP: ${ip}
    Path: ${req.path}
    Time: ${time}
    Method: ${req.method}
    Params: ${req.params ? req.params : "None"}
    Data: ${req.data ? req.data : "None, or no POST"}
    Executed: Express error handler
    Error Stack:
    ${err.stack}`
    fs.writeFile(`errors/${errid}.txt`, errinfo, function (err) {if (err) return logger.error(err)});
    webhook.sendErrorHook(errid, err.stack);
    res.render('500',{errorid: errid});
    logger.error(`[Express Error handler] ${ip} ${req.method.toUpperCase()} ${req.path} UUID: ${errid}`);
}

process.on("uncaughtException", (err) => {
    const errid = uuid();
    const time = new Date()
    const errinfo = `Time: ${time}
    Executed: Process
    Type: Uncaught Exception
    Error Stack:
    ${err.stack}`
    fs.writeFile(`errors/${errid}.txt`, errinfo, function (err) {if (err) return logger.error(err)});
    webhook.sendErrorHook(errid, err.stack);
    logger.error(`[Process] UUID: ${errid}`)
})

process.on("unhandledRejection", (err) => {
    const errid = uuid();
    const time = new Date()
    const errinfo = `Time: ${time}
    Executed: Process
    Type: Unhandler Rejection
    Error Stack:
    ${err.stack}`
    fs.writeFile(`errors/${errid}.txt`, errinfo, function (err) {if (err) return logger.error(err)});
    webhook.sendErrorHook(errid, err.stack);
    logger.error(`[Process] UUID: ${errid}`)
})