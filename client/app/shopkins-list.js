
angular.module("app").controller("ShopkinsListCtrl", function($scope, $routeParams, $http, HeaderSvc){
  HeaderSvc.setTab($routeParams.id);
  $http.get("/api/categories/" + $routeParams.id).then(function(data){
    $scope.shopkins = data.data;
  });
});