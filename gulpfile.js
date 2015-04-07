var gulp = require("gulp");
var provider = require("./data/provider");
var Q = require("q");
var _ = require("underscore");
var request = require("request");
var path = require("path");
var fs = require("fs");
var lwip = require("lwip");
var http = require("http");

var ImagesFetcher = {
  fetch: function() {
    var dfd = Q.defer();
    provider.shopkins().then(function(_shopkins){
      var shopkins = _shopkins;
      var promises = _.filter(_shopkins, function(shopkin){
        return shopkin.imageUrl
      }).map(function(item) {
        var dfd = Q.defer();
        var extension = path.extname(item.imageUrl).toLowerCase();
        request(item.imageUrl)
          .on("error", function(err){
            console.log(err);
            dfd.resolve(err);
          })
          .pipe(fs.createWriteStream(__dirname + "/images/raw/" + item.number + extension ))
            .on("finish", function(err, result){
              item.raw = path.basename(this.path);
              console.log(item.processed);
              dfd.resolve(shopkins); 
            });
        return dfd.promise;
      });
      Q.all(promises).then(function() {
          dfd.resolve(shopkins);
      }, function(err) {
        dfd.reject(err);
      });
      
    });
    return dfd.promise;
  }
};

gulp.task("fetchImages", function() {
    ImagesFetcher.fetch().then(
      function(items) {
        console.log(items);
        console.log("DONE");
      },
      function() {
        console.log("error");
      }
    );
});
