var mongoose = require("mongoose");
var Q = require("q");

var dfd = Q.defer();
if(!process.env.CONN)
  dfd.reject("You must set environment variable - CONN");
else{
  mongoose.connect(process.env.CONN);
  mongoose.connection.once("open", function(){
    dfd.resolve("CONNECTED");
  });
  mongoose.connection.on("error", function(err){
    dfd.reject(err);
  });
}
var promise = dfd.promise;

module.exports = promise;