module.exports = {
    "id": 1001,
    "batchid": "9e7df252-1969-4f22-861a-82d19769eb1b",
    "campaignId": 1001,
    "type":"dummy",
    "callbackUrl": "https://www.example.com",
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
                "lookup": "alpha-2",
                "resField": "country-code-2"
            }
        }
    ]
}