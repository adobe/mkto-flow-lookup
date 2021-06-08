
function getWHMockReq() {
    var body = {
        searches: "test/country-codes.csv,country,Zimbabwe,alpha-2,country-code-2",
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