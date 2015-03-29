var mongoose = require("mongoose");
var provider = require("../data/provider");
var db = require("../config/db/db");
var ShopkinSchema = new mongoose.Schema({
  name: String,
  number: String,
  imageUrl: String,
  category: String,
  value: String,
  glitz: Boolean
});

ShopkinSchema.statics.seed = function(){
  db.then(function(){
    Shopkin.remove({}).then(function(){
      provider.shopkins().then(function(shopkins){
        shopkins.forEach(function(shopkin){
          Shopkin.create(shopkin).then(function(res){
            console.log(res);
          });
        });
      });
    });
  });
};

var Shopkin = mongoose.model("Shopkin", ShopkinSchema);

module.exports = {
  Shopkin: Shopkin
};