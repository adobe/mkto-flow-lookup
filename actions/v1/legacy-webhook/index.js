const lts = require("../../../lib/lookupTableSearch.js");
const filesLib = require('@adobe/aio-lib-files')
const fs = require('fs');

//Searches format = {table},{keyname},{keyval},{lookupname}
//TODO
//Add support for reading action properties to find tables
//handle newline correctly
async function main(params){
    const files = await filesLib.init();
    var keyMisses = [];
    var errors = [];
    var response = {};
    //table, kn, kv, lookup, resField
    //TODO handle Null Args
    var i = 0;
    params.searches.split(";").forEach(async e => {
        var args = e.split(",");
        var table = args[0];
        var kn = args[1];
        var kv = args[2];
        var lookup = args[3];
        var resField = args[4];

        logger.info("trying search with params: ", ts, kn, kv, lookup, resField);

        //need to get from aio-files
        //files.createReadStream seems like a strong candidate
        //var tableFile = fs.readFileSync(table, 'utf-8');
        //console.log(tableFile);
        try {
            var ts = await files.createReadStream("table", "utf-8");
            var searchRes = lts.search(ts, kn, [kv], lookup);
            if(searchRes[kv]){
                response[resField] = searchRes[kv];
            }else{
                keyMisses.push(e);
            }
            
            if(searchRes._table.errors){
                errors.push(searchRes._table.errors);
            }
        } catch (error) {
            
        }


        console.log(ts, kn, kv, lookup, resField);

        
    });

    if(keyMisses.length > 0){
        response["_keyMisses"] = keyMissMessage(keyMisses);
    }
    return {
        "body":response,
        "statusCode": 200
    };
}

function keyMissMessage(keyMisses){
    var msg = "No value found for following searches:";
    keyMisses.forEach(e => {
        var args = e.split(",");
        var table = args[0];
        var kn = args[1];
        var kv = args[2];
        msg = msg + "\r\nTable: " + table + " Key: " + kn + " Value: " + kv;
    });
    return msg;
}

module.exports = {
    "main": main
}