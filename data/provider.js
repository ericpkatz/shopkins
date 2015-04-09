var fs = require("fs");
var Q = require("q");
var _ = require("underscore");
module.exports = {
  shopkins: shopkins,
  update: update, 
  save: save
};

function save(shopkins){
  var dfd = Q.defer();
  var data = JSON.stringify({shopkins: shopkins},null, 4);
  fs.writeFile(__dirname + "/shopkins_processed.json", data, function(){
      dfd.resolve(shopkins);
  });
  return dfd.promise;
}

function update(shopkin){
  
}

function shopkins(processed){
  var dfd = Q.defer();
  var file = "/shopkins.json";
  if(processed)
    file ="/shopkins_processed.json";
  fs.readFile(__dirname + file, function(err, data){
    var shopkins = JSON.parse(data.toString()).shopkins;
    dfd.resolve(shopkins);
  });
  return dfd.promise;
}