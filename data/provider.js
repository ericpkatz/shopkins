var fs = require("fs");
module.exports = function(cb){
  fs.readFile(__dirname + "/shopkins.json", function(err, data){
    var shopkins = JSON.parse(data.toString()).shopkins;
    cb(shopkins);
  });
}