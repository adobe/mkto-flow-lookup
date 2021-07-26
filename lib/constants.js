const { Config } = require('@adobe/aio-sdk').Core

const fetch = require('node-fetch')



// get action url
const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';


var isJestRunning;
if (process.env.NODE_ENV == "test") {
    isJestRunning = true;
} else {
    isJestRunning = false;
}
//Jest or Openwhisk?
var packagejson;
var runtimePackage;
var actionPrefix;
if (isJestRunning) {
    var fs = require('fs')
    packagejson = JSON.parse(fs.readFileSync('package.json').toString());
    runtimePackage = `${packagejson.name}-${packagejson.version}`;
    actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`

}
const propsUrl = `${actionPrefix}/file-properties`;
const uploadUrl = `${actionPrefix}/upload-file`;
const deleteUrl = `${actionPrefix}/delete-file`;
const dir = "/test/"

const t1 = dir + "1.txt";
const t2 = dir + "2.txt";
const t3 = dir + "3.txt";

const file1 = {
    "target": t1,
    "file": "asdfqwer1234"
};
const file2 = {
    "target": t2,
    "file": "asdfqwer1234"
};
const file3 = {
    "target": t3,
    "file": "asdfqwer1234"
}

var defaultHeaders = { "Content-Type": "application/json", "X-OW-EXTRA-LOGGING": "on" }


module.exports = {
    namespace,
    hostname,
    packagejson,
    runtimePackage,
    actionPrefix,
    propsUrl,
    uploadUrl,
    deleteUrl,
    dir,
    t1,
    t2,
    t3,
    file1,
    file2,
    file3
}