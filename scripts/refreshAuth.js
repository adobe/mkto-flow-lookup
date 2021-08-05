const fetch = require('node-fetch')
const { Config } = require('@adobe/aio-sdk').Core
const tokenEndpoint = "https://ims-na1.adobelogin.com/ims/exchange/jwt"
const jwt = require("../.secrets/jwt.js").token;
const fs = require('fs');

async function getAuth() {
    // const privKey = Config.get("aio-dev.dev-keys.privateKey");
    //console.debug(privKey)
    // const sig = jwt.sign(myJwt, privKey, { algorithm: "RS256" });
    //console.debug(sig)
    const clientId = Config.get("ims.contexts.aio-4566206088344642952.client_id");
    const clientSecret = Config.get("ims.contexts.aio-4566206088344642952.client_secret");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("jwt_token", jwt);
    console.debug(params);
    var headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    var res = await fetch(tokenEndpoint, {
        method: "POST",
        body: params,
        headers: headers
    })
    var json = await res.json()
    console.debug(res);
    console.debug(json)
    return json
}

async function refreshAuthToken(){
    var auth = await getAuth();
    var json = {
        "module":{
            "exports": auth
        }
    }
    fs.write('../.secrets/auth.js')
}

module.exports = {
    getAuth,
    refreshAuthToken
}