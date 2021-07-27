const fs = require('fs');

module.exports = {
    swagger: {
        "openapi": "3.0.1",
        "info": {
            "title": "Marketo Lookup Action",
            "description": "This is a POC implementation of a Marketo Self-Service Flow Action.  It includes a simple file manager API for managing tables available in IO runtime and uses it to implement a Lookup Table service as a Flow Action API.  This can be installed into a ",
            "termsOfService": "https://documents.marketo.com/legal/eusa/us/2012-08-28/",
            "license": {
                "name": "Marketo API License",
                "url": "https://developers.marketo.com/api-license/"
            },
            "version": "0.1.0"
        },
        "externalDocs": {
            "description": "Find out more about Swagger",
            "url": "https://swagger.io"
        },
        "tags": [
            {
                "name": "flow action",
                "description": "your service action",
                "externalDocs": {
                    "description": "Find out more",
                    "url": "todo://marketo.docs/link"
                }
            }
        ],
        "paths": {
            "/submitAsyncAction": {
                "description": "Lead and context data is submitted through this endpoint.  Results should be submitted through callback",
                "post": {
                    "tags": [
                        "flow action"
                    ],
                    "operationId": "",
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/async"
                                }
                            }
                        }
                    },
                    "callbacks": {
                        "selfServiceFlowComplete": {
                            "{$request.body#/flowComplete}": {
                                "post": {
                                    "requestBody": {
                                        "description": "Flow Action return data for post processing",
                                        "content": {
                                            "application/json": {
                                                "schema": {
                                                    "$ref": "#/components/schemas/flowCallBack"
                                                }
                                            }
                                        }
                                    },
                                    "responses": {
                                        "404": {
                                            "description": "Not Found",
                                            "content": {}
                                        },
                                        "405": {
                                            "description": "Invalid input",
                                            "content": {}
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "responses": {
                        "201": {
                            "description": "Accepted:\n- Webhook created"
                        },
                        "400": {
                            "description": "Bad Request:\n- Expected parameters were missing from the request or were invalid or Invalid document structure"
                        },
                        "401": {
                            "description": "Unauthorized:\n- The API credentials which Marketo has are not authorized to undertake the action"
                        },
                        "403": {
                            "description": "Forbidden:\n- Authentication Failed"
                        },
                        "429": {
                            "description": "Too Many Requests:\n- The service has received too many requests and should retry w/ an appropriate strategy"
                        },
                        "500": {
                            "description": "Internal Server Error:\n- Invoking the service failed for an unknown reason"
                        }
                    }
                }
            },
            "/getServiceDefinition": {
                "description": "Defines metadata used to exchange data between Marketo and service provider",
                "get": {
                    "summary": "Returns a service definition for user install",
                    "responses": {
                        "200": {
                            "description": "Service Install Metadata",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/serviceDefinition"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "components": {
            "schemas": {
                "async": {
                    "required": [
                        "id",
                        "batchid",
                        "campaignId",
                        "type",
                        "callbackUrl"
                    ],
                    "type": "object",
                    "properties": {
                        "token": {
                            "description": "One-time use access token for submitting callback data to Marketo",
                            "type": "string",
                            "format": "uuid"
                        },
                        "batchid": {
                            "description": "ID of the marketo campaign run invoking the service",
                            "type": "string",
                            "format": "uuid"
                        },
                        "campaignId": {
                            "description": "ID of the campaign invoking the service",
                            "type": "integer",
                            "format": "int32"
                        },
                        "callbackUrl": {
                            "description": "URL of the callback to submit data back to",
                            "type": "string",
                            "format": "uri",
                            "example": "https://adobe.com/send/callback/here"
                        },
                        "context": {
                            "$ref": "#/components/schemas/context"
                        },
                        "objectData": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/objectData"
                            }
                        }
                    }
                },
                "context": {
                    "description": "Object containing contexts to be used for processing",
                    "type": "object",
                    "required": [
                        "subscription"
                    ],
                    "properties": {
                        "subscription": {
                            "$ref": "#/components/schemas/subscription"
                        }
                    }
                },
                "subscription": {
                    "description": "Identifiers for Marketo subscription.  Can be used to locate invoking instance for REST API calls",
                    "type": "object",
                    "required": [
                        "munchkinId"
                    ],
                    "properties": {
                        "munchkinId": {
                            "type": "string",
                            "example": "337-INS-529"
                        },
                        "prefix": {
                            "type": "string",
                            "example": "customerPrefix"
                        }
                    }
                },
                "flowStepContext": {
                    "description": "Data related to specific invocation of the flow action.  Property list is defined by 'flow' type service attributes in Service Definition.  Values will be based on inputs given by Marketo users in Smart Campaign UI",
                    "type": "object",
                    "additionalProperties": true,
                    "required": [
                        "table",
                        "keyName",
                        "keyValField",
                        "lookupField",
                        "returnField"
                    ],
                    "properties": [
                        {
                            "table": {
                                "type": "string",
                                "description": "Location of the table to use for lookup"
                            },
                            "keyName": {
                                "type": "string",
                                "description": "Name of the column to match values against"
                            },
                            "keyValField": {
                                "type": "string",
                                "description": "Name of the lead field to compare values from"
                            },
                            "lookupField": {
                                "type": "string",
                                "description": "Name of the column to retrieve values from"
                            },
                            "returnField": {
                                "type": "string",
                                "description": "Name of the field to write lookup values to"
                            }
                        }
                    ]
                },
                "objectContext": {
                    "oneOf": [
                        {
                            "$ref": "#/components/schemas/leadData"
                        }
                    ],
                    "discriminator": {
                        "propertyName": "authType",
                        "mapping": {
                            "lead": "#/components/schemas/leadData"
                        }
                    }
                },
                "objectData": {
                    "description": "Contains lead-data and lead-specific context.  Submitted by Marketo to service.",
                    "required": [
                        "objectType",
                        "objectContext"
                    ],
                    "type": "object",
                    "properties": {
                        "objectType": {
                            "type": "string",
                            "example": "lead",
                            "enum": [
                                "lead"
                            ]
                        },
                        "objectContext": {
                            "$ref": "#/components/schemas/objectContext"
                        },
                        "flowStepContext": {
                            "$ref": "#/components/schemas/flowStepContext"
                        }
                    }
                },
                "callbackData": {
                    "type": "object",
                    "required": [
                        "leadData"
                    ],
                    "properties": {
                        "activityData": {
                            "description": "Object used to submit activity data for a single lead.  Attributes defined as 'response' attributes may be included to write to the activity resulting from invocation",
                            "type": "object",
                            "additionalProperties": true
                        },
                        "leadData": {
                            "description": "Object used to submit data back to lead record.  Included fields must be included in service definition unless userDrivenMapping is false.  Fields must also be mapped and active in Incoming Fields menu for write to succeed.",
                            "$ref": "#/components/schemas/leadData"
                        }
                    }
                },
                "leadData": {
                    "type": "object",
                    "required": [
                        "id"
                    ],
                    "properties": {
                        "id": {
                            "type": "integer",
                            "format": "int64"
                        }
                    },
                    "additionalProperties": true
                },
                "flowCallBack": {
                    "required": [
                        "munchkinId",
                        "token",
                        "time"
                    ],
                    "type": "object",
                    "properties": {
                        "munchkinId": {
                            "type": "string",
                            "example": "123-ABD-456"
                        },
                        "token": {
                            "type": "string",
                            "example": "3912aec7-6d5c-4348-8b32-08966ac0dbc7"
                        },
                        "time": {
                            "type": "string",
                            "format": "date-time"
                        },
                        "defaultValues": {
                            "description": "If a value for a given record is not set in the objectData array, then it will default to the value set in the corresponding defaults object here if there is one",
                            "type": "object",
                            "properties": {
                                "leadDefaults": {
                                    "description": "Default values for lead fields",
                                    "type": "object",
                                    "additionalProperties": true
                                },
                                "activityDefaults": {
                                    "description": "Default values for activity attributes",
                                    "type": "object",
                                    "additionalProperties": true
                                }
                            }
                        },
                        "objectData": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/callbackData"
                            }
                        }
                    }
                },
                "serviceDefinition": {
                    "description": "Used to describe configuration and metadata including fields expected during invocation & callback, user inputs on Marketo-side, and other important metadata",
                    "type": "object",
                    "required": [
                        "apiName",
                        "provider",
                        "i18n",
                        "invocationEndpoint",
                        "statusEndpoint",
                        "authSetting",
                        "primaryAttribute",
                        "invocationPayloadDef",
                        "callbackPayloadDef"
                    ],
                    "properties": {
                        "apiName": {
                            "description": "Default identifier for service and activity.  Users installing multiple service with the same apiName will be prompted to resolve collision by inputting a custom name during installation",
                            "type": "string",
                            "example": "lookupTable"
                        },
                        "provider": {
                            "description": "Name of the service provider, typically the organization offering the service",
                            "type": "string",
                            "example": "Adobe Marketo Engage"
                        },
                        "i18n": {
                            "description": "Used to provide internationalized strings",
                            "type": "object",
                            "properties": {
                                "en_US": {
                                    "$ref": "#/components/schemas/serviceI18nObject"
                                }
                            }
                        },
                        "invocationEndpoint": {
                            "type": "string",
                            "format": "uri",
                            "example": "https://serviceprovider.com/send/action/here"
                        },
                        "statusEndpoint": {
                            "type": "string",
                            "format": "uri",
                            "example": "https://serviceprovider.com/get/status"
                        },
                        "authSetting": {
                            "$ref": "#/components/schemas/authSettingObject"
                        },
                        "caBundle": {
                            "type": "string",
                            "format": "uri",
                            "example": "https://serviceprovider.com/get/caBundle"
                        },
                        "serviceIcon": {
                            "description": "Icon to represent the individual service.  Used to represent the service flow step in the Marketo Campaign UI",
                            "type": "string",
                            "format": "uri",
                            "example": "https://serviceprovider.com/get/service.ico"
                        },
                        "brandIcon": {
                            "description": "Icon to represent the service provider.  Used to represent the service provider in the Service Providers Admin Menu",
                            "type": "string",
                            "format": "uri",
                            "example": "https://serviceprovider.com/get/brand.ico"
                        },
                        "providerInstruction": {
                            "type": "string",
                            "format": "uri",
                            "example": "https://serviceprovider.com/get/provider_instruction.html"
                        },
                        "primaryAttribute": {
                            "type": "string",
                            "description": "API name of the attribute that describes the primary asset. This must match the name of an attribute from the flow or callback attribute list"
                        },
                        "invocationPayloadDef": {
                            "$ref": "#/components/schemas/invocationPayloadDefObject"
                        },
                        "callbackPayloadDef": {
                            "$ref": "#/components/schemas/callbackPayloadDefObject"
                        }
                    }
                },
                "serviceI18nObject": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "example": "Lookup Table"
                        },
                        "filterName": {
                            "type": "string",
                            "example": "Lookup Table was Used"
                        },
                        "triggerName": {
                            "type": "string",
                            "example": "Use Lookup Table"
                        },
                        "description": {
                            "type": "string",
                            "example": "Use a lookup table to get a value"
                        }
                    }
                },
                "authSettingObject": {
                    "oneOf": [
                        {
                            "$ref": "#/components/schemas/basicAuthObject"
                        },
                        {
                            "$ref": "#/components/schemas/apikeyAuthObject"
                        },
                        {
                            "$ref": "#/components/schemas/oauth2AuthObject"
                        }
                    ],
                    "discriminator": {
                        "propertyName": "authType",
                        "mapping": {
                            "basic": "#/components/schemas/basicAuthObject",
                            "apiKey": "#/components/schemas/apikeyAuthObject",
                            "oauth2": "#/components/schemas/oauth2AuthObject"
                        }
                    }
                },
                "basicAuthObject": {
                    "type": "object",
                    "required": [
                        "authType"
                    ],
                    "description": "See RFC 7617",
                    "properties": {
                        "authType": {
                            "type": "string",
                            "enum": [
                                "basic"
                            ]
                        },
                        "realmRequired": {
                            "type": "boolean"
                        }
                    }
                },
                "apikeyAuthObject": {
                    "type": "object",
                    "required": [
                        "authType"
                    ],
                    "properties": {
                        "authType": {
                            "type": "string",
                            "enum": [
                                "apiKey"
                            ]
                        },
                        "headerName": {
                            "type": "string",
                            "example": "x-API-Key"
                        }
                    }
                },
                "oauth2AuthObject": {
                    "type": "object",
                    "required": [
                        "authType"
                    ],
                    "description": "See RFC 6749",
                    "properties": {
                        "authType": {
                            "type": "string",
                            "enum": [
                                "oauth2"
                            ]
                        },
                        "grantType": {
                            "type": "string",
                            "enum": [
                                "client_credentials"
                            ]
                        },
                        "grantTypeName": {
                            "type": "string",
                            "description": "grant_type by default"
                        },
                        "clientIdName": {
                            "type": "string",
                            "description": "client_id by default. Applicable if grantType is 'client_credentials'"
                        },
                        "clientSecretName": {
                            "type": "string",
                            "description": "client_secret by default. Applicable if grantType is 'client_credentials'"
                        },
                        "refreshTokenEnabled": {
                            "type": "boolean"
                        },
                        "tokenEndpoint": {
                            "type": "string",
                            "format": "uri",
                            "description": "Applicable if refreshTokenEnabled is true"
                        }
                    }
                },
                "invocationPayloadDefObject": {
                    "description": "Describes lead field mappings, flow & global attributes, and contexts required by the service during invocation",
                    "type": "object",
                    "properties": {
                        "globalAttributes": {
                            "description": "Describes expected global user inputs.  Global attributes can be set during installation or from the Service Provider admin menu.  Global attributes will be included in every invocation if set.",
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/invocationAttributeObject"
                            }
                        },
                        "flowAttributes": {
                            "description": "Describes expected flow step inputs.  Flow attributes are set for each individual instance of a flow step and are sent per-lead in the flowStepContext object.",
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/invocationAttributeObject"
                            }
                        },
                        "fields": {
                            "description": "Field mappings needed for invocation.  Fields which are mapped in Marketo are sent in the leadContext object.  If userDrivenMapping is 'true', the contents of this array will be ignored",
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/serviceFieldMapping"
                            }
                        },
                        "userDrivenMapping": {
                            "description": "Indicates whether the service will provide a pre-defined list of mappings.  If 'true', 'fields' will be ignored, and mappings must be added manually by users.",
                            "type": "boolean"
                        },
                        "programContext": {
                            "type": "boolean",
                            "description": "true if Service Provider needs to access program context"
                        },
                        "campaignContext": {
                            "type": "boolean",
                            "description": "true if Service Provider needs to access campaign context"
                        },
                        "triggerContext": {
                            "type": "boolean",
                            "description": "true if Service Provider needs to access trigger context"
                        },
                        "programMemberContext": {
                            "type": "boolean",
                            "description": "true if Service Provider needs to access member context"
                        },
                        "subscriptionContext": {
                            "type": "boolean",
                            "description": "true if Service Provider needs to access subscription context"
                        }
                    }
                },
                "callbackPayloadDefObject": {
                    "description": "Describes lead field mappings, and response attributes which can be written to during the callback",
                    "type": "object",
                    "properties": {
                        "attributes": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/attributeObject"
                            }
                        },
                        "fields": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/serviceFieldMapping"
                            }
                        },
                        "userDrivenMapping": {
                            "description": "Indicates whether the service will provide a pre-defined list of mappings.  If 'true', 'fields' will be ignored, and mappings must be added manually by users.",
                            "type": "boolean"
                        }
                    }
                },
                "invocationAttributeObject": {
                    "allOf": [
                        {
                            "$ref": "#/components/schemas/attributeObject"
                        },
                        {
                            "type": "object",
                            "properties": {
                                "required": {
                                    "type": "boolean",
                                    "description": "Whether or not this attribute is required by the service"
                                },
                                "enforcePicklistSelect": {
                                    "type": "boolean",
                                    "description": "Whether or not the attribute value has to be exact match of an entry from the picklist"
                                },
                                "picklistUrl": {
                                    "type": "string",
                                    "format": "uri",
                                    "description": "Endpoint to provide a value list for this attribute to choose from. Applicable if enforcePicklistSelect is true",
                                    "example": "https://serviceprovider.com/get/picklist"
                                }
                            }
                        }
                    ]
                },
                "attributeObject": {
                    "type": "object",
                    "required": [
                        "apiName",
                        "i18n",
                        "dataType"
                    ],
                    "properties": {
                        "apiName": {
                            "type": "string",
                            "example": "keyValue"
                        },
                        "i18n": {
                            "type": "object",
                            "properties": {
                                "en_US": {
                                    "$ref": "#/components/schemas/attributeI18nObject"
                                }
                            }
                        },
                        "dataType": {
                            "type": "string",
                            "example": "string"
                        }
                    }
                },
                "attributeI18nObject": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "example": "Key Value"
                        },
                        "description": {
                            "type": "string",
                            "example": "Marketo field to be used as lookup value"
                        },
                        "uiTooltip": {
                            "type": "string",
                            "example": "What Marketo field should be used to find the lookup value?"
                        }
                    }
                },
                "serviceFieldMapping": {
                    "type": "object",
                    "properties": {
                        "serviceAttributeName": {
                            "description": "Name of the attribute as sent during invocation or callback.",
                            "type": "string",
                            "example": "serviceAttributeName"
                        },
                        "suggestedMarketoAttribute": {
                            "description": "If this matches the apiName and data type of a Marketo lead field, that field will be populated as the default choice for the mapping during service installation",
                            "type": "string",
                            "example": "marketoAttributeName"
                        },
                        "description": {
                            "description": "Description presented to the user for the mapping during installation.",
                            "type": "object",
                            "properties": {
                                "en_US": {
                                    "type": "string",
                                    "example": "This is the status field that the service will use to indicate a lead's relative status in Marketo"
                                }
                            }
                        },
                        "dataType": {
                            "type": "string",
                            "example": "integer"
                        }
                    }
                }
            },
            "securitySchemes": {
                "apiKey": {
                    "type": "apiKey",
                    "name": "X-API-KEY",
                    "in": "header"
                }
            }
        }
    }
}