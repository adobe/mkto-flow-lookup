const namespace = Config.get('runtime.namespace');
const hostname = Config.get('cna.hostname') || 'adobeioruntime.net';
const packagejson = JSON.parse(fs.readFileSync('package.json').toString());
const runtimePackage = `${packagejson.name}-${packagejson.version}`
const actionPrefix = `https://${namespace}.${hostname}/api/v1/web/${runtimePackage}`
const mockCallbackUrl = `${actionPrefix}/mockCallbackResponse`;

const mockSingleLead = {
    "id": 1001,
    "batchid": "9e7df252-1969-4f22-861a-82d19769eb1b",
    "campaignId": 1001,
    "type":"dummy",
    "callbackUrl": mockCallbackUrl,
    "token": "eb26ba28-e3f4-4423-a75d-28118b81828c",
    "context":{
        "subscription": {
            "munchkinId": "AAA-999-ZZZ",
            "prefix": "marketob2"
        },
        "admin": {
            "foo":"bar"
        },
        "campaign": {
            "id": 1001,
            "name": "mock"
        },
        "program": {
            "id": 1001,
            "name": "mock"
        }
    },
    "objectData": [
        {
            "objectType":"lead",
            "objectContext": {
                "id": 1000000,
                "email": "test@example.com",
                "country": "United States of America (the)"
            },
            "flowStepContext": {
                "table": "country-codes.csv",
                "keyName": "country",
                "keyField": "country",
                "lookup": "alpha-2",
                "resField": "country-code-2"
            }
        }
    ]
}

module.exports = {
    mockSingleLead
}