var fs = require("fs");
var Q = require("q");
module.exports = {
  shopkins: shopkins,
  update: update
};

function update(shopkin){
  
}

function shopkins(){
  var dfd = Q.defer();
  fs.readFile(__dirname + "/shopkins.json", function(err, data){
    var shopkins = JSON.parse(data.toString()).shopkins;
    dfd.resolve(shopkins);
  });
  return dfd.promise;
}