const asyncActionName = require("../actions/flow/v1/submitAsyncAction").actionName

const { getRuntimePkgName } = require('./actionUtils');

const getSdf = function (prefix) {
    return {
        "apiName": "mktoFlowLookup",
        "provider": "Marketo Lookup Action",
        "i18n": {
            "en_US": {
                "name": "Lookup Value from Table",
                "filterName": "Looked Up Value",
                "triggerName": "Looks Up Value",
                "description": "Looks up a value from a table based on the keys given, and returns the value to a chosen field"
            }
        },
        "supportPage":"https://developers.marketo.com",
        "supportEmail": "test@example.com",
        "invocationEndpoint": `${prefix}/${asyncActionName}`,
        "statusEndpoint": `${prefix}/status`,
        "brandIcon": `${prefix}/brandIcon.svg`,
        "serviceIcon": `${prefix}/serviceIcon.svg`,
        "authSetting": {
            authType: "apiKey",
            headerName: "x-require-whisk-auth"
        },
        //TODO is this right?
        "primaryAttribute": "table",
        "invocationPayloadDef": {
            //invocationAttributeObject
            "globalAttributes":[{
                "apiName": "LOG_LEVEL",
                "i18n": {
                    "en_US": {
                        "name": "LOG_LEVEL"
                    }
                },
                "dataType": "string",
                "hasPicklist": true
            }],
            "headers": [{
                "name":"X-OW-EXTRA-LOGGING",
                "hasPicklist": true,
                "description": {
                    "en_US": "Enable extra logging for successful actions"
                }
            }],
            //table, keyName, keyValues, lookupField, config = {}, headers
            "primaryAttribute": "table",
            "flowAttributes": [
                {
                    apiName: "table",
                    i18n: {
                        en_US: {
                            name: "Table",
                            description: "Location of the table to use for lookup",
                            uiTooltip: "Location of the table to use for lookup"
                        }
                    },
                    dataType: "string",
                    picklistUrl: `${prefix}/getPicklist`,
                    hasPicklist: true,
                    enforcePicklistSelect: true
                },
                {
                    apiName: "keyName",
                    i18n: {
                        en_US: {
                            name: "Key Name",
                            description: "Name of the column to match values against",
                            uiTooltip: "Name of the column to match values against"
                        }
                    },
                    dataType: "string",
                    picklistUrl: `${prefix}/getPicklist`,
                    hasPicklist: true,
                    enforcePicklistSelect: true
                },
                {
                    apiName: "keyValField",
                    i18n: {
                        en_US: {
                            name: "Key Value Field",
                            description: "Name of the lead field to compare values from",
                            uiTooltip: "Name of the lead field to compare values from"
                        }
                    },
                    dataType: "string",
                    picklistUrl: `${prefix}/getPicklist`,
                    hasPicklist: true,
                    enforcePicklistSelect: true

                },
                {
                    apiName: "lookupField",
                    i18n: {
                        en_US: {
                            name: "Lookup Column",
                            description: "Name of the column to retrieve values from",
                            uiTooltip: "Name of the column to retrieve values from"
                        }
                    },
                    dataType: "string",
                    picklistUrl: `${prefix}/getPicklist`,
                    hasPicklist: true,
                    enforcePicklistSelect: true

                },
                {
                    apiName: "returnField",
                    i18n: {
                        en_US: {
                            name: "Return Field",
                            description: "Name of the field to write lookup values to",
                            uiTooltip: "Name of the field to write lookup values to"
                        }
                    },
                    dataType: "string",
                    picklistUrl: `${prefix}/getPicklist`,
                    hasPicklist: true,
                    enforcePicklistSelect: true

                }

            ],
            //serviceFieldMapping
            //"fields": [],
            "userDrivenMapping": true,
            "programContext": true,
            "campaignContext": true,
            "triggerContext": true,
            "programMemberContext": true,
            "subscriptionContext": true
        },
        "callbackPayloadDef": {
            attributes: [
                {
                    apiName: "returnVal",
                    i18n: {
                        en_US: {
                            name: "Returned Value",
                            description: "The value returned by the lookup table",
                            uiTooltip: "The value returned by the lookup table"
                        }
                    },
                    dataType: "string"
                },
                {
                    apiName: "searchParams",
                    i18n: {
                        en_US: {
                            name: "Search Params",
                            description: "Parameters of the search",
                            uiTooltip: "Parameters of the search"
                        }
                    },
                    dataType: "string"
                },
                {
                    apiName: "returnField",
                    i18n: {
                        en_US: {
                            name: "Return Field",
                            description: "Name of the field to write lookup values to",
                            uiTooltip: "Name of the field to write lookup values to"
                        }
                    },
                    dataType: "string"
                },
                // {
                //     apiName: "success",
                //     i18n: {
                //         en_US: {
                //             name: "Success",
                //             description: "Whether the search found a value for the given parameters",
                //             uiTooltip: "Whether the search found a value for the given parameters"
                //         }
                //     },
                //     dataType: "boolean"
                // },
                // {
                //     apiName: "error",
                //     i18n: {
                //         en_US: {
                //             name: "Error",
                //             description: "Error message if search was not successful",
                //             uiTooltip: "Error message if search was not successful"
                //         }
                //     },
                //     dataType: "string"
                // }
            ],
            //fields: [],
            userDrivenMapping: true
        },
        cabundle: null,
        //TODO telescope icon
        serviceIcon: true,
        brandIcon: true,
        //TODO
        providerInstruction: true
    }
}



module.exports = {
    getSdf
}