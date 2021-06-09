const Papa = require('papaparse');
const fs = require('fs');

module.exports = {
    defaultConfig() {
        return {
            'header': true,
            'delimiter': ",",
            'newLine': "\n"
        }
    },
    winNewlineConfig() {

        return {
            'header': true,
            'delimiter': ",",
            'newLine': "\r\n"
        }
    },
    //takes table, key and vals, lookupField and Papaparse config
    //returns object with KVs as keys and lookupField values as vals
    //todo non-match case support
    //todo nest papaparse config settings
    search(table, keyName, keyValues, lookupField, config = {}, headers) {
        var results = {};

        config['complete'] = function () {
            console.log("Completed search: ");
            console.log(results);
        };
        if (headers != null) {
            var headerMap = {};
            var i;
            for (i = 0; i < headers.length;) {
                headerMap[headers[i]] = i + 1;
                i++;
            }
            config['step'] = function (row, parser) {
                var index = keyValues.indexOf(row.data[headerMap[keyName]]);
                if (index > -1) {
                    results[row.data[headerMap[keyName]]] = row.data[headerMap[lookupField]];
                    keyValues.splice(index, 1);
                }
            }
        } else {
            config['step'] = function (row, parser) {
                var index = keyValues.indexOf(row.data[keyName]);
                if (index > -1) {
                    results[row.data[keyName]] = row.data[lookupField];
                    keyValues.splice(index, 1);
                }
            };
        }
        var papaTable = Papa.parse(table, config);
        results["_table"] = papaTable;
        return results;
    }
};