var express = require("express");
var fs = require("fs");

var app = express();

app.set("view engine", "jade");

app.get("/", function(req, res){
  res.render("index", {tab: "home", title: "Home"});  
});

app.get("/fruit_and_veg", function(req, res){
  fs.readFile(__dirname + "/data/shopkins.js", function(err, data){
    var shopkins = JSON.parse(data.toString()).shopkins;
    res.render("fruit_and_veg", {shopkins: shopkins, tab: "fruit_and_veg", title: "Fruit and Vegetables"});  
  });
});

app.listen(process.env.PORT);