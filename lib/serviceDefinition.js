const asyncActionName = require("../actions/flow/v1/submitAsyncAction").actionName

const { getRuntimePkgName } = require('./actionUtils');

const getSdf = function (prefix) {
    return {
        "apiName": "mktoFlowLookup",
        "provider": "Marketo Lookup Action",
        "i18n": {
            "en_us": {
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
            //"globalAttributes":[],
            //table, keyName, keyValues, lookupField, config = {}, headers
            "primaryAttribute": "table",
            "flowAttributes": [
                {
                    apiName: "table",
                    i18n: {
                        en_us: {
                            name: "Table",
                            description: "Location of the table to use for lookup",
                            uiTooltip: "Location of the table to use for lookup"
                        }
                    },
                    dataType: "string",
                    picklistUrl: `${prefix}/getPicklist`,
                    enforcePicklistSelect: true
                },
                {
                    apiName: "keyName",
                    i18n: {
                        en_us: {
                            name: "Key Name",
                            description: "Name of the column to match values against",
                            uiTooltip: "Name of the column to match values against"
                        }
                    },
                    dataType: "string",
                    picklistUrl: `${prefix}/getPicklist`,
                    enforcePicklistSelect: true
                },
                {
                    apiName: "keyValField",
                    i18n: {
                        en_us: {
                            name: "Key Value Field",
                            description: "Name of the lead field to compare values from",
                            uiTooltip: "Name of the lead field to compare values from"
                        }
                    },
                    dataType: "string",
                    picklistUrl: `${prefix}/getPicklist`,
                    enforcePicklistSelect: true

                },
                {
                    apiName: "lookupField",
                    i18n: {
                        en_us: {
                            name: "Lookup Column",
                            description: "Name of the column to retrieve values from",
                            uiTooltip: "Name of the column to retrieve values from"
                        }
                    },
                    dataType: "string",
                    picklistUrl: `${prefix}/getPicklist`,
                    enforcePicklistSelect: true

                },
                {
                    apiName: "returnField",
                    i18n: {
                        en_us: {
                            name: "Return Field",
                            description: "Name of the field to write lookup values to",
                            uiTooltip: "Name of the field to write lookup values to"
                        }
                    },
                    dataType: "string",
                    picklistUrl: `${prefix}/getPicklist`,
                    enforcePicklistSelect: true

                }

            ],
            //serviceFieldMapping
            //"fields": [],
            "userDrivenMapping": true,
            "programContext": false,
            "campaignContext": false,
            "triggerContext": false,
            "programMemberContext": false,
            "subscriptionContext": true
        },
        "callbackPayloadDef": {
            attributes: [
                {
                    apiName: "returnVal",
                    i18n: {
                        en_us: {
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
                        en_us: {
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
                        en_us: {
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
                //         en_us: {
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
                //         en_us: {
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
        serviceIcon: "https://www.example.com",
        brandIcon: "https://www.example.com",
        //TODO
        providerInstruction: "https://www.example.com"
    }
}



module.exports = {
    getSdf
}