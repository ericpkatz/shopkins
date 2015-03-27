var app = angular.module("app", ["ngRoute"]);
app.config(function($routeProvider, $locationProvider){
 $routeProvider
  .when("/", {
    controller: "HomeCtrl",
    templateUrl: "/app/templates/home.html"
  })
  .when("/categories/:id", {
    controller: "ShopkinsListCtrl",
    templateUrl: "/app/templates/list.html"
  });
  $locationProvider.html5Mode({enabled: true, requireBase: false});
});
app.factory("HeaderSvc", function($window){
  _categories = $window.categories;
  _tab = ""
  
  return {
    categories: _categories,
    setTab: function(value){
      _tab = value;
    },
    getTab: function(){
      return _tab;
    }
  };
});
app.controller("ShopkinsListCtrl", function($scope, $routeParams, $http, HeaderSvc){
  HeaderSvc.setTab($routeParams.id);
  $http.get("/api/categories/" + $routeParams.id).then(function(data){
    $scope.shopkins = data.data;
  });
});

app.controller("HomeCtrl", function($scope){
  $scope.foo = "buzz";
});

app.controller("ShopkinsHeaderCtrl", function($scope, HeaderSvc){
  $scope.categories = HeaderSvc.categories;
  $scope.HeaderSvc = HeaderSvc;
});
app.directive("shopkinsHeader", function(){
  return {
    restrict: "E",
    templateUrl: "/app/templates/header.html",
    controller: "ShopkinsHeaderCtrl"
  }
});