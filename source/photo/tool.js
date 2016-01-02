/**
 * Created by zlw on 2016/1/1.
 */
var fs = require("fs");

fs.readdir("../../photos", function (err, files) {
    fs.writeFile("output.json", JSON.stringify(files, null, "\t"));
});