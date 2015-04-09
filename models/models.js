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
  glitz: Boolean,
  season: Number
});

ShopkinSchema.statics.seed = function(){
  db.then(function(){
    provider.shopkins(true).then(function(shopkins){
      shopkins.forEach(function(shopkin){
        Shopkin.update({number: shopkin.number}, shopkin, {upsert: true}, function(err, res){
          console.log(res);
        });
      });
    });
  });
};

var Shopkin = mongoose.model("Shopkin", ShopkinSchema);

module.exports = {
  Shopkin: Shopkin
};