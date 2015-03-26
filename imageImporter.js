var provider = require("./data/provider");
var _ = require("underscore");
var request = require("request");
var fs = require("fs");
var path = require("path");
var processor = require("./imageProcessor");
module.exports = {
  process: process
};

function ensureDirectories(){
  if (!fs.existsSync(__dirname + "/images"))
    fs.mkdirSync(__dirname + "/images");
  if (!fs.existsSync(__dirname + "/images/raw"))
    fs.mkdirSync(__dirname + "/images/raw");
  if (!fs.existsSync(__dirname + "/images/processed"))
      fs.mkdirSync(__dirname + "/images/processed");
};

function process() {
  ensureDirectories();
  provider.shopkins().then(function(data) {
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
        processor.process(this.path).then(function(imagePath){
          console.log(imagePath + " created");
        });
      });
    });
  });
}