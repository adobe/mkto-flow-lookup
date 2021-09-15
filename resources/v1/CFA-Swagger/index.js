module.exports ={
  swagger: {
    "openapi": "3.0.1",
    "info": {
      "title": "SSFA",
      "description": "This is a sample SSFA server swagger doc for providers to build their own services to be used with Marketo SSFA.",
      "termsOfService": "https://documents.marketo.com/legal/eusa/us/2012-08-28/",
      "license": {
        "name": "Marketo API License",
        "url": "https://developers.marketo.com/api-license/"
      },
      "version": "0.2.1"
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
                  "parameters": [
                    {
                      "in": "header",
                      "name": "x-api-key",
                      "schema": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "required": true
                    }
                  ],
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
      },
      "/status": {
        "description": "Returns status information, notifications and deprecation info from the service.  Polled nightly by Marketo",
        "get": {
          "summary": "Returns status information for the service",
          "responses": {
            "200": {
              "description": "Status info of Service",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/serviceStatus"
                  }
                }
              }
            }
          }
        }
      },
      "/providerInstructions": {
        "description": "Returns html document to embed how-to instructions for any required configuration which is not covered by automated installation",
        "get": {
          "summary": "Returns how-to html",
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "text/html": {
                  "schema": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      },
      "/brandIcon": {
        "description": "Returns an icon to represent brand in Service Providers menu",
        "get": {
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "image/*": {
                  "schema": {
                    "type": "string",
                    "format": "binary"
                  }
                }
              }
            }
          }
        }
      },
      "/serviceIcon": {
        "description": "Returns an icon to represent brand in Smart Campaign Flow Pallette, and in Service Providers menu",
        "get": {
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "image/*": {
                  "schema": {
                    "type": "string",
                    "format": "binary"
                  }
                }
              }
            }
          }
        }
      },
      "/getPicklist": {
        "description": "Returns lists of choices for a flow or global parameter.",
        "post": {
          "summary": "Returns lists of choices for a flow or global parameter.",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/getPicklistRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Returns lists of choices for a flow or global parameter.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/picklistObject"
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
            "campaignId",
            "callbackUrl"
          ],
          "type": "object",
          "properties": {
            "token": {
              "description": "One-time use access token for submitting callback data to Marketo",
              "type": "string"
            },
            "batchid": {
              "description": "ID of the marketo campaign run invoking the service",
              "type": "string"
            },
            "apiCallBackKey": {
              "description": "API key to be used in the callback header",
              "type": "string"
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
            },
            "admin": {
              "$ref": "#/components/schemas/admin"
            },
            "campaign": {
              "$ref": "#/components/schemas/campaign"
            },
            "program": {
              "$ref": "#/components/schemas/program"
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
        "admin": {
          "description": "Global configuration data as defined by Marketo administrator",
          "type": "object"
        },
        "campaign": {
          "description": "Data related to the invoking Smart Campaign",
          "type": "object"
        },
        "program": {
          "description": "Data related to the parent program of the invoking smart campaign.  May be empty even if required by service provider, if the smart campaign is not housed within a program",
          "type": "object"
        },
        "flowStepContext": {
          "description": "Data related to specific invocation of the flow action.  Property list is defined by 'flow' type service attributes in Service Definition.  Values will be based on inputs given by Marketo users in Smart Campaign UI",
          "type": "object",
          "additionalProperties": true
        },
        "programMemberContext": {
          "description": "Data related to program membership, including status, success, and program-member custom field data.  May be empty even if required if the invoking smart campaign is not housed within a program, or the lead record has not been made a member of the program",
          "type": "object",
          "properties": {
            "status": {
              "description": "Status in program.  Possible values are defined in the program's channel",
              "type": "string",
              "example": "Registered"
            },
            "id": {
              "type": "number",
              "format": "int64",
              "example": 100000
            },
            "membershipDate": {
              "description": "Date when lead became a program member",
              "type": "string",
              "format": "date-time"
            },
            "reachedSuccess": {
              "description": "Whether the lead is in a status with the success property true, as defined in the program Channel",
              "type": "boolean"
            },
            "reachedSuccessDate": {
              "description": "Date when lead first reached a success status in the program",
              "type": "string",
              "format": "date-time"
            },
            "pmcf": {
              "description": "Object containing Program Member Custom fields",
              "type": "object",
              "additionalProperties": true
            }
          }
        },
        "triggeringContext": {
          "description": "Data related to the event which triggered the invoking campaign",
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Name of the primary asset which triggered the invoking campaign",
              "example": "Lead-gen Form"
            },
            "triggerName": {
              "type": "string",
              "description": "Type of event which triggered the invoking campaign",
              "example": "Filled Out Form"
            }
          }
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
            },
            "programMemberContext": {
              "$ref": "#/components/schemas/programMemberContext"
            },
            "triggeringContext": {
              "$ref": "#/components/schemas/triggeringContext"
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
              "properties": {
                "success": {
                  "type": "boolean",
                  "description": "Whether the operation succeeded for this record"
                },
                "reason": {
                  "type": "string",
                  "description": "What occurred to cause the operation to fail",
                  "example": "No value found for search parameters, Key: country Value: Cascadia"
                },
                "errorCode": {
                  "type": "string",
                  "description": "Provide an easy-to-reference error code in the case of failure",
                  "example": "LOOKUP_VALUE_NOT_FOUND"
                }
              },
              "additionalProperties": true
            },
            "leadData": {
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
          "additionalProperties": true,
          "description": "Object used to submit data back to lead record.  Included fields must be included in service definition unless userDrivenMapping is false.  Fields must also be mapped and active in Incoming Fields menu for write to succeed."
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
            "errorCode": {
              "type": "string",
              "description": "If set, no objectData will be processed, and an error will be logged with the given errorCode and errorMessage",
              "example": "LOOKUP_VALUE_NOT_FOUND"
            },
            "errorMessage": {
              "type": "string",
              "description": "Message to be logged if errorCode was set.",
              "example": "No value found for search parameters, Key: country Value: Cascadia"
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
              "description": "Default identifier for service and activity.  Users installing multiple service with the same apiName will be prompted to resolve collision by inputting a custom name during installation.  Values 'success', 'reason', and 'errorCode' are always included in activityData and may not be declared here, see '#components/schemas/callbackData'.",
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
            "providerInstructions": {
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
            },
            "supportPage": {
              "type": "string",
              "format": "uri",
              "example": "https://serviceprovider.com/contact_us.html",
              "description": "Either supportPage or supportEmail has to be defined"
            },
            "supportEmail": {
              "type": "string",
              "format": "email",
              "example": "support@serviceprovider.com",
              "description": "Either supportPage or supportEmail has to be defined"
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
              "example": "X-API-Key"
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
                "$ref": "#/components/schemas/invocationFieldMapping"
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
                "$ref": "#/components/schemas/fieldMapping"
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
              "$ref": "#/components/schemas/fieldType"
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
        "invocationFieldMapping": {
          "allOf": [
            {
              "$ref": "#/components/schemas/fieldMapping"
            },
            {
              "type": "object",
              "properties": {
                "required": {
                  "type": "boolean",
                  "description": "Whether or not this field is required by the service, thus required during field mapping"
                }
              }
            }
          ]
        },
        "fieldMapping": {
          "type": "object",
          "required": [
            "serviceAttribute",
            "description",
            "dataType"
          ],
          "properties": {
            "serviceAttribute": {
              "description": "Name of the attribute as sent during invocation or callback. 'id' is reserved by system and cannot be used here.",
              "type": "string",
              "example": "providerFieldName"
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
              "$ref": "#/components/schemas/fieldType"
            }
          }
        },
        "serviceStatus": {
          "description": "Object containing status information.  Polled nightly.",
          "type": "object",
          "properties": {
            "info": {
              "description": "Array of info notifications to send to Marketo.  Logged as INFO in the service log",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "warnings": {
              "description": "Array of warning notifications to send to Marketo.  Logged as WARN in the service log",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "errors": {
              "description": "Array of error notifications to send to Marketo.  Logged as ERROR in the service log",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "deprecationMessage": {
              "description": "Message indicating that the service is being deprecated.",
              "type": "string"
            },
            "deprecationDate": {
              "description": "If set, and the date is in the past, Marketo will consider the service deprecated. Remove to clear deprecation status",
              "type": "string",
              "format": "datetime"
            }
          }
        },
        "picklistObject": {
          "description": "Object containing choices for flow and global parameters",
          "type": "object",
          "required": [
            "choices"
          ],
          "properties": {
            "choices": {
              "description": "List of choices to be offered in the picklist for the parameter in Marketo",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/picklistChoice"
              }
            }
          }
        },
        "picklistChoice": {
          "description": "Object containing display value and submitted value.",
          "required": [
            "displayValue",
            "submittedValue"
          ],
          "properties": {
            "displayValue": {
              "type": "object",
              "$ref": "#/components/schemas/displayValue"
            },
            "submittedValue": {
              "description": "Value which will be submitted when the choice is selected",
              "example": "country-codes.csv",
              "anyOf": [
                {
                  "type": "boolean"
                },
                {
                  "type": "integer"
                },
                {
                  "type": "number"
                },
                {
                  "type": "string"
                }
              ]
            }
          }
        },
        "displayValue": {
          "description": "Object containing display value and translations.  Additional property names should be two letter language codes, e.g. 'fr', or language/locale pairs, e.g. 'fr_ca'.",
          "type": "object",
          "required": [
            "en_US"
          ],
          "properties": {
            "en_US": {
              "description": "English display value.  This is the primary Marketo fallback choice if no translation is found in the end user's language",
              "type": "string",
              "example": "Country Codes Table"
            }
          },
          "additionalProperties": {
            "type": "string"
          }
        },
        "fieldMappingContext": {
          "description": "Object containing lists of lead fields which are mapped and sent in the payload of invocation or callback.  May be used to generate picklist choices on the fly based on configuration in Marketo",
          "type": "object",
          "properties": {
            "invocationFieldMappings": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/reqFieldMapping"
              }
            },
            "callbackFieldMappings": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/reqFieldMapping"
              }
            }
          }
        },
        "reqFieldMapping": {
          "description": "Describes lead field mappings as they are configured in the invoking marketo instance",
          "type": "object",
          "required": [
            "marketoAttribute"
          ],
          "properties": {
            "marketoAttribute": {
              "description": "Marketo API name of the mapped field.  If service is configured to use User-Driven Mappings, only the Marketo Field Name will be sent",
              "type": "string",
              "example": "email"
            },
            "serviceAttribute": {
              "description": "API Name of the mapped field as defined by the service.  Only sent if service does not use User-Driven Mappings",
              "type": "string",
              "example": "emailAddress"
            }
          }
        },
        "getPicklistRequest": {
          "description": "Schema of requests to /getPicklist",
          "required": [
            "name",
            "type"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Name of the field to retrieve choices for",
              "example": "table"
            },
            "type": {
              "type": "string",
              "description": "Type of parameter to return choices for.  Either flow or global",
              "enum": [
                "flow",
                "global"
              ]
            },
            "fieldMappingContext": {
              "description": "Field mappings as configured in the invoking Marketo instance",
              "type": "object",
              "$ref": "#/components/schemas/fieldMappingContext"
            }
          }
        },
        "fieldType": {
          "description": "Enum of acceptable datatypes for mappings, parameters, and activity attributes",
          "type": "string",
          "enum": [
            "boolean",
            "integer",
            "date",
            "datetime",
            "email",
            "float",
            "phone",
            "score",
            "string",
            "url",
            "text"
          ]
        }
      }
    }
  }
}