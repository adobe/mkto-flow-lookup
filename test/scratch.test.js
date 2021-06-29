const fetch = require('node-fetch');


describe("scratch tests", () =>{
    test("send simple request to validate", async () => {
        var validateUrl = "https://208192-aiofileman.adobeio-static.net/api/v1/web/mkto-flow-lookup-0.0.1/validate";
        var params = {
            "schemaName": "test-schema",
            "object": { "foo": 1, "bar": "baz" }
        };
        var validRes = await fetch(validateUrl, {"method": "POST", body: JSON.stringify(params), headers: { "Content-Type": "application/json" } });
        console.log(await validRes.json());
    })
})