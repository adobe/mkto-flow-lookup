const { TestScheduler } = require("jest");
const action = require("../../actions/v1/legacy-webhook/index.js");

const search = "test/country-codes.csv,country,Zimbabwe,alpha-2,country-code-2;"

describe("testing lookup table search webhook ", () => {
    test("no op", ()=> {console.log("this is fine")});
});