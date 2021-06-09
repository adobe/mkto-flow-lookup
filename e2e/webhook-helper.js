
function getWHMockReq() {
    var body = {
        "table": "test/country-codes.csv",
        "kn":"country",
        "kv":"Zimbabwe",
        "lookup":"alpha-2",
        "resField": "country-code-2"
    };

    return {
        "method": "POST",
        "headers": 
            { "Content-Type": "application/json" }
        ,
        "body": JSON.stringify(body)
    }
}
module.exports = {
    getWHMockReq
}