var gulp = require("gulp");
var jsonProvider = require("./data/provider");
var _ = require("underscore");
var fs = require("fs");
var del = require("del");
var importer = require("./imageImporter");
var processor = require("./imageProcessor");
var Q = require("q");

gulp.task("images:clean", function(cb){
  function clean(){
    del([__dirname + "/data/shopkins_processed.json", __dirname + "/images/processed/*", __dirname + "/images/raw/*"], function(){
      setTimeout(cb, 1000);
      
    });
  }

  setTimeout(clean, 1000);
});

gulp.task("images:download", ["images:clean"], function(cb){
  function download(){
    jsonProvider.shopkins().then(importer.fetch).then(jsonProvider.save).then(function(shopkins){
      cb();
    });
  }
  download();
});

gulp.task("images:process", ["images:clean", "images:download"], function(cb){
  function process(){
    jsonProvider.shopkins(true).then(processor.resize).then(jsonProvider.save).then(function(shopkins){
      cb();
    });
  }
  setTimeout(process, 3000);
});

gulp.task("db:update", ["images:clean", "images:download", "images:process"], function(cb){
  function setSeason(shopkins){
    var dfd = Q.defer();
    shopkins.forEach(function(shopkin){
      shopkin.season = shopkin.number.split('-')[0];
    }); 
    console.log(shopkins);
    dfd.resolve(shopkins);
    return dfd.promise;
  }
  function update(){
    jsonProvider.shopkins(true).then(setSeason).then(jsonProvider.save).then(function(shopkins){
      cb();
    });
  }
  update();
});

gulp.task("default", ["images:clean", "images:download", "images:process", "db:update"], function(){
  console.log("DONE");
});
