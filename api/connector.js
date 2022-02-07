exports.getConnector=(type)=>{
    switch(type){
        case 'rcon':
            console.log('Rcon connector type')
            break;
        case 'pterodactyl':
            console.log('PterodactylAPI connector type')
            break;
        case 'plugin':
            console.log('Plugin connector type')
            break;
        default:
            console.log('Invalid connector type!')
    }
}