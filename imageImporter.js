var provider = require("./data/provider");
var _ = require("underscore");
var request = require("request");
var fs = require("fs");
var path = require("path");
var processor = require("./imageProcessor");
var Shopkin = require("./models/models").Shopkin;
var Q = require("q");
module.exports = {
  process: process,
  fetch: fetch
};

function ensureDirectories(){
  if (!fs.existsSync(__dirname + "/images"))
    fs.mkdirSync(__dirname + "/images");
  if (!fs.existsSync(__dirname + "/images/raw"))
    fs.mkdirSync(__dirname + "/images/raw");
  if (!fs.existsSync(__dirname + "/images/processed"))
      fs.mkdirSync(__dirname + "/images/processed");
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

function process() {
  ensureDirectories();
  Shopkin.seed().then(function(){
    provider.shopkins(true).then(function(withImages) {//start
      _.each(withImages, function(shopkin) {
        var imageUrl = shopkin.imageUrl;
        var number = shopkin.number;
        var extension = path.extname(imageUrl).toLowerCase();
  
    
        request(shopkin.imageUrl).pipe(
          fs.createWriteStream(__dirname + "/images/raw/" + number + extension)
        ).on("finish", function() {
          processor.process(this.path, number).then(function(imagePath){
            console.log(imagePath + " created");
          });
        });//finish
      });
    });//end
    
  });
}