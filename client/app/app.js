var app = angular.module("app", ["ngRoute"]);

app.run(function(AuthSvc){
  AuthSvc.getUser();
});