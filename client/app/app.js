var app = angular.module("app", ["ngRoute"]);
app.config(function($routeProvider, $locationProvider){
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
    templateUrl: "/app/templates/list.html"
  });
  $locationProvider.html5Mode({enabled: true, requireBase: false});
});

app.factory("HeaderSvc", function($window){
  var _categories = $window.categories;
  var _tab = "";
  
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

app.factory("AuthSvc", function($http, $q){
  var _user = {
    authenticated: function(){
      return this.username;
    }
  };
  var _token = null;
  
  return {
    authenticate: authenticate,
    getUser: getUser,
    logout: logout,
    user: _user
  };
  
  function logout(){
    var dfd = $q.defer();
    _token = null;
    _user.username = null;
    dfd.resolve();
    return dfd.promise;
  }
  function getUser(){
    var dfd = $q.defer();
    $http.get("/api/sessions/" + _token).then(
      function(success){
        _user.username = success.data.username;
        dfd.resolve(); 
      },
      function(failure){}
    );  
    return dfd.promise;
  }
  function authenticate(user){
    var dfd = $q.defer();
    $http.post("/api/sessions", user).then(
      function(success){
        _token = success.data;
        dfd.resolve();
      },
      function(failure){
        console.log(failure);
      }
    );
    return dfd.promise;
  }
  
  
})
app.controller("LoginCtrl", function($scope, $location, AuthSvc){
  $scope.foo = "bar";
  $scope.login = function(){
    AuthSvc.authenticate($scope.user).then(
      function(){
        AuthSvc.getUser().then(function(){
          $location.path("/");
        });
      }
    );
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

app.controller("ShopkinsHeaderCtrl", function($scope, $location, HeaderSvc, AuthSvc){
  $scope.categories = HeaderSvc.categories;
  $scope.HeaderSvc = HeaderSvc;
  $scope.user = AuthSvc.user;
  $scope.logout = function(){
    console.log("logout");
    AuthSvc.logout().then(
      function(){
        $location.path("/");
      }
    );
  };
});
app.directive("shopkinsHeader", function(){
  return {
    restrict: "E",
    templateUrl: "/app/templates/header.html",
    controller: "ShopkinsHeaderCtrl",
    scope: {}
  }
});