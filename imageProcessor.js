var lwip = require("lwip");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  resize: resize
};

function resize(shopkins){
  var dfd = Q.defer();
  var withImages = _.filter(shopkins, function(shopkin){
    return shopkin.rawImageUrl;
  });
  
  var promises = withImages.map(function(shopkin){
    var dfd = Q.defer();
    var imageName = shopkin.rawImageUrl;
    var rawPath = __dirname + "/images/raw/" + imageName;
    var processedPath = __dirname + "/images/processed/" + imageName;
    lwip
      .open(rawPath, function(err, image) {
        var width = image.width();
        var scale = 100/width;
        
        image
        .batch()
          .scale(scale, scale, "linear")
            .writeFile(processedPath, function(err) {
              if(!err){
                shopkin.processedImageUrl = imageName;
                console.log("image resized for " + shopkin.name)
                dfd.resolve();
              }
              else{
                console.log(err);
              }
            });
    });//end
    return dfd.promise; 
  }); 
  Q.all(promises).then(function(){
    dfd.resolve(shopkins);
  });
  return dfd.promise;
}