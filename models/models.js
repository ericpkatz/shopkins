var mongoose = require("mongoose");
var provider = require("../data/provider");
var db = require("../config/db/db");
var Q = require("q");
var ShopkinSchema = new mongoose.Schema({
  name: String,
  number: String,
  imageUrl: String,
  processedImageUrl: String,
  category: String,
  value: String,
  glitz: Boolean
});

ShopkinSchema.statics.seed = function(){
  var dfd = Q.defer()
  db.then(function(){
    Shopkin.remove({}).then(function(){
      provider.shopkins().then(function(shopkins){
        Shopkin.create(shopkins).then(function(res){
          dfd.resolve();
        });
      });
    });
  });
  return dfd.promise;
};

var Shopkin = mongoose.model("Shopkin", ShopkinSchema);

module.exports = {
  Shopkin: Shopkin
};