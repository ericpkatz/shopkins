angular.module("app").factory("HeaderSvc", function($window){
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
})
.controller("ShopkinsHeaderCtrl", function($scope, $location, HeaderSvc, AuthSvc){
  $scope.categories = HeaderSvc.categories;
  $scope.HeaderSvc = HeaderSvc;
  $scope.user = AuthSvc.user;
  $scope.logout = function(){
    AuthSvc.logout().then(
      function(){
        $location.path("/");
      }
    );
  };
})
.directive("shopkinsHeader", function(){
  return {
    restrict: "E",
    templateUrl: "/app/templates/header.html",
    controller: "ShopkinsHeaderCtrl",
    scope: {}
  }
});