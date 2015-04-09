var lwip = require("lwip");
var path = require("path");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  process: process,
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
        image
        .batch()
          .resize(100, 100, "linear")
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

function process(imagePath, number){
  var dfd = Q.defer();  
  var imageName = path.basename(imagePath);
  var processedName = __dirname + "/images/processed/" + imageName;
  var baseProcessedName = path.basename(processedName);
  lwip.open(imagePath, function(err, image) {
    image
      .batch()
      .resize(100, 100, "linear")
      .writeFile(processedName, function(err) {
        if(!err){
          console.log("update database");
          console.log(processedName);
          console.log(number);
          Shopkin.update({number: number}, {$set:{processedImageUrl: baseProcessedName}}).then(function(res){
            dfd.resolve(processedName);
          });
        }
      });
  });//end
  return dfd.promise;
}