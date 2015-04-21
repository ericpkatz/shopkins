angular.module("app").factory("AuthSvc", function($http, $q, $window){
  var _user = {
    authenticated: function(){
      return this.username;
    }
  };
  var _token = function(){
    return $window.sessionStorage.getItem("token");
  };
  
  return {
    authenticate: authenticate,
    getUser: getUser,
    logout: logout,
    user: _user
  };
  
  function logout(){
    var dfd = $q.defer();
    $window.sessionStorage.removeItem("token");
    _user.username = null;
    dfd.resolve();
    return dfd.promise;
  }
  
  function getUser(){
    if(!_token())
      return;
    var dfd = $q.defer();
    $http.get("/api/sessions/" + _token()).then(
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
        $window.sessionStorage.setItem("token", success.data);
        dfd.resolve();
      },
      function(failure){
        console.log(failure);
      }
    );
    return dfd.promise;
  }
  
});

angular.module("app").controller("LoginCtrl", function($scope, $location, AuthSvc){
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