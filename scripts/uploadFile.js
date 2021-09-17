const { Config } = require('@adobe/aio-sdk').Core
const fs = require('fs')
const fetch = require('node-fetch')
const testUtils = require("../test/lib/testUtils")

// get action url
const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionUrl = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}/upload-file`;

var target = "country-codes.csv";
var file = fs.readFileSync('./test/country-codes.csv')

async function main() {
    params = {
        target,
        file
    }
    headers = { 'Content-Type': 'application/json', "X-OW-EXTRA-LOGGING": "on" };
    testUtils.addAuthHeaders(headers);
    console.log(headers)
    var res = await fetch(actionUrl, { method: "POST", body: JSON.stringify(params), headers: headers });
    if (res.status == 400) {
        var actId = await res.headers.get("x-openwhisk-activation-id");
        var err = await testUtils.getInitializationError(actId);
        console.log("init error: ", err)
    }
    console.log(res);
    //expect(res).toEqual(expect.objectContaining({ status: 200 }))
    var jsonRes = await res.json();
    console.log(jsonRes);
    console.log("headers", await res.headers)

}

main()

module.exports ={
    main
}