const librcon = require("librcon");
const logger = require('../utils/logger')

exports.sendRcon=(cmd, rcon_pass, rcon_port, server_ip, req, res)=>{
    librcon.send(cmd, rcon_pass, server_ip, rcon_port).then((response)=>{
        logger.info("Command was successfull send from RCON")
    }).catch((error)=>{
        req.flash('error', 'Nie mozna polaczyc sie z serwerem!')
        res.render('status')
        res.end()
        logger.error("An error occured! \n " + error.message)
        return;
    })
}

