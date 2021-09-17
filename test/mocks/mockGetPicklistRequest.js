var tableReq = {
    "name": "table",
    "type": "flow",
    "fieldMappingContext": {
        "invocation": [
            {
                "marketoAttribute": "country",
                "serviceAttribute": "country"
            }
        ],
        "callback": [
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
        "invocation": [
            {
                "marketoAttribute": "country",
                "serviceAttribute": "country"
            }
        ],
        "callback": [
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
        "invocation": [
            {
                "marketoAttribute": "country",
                "serviceAttribute": "country"
            }
        ],
        "callback": [
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
        "invocation": [
            {
                "marketoAttribute": "country",
                "serviceAttribute": "country"
            }
        ],
        "callback": [
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
        "invocation": [
            {
                "marketoAttribute": "country",
                "serviceAttribute": "country"
            }
        ],
        "callback": [
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