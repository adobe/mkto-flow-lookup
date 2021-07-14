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
    //TODO replace papa w/ https://csv.js.org/parse/api/stream/

    /**
     * 
     * @param {string} table Location of table file in aio filestore
     * @param {string} keyName Name of the column to match against
     * @param {string[]} keyValues Array of values to match against
     * @param {string} lookupField Column to retrieve value from in matched rows
     * @param {Object} config Papa config parameters 
     * @param {string[]} headers Optional list of column header names
     * @returns 
     */
    search(table, keyName, keyValues, lookupField, config = {}, headers) {
        var results = {};
        if(!headers){
            config['header'] = true;
        }
        config['complete'] = function () {
            console.log("Completed search: ");
            console.log(results);
        };
        if (headers != null) {
            console.log("headerless search");
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