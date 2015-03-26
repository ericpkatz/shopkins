var express = require("express");
var fs = require("fs");
var _ = require("underscore");
var dataProvider = require("./data/provider");
var imageImporter = require("./imageImporter");

imageImporter.process();

var categories = [
  { 
    name: "Fruit and Vegatables",
    id: "fruit_and_veg"
  },
  { 
    name: "Homewares",
    id: "homewares"
  },
  { 
    name: "Bakery",
    id: "bakery"
  },
  { 
    name: "Sweet Treats",
    id: "sweet_treats"
  }
];

var app = express();

app.set("view engine", "jade");

var renderView = function(title, category, req, res){
  dataProvider.shopkins().then(function(data){
    var shopkins = _.filter(data, function(shopkin){
      return shopkin.category == category;
    });
    res.render("list", {shopkins: shopkins, tab: category, title: title});  
  });
};

app.use(express.static("images"));

app.use(function(req, res, next){
 res.locals.categories = categories;
 next();
});

app.get("/", function(req, res){
  res.render("index", {tab: "home", title: "Home"});  
});

_.each(categories, function(category){
  app.get("/" + category.id, function(req, res){
    renderView(category.name, category.id, req, res);  
  });
});

app.listen(process.env.PORT);