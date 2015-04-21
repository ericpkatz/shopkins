var express = require("express");
var Shopkin = require("./models/models").Shopkin;
var User = require("./models/models").User;
var _ = require("underscore");
var fs = require("fs");
var jade = require("jade");
var bodyParser = require("body-parser");
var jwt = require("jwt-simple");

Shopkin.seed();

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
  Shopkin.find({category: category}).sort("number").then(function(shopkins){
    if(api)
      res.send(shopkins);
    else
      res.render("index");  
  });
};

app.get("/client/app/templates/:file_name.jade", function(req, res, next){
  fs.readFile(__dirname + req.url, function(err, data){
    res.send(jade.render(data.toString())); 
  }); 
});
app.use(express.static("images"));

app.use(express.static("client"));

app.use(bodyParser.json());

app.use(function(req, res, next){
 res.locals.categories = categories;
 next();
});

app.get("/", function(req, res){
  res.render("index");  
});

app.get("/login", function(req, res){
  res.render("index");  
});

app.post("/api/sessions", function(req, res){
  User.findOne(req.body).select("username").exec(function(err, user){
    if(user)
      return res.send(jwt.encode(user, "foo"));
    else
      return res.status(401).send({ error: "user password combo not found"});
  });
});

app.get("/api/sessions/:token", function(req, res){
    return res.send(jwt.decode(req.params.token, "foo"));
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