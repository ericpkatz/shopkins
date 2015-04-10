var provider = require("./data/provider");
var _ = require("underscore");
var request = require("request");
var fs = require("fs");
var path = require("path");
var Q = require("q");
module.exports = {
  fetch: fetch
};


function fetch(shopkins){
  var dfd = Q.defer();
  var withImages = _.filter(shopkins, function(shopkin){
    return shopkin.imageUrl;
  });
  
  var promises = withImages.map(function(shopkin){
    var dfd = Q.defer();
    var imageUrl = shopkin.imageUrl;
    var number = shopkin.number;
    var extension = path.extname(imageUrl).toLowerCase();
    request(shopkin.imageUrl)
      .on("error", function(){
        return dfd.resolve();
      })
      .pipe(
        fs.createWriteStream(__dirname + "/images/raw/" + number + extension)
      )
      .on("finish", function() {
        console.log("image imported for " + shopkin.name);
        shopkin.rawImageUrl = number + extension;
        dfd.resolve();
      });//finish
    return dfd.promise; 
  }); 
  Q.all(promises).then(function(){
    dfd.resolve(shopkins);
  });
  return dfd.promise;
}
