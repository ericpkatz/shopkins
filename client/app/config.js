angular.module("app").config(function($routeProvider, $locationProvider){
 $routeProvider
  .when("/", {
    controller: "HomeCtrl",
    templateUrl: "/app/templates/home.html"
  })
  .when("/login", {
    controller: "LoginCtrl",
    templateUrl: "/client/app/templates/login.jade"
  })
  .when("/categories/:id", {
    controller: "ShopkinsListCtrl",
    templateUrl: "/client/app/templates/list.jade"
  });
  $locationProvider.html5Mode({enabled: true, requireBase: false});
});