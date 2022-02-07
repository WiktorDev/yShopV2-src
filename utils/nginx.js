const fs = require('fs');
const { exec } = require("child_process");
const config = require('../config/config')
const logger = require('../utils/logger')

exports.generateConfig=(domain)=>{
    var path = `${config.nginx_path}${domain}.conf`;
    try {
        if (fs.existsSync(path)) {
            logger.error('Configuration exists!')
            return 'file_exists'
        }
        fs.appendFile(path, `server {
            listen 80;
            listen [::]:80;
    
            server_name ${domain};
    
            location / {
                    proxy_set_header   X-Forwarded-For $remote_addr;
                    proxy_set_header   Host $http_host;
                    proxy_pass         http://lvlup32gb.nodes.ycraft.ga:3000;
            }
        }`, function (err) {
            if (err) throw err;
            logger.info('Configuration has been saved!')
        }); 
        return 'success'
    } catch(err) {
        logger.error(err)
        return 'error'
    }
}

exports.removeConfiguration=(domain)=>{
    var path = `${config.nginx_path}${domain}.conf`;
    try {
        fs.unlinkSync(path)
        logger.info('Configuration successfull removed!')
        return 'success'
    } catch(err) {
        logger.error(err)
        return 'error'
    }
}

exports.reloadNginx=()=>{
    exec("node -v", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}