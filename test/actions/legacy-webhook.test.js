const action = require("../../actions/v1/legacy-webhook/index.js");

const search = "test/country-codes.csv,country,Zimbabwe,alpha-2,country-code-2;"

describe("testing lookup table search", () => {
    test('testing search split', async () => {
        var splits = action.splitSearches(search);
        expect(splits[0]).toEqual("test/country-codes.csv,country,Zimbabwe,alpha-2,country-code-2");

    })
    test('testing args split', async () => {
        var splits = action.splitSearches(search);
        var args = action.searchArgs(splits[0]);
        expect(args).toEqual(expect.objectContaining({
            table: "test/country-codes.csv",
            kn: "country",
            kv: "Zimbabwe",
            lookup: "alpha-2",
            resField: "country-code-2"
        }))

    })
});