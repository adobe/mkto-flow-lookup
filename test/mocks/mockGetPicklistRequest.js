var tableReq = {
    "name": "table",
    "type": "flow",
    "fieldMappingContext": {
        "invocationFieldMappings": [
            {
                "marketoAttribute": "country",
                "serviceAttribute": "country"
            }
        ],
        "callbackFieldMappings": [
            {
                "marketoAttribute": "countryCode2",
                "serviceAttribute": "countryCode2"
            }
        ]
    }
}
var knReq = {
    "name": "keyName",
    "type": "flow",
    "fieldMappingContext": {
        "invocationFieldMappings": [
            {
                "marketoAttribute": "country",
                "serviceAttribute": "country"
            }
        ],
        "callbackFieldMappings": [
            {
                "marketoAttribute": "countryCode2",
                "serviceAttribute": "countryCode2"
            }
        ]
    }
}
var kvReq = {
    "name": "keyValField",
    "type": "flow",
    "fieldMappingContext": {
        "invocationFieldMappings": [
            {
                "marketoAttribute": "country",
                "serviceAttribute": "country"
            }
        ],
        "callbackFieldMappings": [
            {
                "marketoAttribute": "countryCode2",
                "serviceAttribute": "countryCode2"
            }
        ]
    }
}
var lookupReq = {
    "name": "lookupField",
    "type": "flow",
    "fieldMappingContext": {
        "invocationFieldMappings": [
            {
                "marketoAttribute": "country",
                "serviceAttribute": "country"
            }
        ],
        "callbackFieldMappings": [
            {
                "marketoAttribute": "countryCode2",
                "serviceAttribute": "countryCode2"
            }
        ]
    }
}
var rfReq = {
    "name": "returnField",
    "type": "flow",
    "fieldMappingContext": {
        "invocationFieldMappings": [
            {
                "marketoAttribute": "country",
                "serviceAttribute": "country"
            }
        ],
        "callbackFieldMappings": [
            {
                "marketoAttribute": "countryCode2",
                "serviceAttribute": "countryCode2"
            }
        ]
    }
}

module.exports = {
    tableReq,
    knReq,
    kvReq,
    lookupReq,
    rfReq
}