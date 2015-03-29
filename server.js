var express = require("express");
var fs = require("fs");
var _ = require("underscore");
var dataProvider = require("./data/provider");
var imageImporter = require("./imageImporter");
var db = require("./config/db/db");
var Shopkin = require("./models/models").Shopkin;

db.then(
  function(res){
    console.log(res);
  },
  function(err){
    console.log(err);
  }
);

if(!process.env.SKIP_PROCESS)
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

app.locals.pretty = true;

app.set("view engine", "jade");

var renderView = function(title, category, req, res, api){
  Shopkin.find({category: category}).then(function(shopkins){
    if(api)
      res.send(shopkins);
    else
      res.render("index");  
  });
};

app.use(express.static("images"));

app.use(express.static("client"));

app.use(function(req, res, next){
 res.locals.categories = categories;
 next();
});

app.get("/", function(req, res){
  res.render("index");  
});

_.each(categories, function(category){
  app.get("/categories/" + category.id, function(req, res){
    renderView(category.name, category.id, req, res);  
  });
  app.get("/api/categories/" + category.id, function(req, res){
    renderView(category.name, category.id, req, res, true);  
  });
});


app.listen(process.env.PORT);