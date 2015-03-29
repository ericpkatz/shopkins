var fs = require("fs");
var Q = require("q");
var _ = require("underscore");
module.exports = {
  shopkins: shopkins,
  update: update
};

function update(shopkin){
  
}

function shopkins(imagesOnly){
  var dfd = Q.defer();
  fs.readFile(__dirname + "/shopkins.json", function(err, data){
    var shopkins = JSON.parse(data.toString()).shopkins;
    if(imagesOnly){
      shopkins = _.filter(shopkins, function(d) {
        return d.imageUrl
      });
    }
    dfd.resolve(shopkins);
  });
  return dfd.promise;
}