var provider = require("./data/provider");
var _ = require("underscore");
var request = require("request");
var fs = require("fs");
var path = require("path");
var lwip = require("lwip");
var Q = require("q");
module.exports = {
  process: process
};

function ensureDirectories(){
  var dfd = Q.defer();
  if (!fs.existsSync(__dirname + "/images"))
    fs.mkdirSync(__dirname + "/images");
  if (!fs.existsSync(__dirname + "/images/raw"))
    fs.mkdirSync(__dirname + "/images/raw");
  if (!fs.existsSync(__dirname + "/images/processed"))
      fs.mkdirSync(__dirname + "/images/processed");
  dfd.resolve(); 
  return dfd.promise;
};
function process() {
  ensureDirectories().then(function() {
    provider(function(data) {
      var withImages = _.filter(data, function(d) {
        return d.imageUrl
      });
      _.each(withImages, function(shopkin) {
        var imageUrl = shopkin.imageUrl;
        var number = shopkin.number;
        var extension = path.extname(imageUrl).toLowerCase();

        request(shopkin.imageUrl).pipe(
          fs.createWriteStream(__dirname + "/images/raw/" + number + extension)
        ).on("finish", function() {
          var imagePath = this.path;
          var imageName = path.basename(imagePath);
          console.log(imageName);
          lwip.open(this.path, function(err, image) {
            image
              .batch()
              .resize(100, 100, "linear")
              .writeFile(__dirname + "/images/processed/" + imageName, function(err) {
                console.log(err);
              });
          });
          console.log(this.path);
        });
        //console.log(shopkin.imageUrl);
      });
    });
  });
}