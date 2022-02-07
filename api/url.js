function addURL(shopID, name, url){

}

function removeURL(shopID, name){

}

const getShop = require("./shop").getShop

getShop(4742, function(data){
    if(!data[0]){
        console.log("test")
    }else{
        console.log(data[0].owner)
    }
})
