const { Webhook, MessageBuilder } = require('discord-webhook-node');
const config = require('../config/config')

exports.sendHook = (url, content, color, title) =>{
    const hook = new Webhook(url);
    const embed = new MessageBuilder()
    .setTitle(title)
    .setColor(color || '#eb3d34')
    .setDescription(content)
    .setTimestamp();
    logger.info('Webhook was successfull send!')
    return hook.send(embed);
}

exports.sendErrorHook = (code, error) =>{
    const hook = new Webhook(config.handlerHook);
    const embed = new MessageBuilder()
    .setTitle('Internal Server Error ')
    .setColor('#eb3d34')
    .addField('Error code', code, false)
    .setDescription(error)
    .setTimestamp();
    logger.info('Webhook was successfull send!')
    return hook.send(embed);
}