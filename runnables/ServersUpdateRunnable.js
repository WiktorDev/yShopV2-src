const db = require('../config/database')
const config = require('../config/config')
const logger = require('../utils/logger')
const fetch = require('node-fetch')

exports.run=()=>{
    setInterval(function(){
        db.query("SELECT * FROM `yshop_shops`", function(err, result){
            for (let i = 0; i < result.length ; i++) {
                fetch(`https://api.mcsrvstat.us/2/${result[i].serverip}:${result[i].serverport}`).then((res) => {
                    return res.json() 
                }).then((jsonData) => {
                    if(jsonData.online == false){
                        updateServer(result[i].id, false, 0, 0);
                    }else{
                        updateServer(result[i].id, true, jsonData.players.online, jsonData.players.max)
                    }
                }).catch((err) => {
                    logger.error('Wystapil blad podczas wysylania zapytania do serwer!')
                    console.error(err)
                });
            }
        })
        //logger.info("Servers status was successful refreshed!")
    }, config.serversRefreshTime)
}

function updateServer(id, status, online, max){
    db.query("UPDATE `yshop_shops` SET `srv_status`=?,`srv_online`=?,`srv_max`=? WHERE id = '"+id+"'", [status, online, max], function(err, result){})
}

/**
const status = require('minecraft-server-status');
 
status('yourcraft.pl', 25565, response => {
    console.log(response)
})
 */