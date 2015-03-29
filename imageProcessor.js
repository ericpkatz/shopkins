var lwip = require("lwip");
var path = require("path");
var Q = require("q");
var Shopkin = require("./models/models").Shopkin;

module.exports = {
  process: process
};

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
  });
  return dfd.promise;
}