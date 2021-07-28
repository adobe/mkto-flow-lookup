const token = require('../.secrets/auth').access_token

function getBearerTokenString(){
    return `Bearer ${token}`
}
function logBearerTokenString(){
    console.log(getBearerTokenString())
}

module.exports = {
    getBearerTokenString,
    logBearerTokenString
}

logBearerTokenString()