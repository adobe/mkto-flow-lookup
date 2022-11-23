const { uploadFile } = require("./uploadFile");

function main(){
    uploadFile("./test/country-codes.csv", "country-codes.csv")
}

main()