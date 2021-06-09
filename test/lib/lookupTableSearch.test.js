const lts = require('../../lib/lookupTableSearch');
const fs = require('fs');

const search = "test/country-codes.csv,country,Zimbabwe,alpha-2,country-code-2;"

const defParams = {
    "table": "test/country-codes.csv",
    "kn":"country",
    "kv":"Zimbabwe",
    "lookup":"alpha-2",
    "resField": "country-code-2"
};

describe("testing lookup table search", () =>{
    test('testing simple lookup',  () => {
        var res = lts.search(fs.readFileSync("./test/country-codes.csv", "utf-8"), defParams.kn, [defParams.kv], defParams.lookup);
        console.log(res);
        expect(res).toEqual(expect.objectContaining({"Zimbabwe": "ZW"}));
    }
    
    )
});