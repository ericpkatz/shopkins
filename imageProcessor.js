var lwip = require("lwip");
var path = require("path");
var Q = require("q");

module.exports = {
  process: process
};

function process(imagePath){
  var dfd = Q.defer();
  var imageName = path.basename(imagePath);
  var processedName = __dirname + "/images/processed/" + imageName;
  lwip.open(imagePath, function(err, image) {
    image
      .batch()
      .resize(100, 100, "linear")
      .writeFile(processedName, function(err) {
        if(!err)
          dfd.resolve(processedName);
      });
  });
  return dfd.promise;
}