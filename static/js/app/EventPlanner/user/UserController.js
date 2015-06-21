EventPlannerModule.config(function ($routeProvider) {
    $routeProvider.when('/user/new', {
        controller: 'CreateUserController',
        templateUrl: 'app/EventPlanner/user/new.html'
    }).when('/user/login', {
        controller: 'LoginUserController',
        templateUrl: 'app/EventPlanner/user/login.html'
    }).when('/users/:requestedUser', {
        controller: 'ListUsersController',
        templateUrl: 'app/EventPlanner/user/list.html'
    }).when('/users/', {
        controller: 'ListUsersController',
        templateUrl: 'app/EventPlanner/user/list.html'
    }).when('/users/show/:user', {
        controller: 'ShowUserController',
        templateUrl: 'app/EventPlanner/user/show.html'
    }).when('/users/edit/:user', {
        controller: 'VEditUserController',
        templateUrl: 'app/EventPlanner/user/edit.html'
    }).when('/event/participants/:id', {
        controller: 'ListUserController',
        templateUrl: 'app/EventPlanner/user/list.html'
    });
}); 

EventPlannerModule.controller('CreateUserController', 
                              ['$scope', '$location', '$route', 'flash', 'EventPlannerService', 
                                  function ($scope, $location, $route, flash, EventPlannerService) {

      $scope.msg = '';
      $scope.fUser = {};

      EventPlannerService.VRegisterUser().then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }

        if (object.data['username']) {
            $scope.usuario.nombre = object.data['username']; 
        }
      });
      $scope.VLoginUser1 = function() {
        $location.path('/user/login');
      };

      $scope.fUserSubmitted = false;
      $scope.ACreateUser0 = function(isValid) {
        $scope.fUserSubmitted = true;
        if (isValid) {
          EventPlannerService.ACreateUser($scope.fUser).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              var label = object.data["label"];
              if (label == '/user/new') {
                  $route.reload();
              } else {
                  $location.path(label);
              }
          });
        }
      };

}]);

EventPlannerModule.controller('LoginUserController', 
        ['$scope', '$location', '$route', 'flash', 'EventPlannerService',
    function ($scope, $location, $route, flash, EventPlannerService) {
      $scope.msg = '';
      $scope.fLogin = {};

      EventPlannerService.VLoginUser().then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }

        if (object.data['actor']) {
            //$location.path('/eventplanner/VHome');
        }  
      });

      $scope.VRegisterUser0 = function() {
        $location.path('/user/new');
      };

      $scope.fLoginSubmitted = false;
      $scope.ALoginUser1 = function(isValid) {
        $scope.fLoginSubmitted = true;
        if (isValid) {
          EventPlannerService.ALoginUser($scope.fLogin).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              var label = object.data["label"];
              if (label == '/user/login') {
                  $route.reload();
              } else {
                  $location.path(label);
              }
              if (object.data['actor']) {
                  $scope.user = object.data['actor']; 
              }  
          });
        }
      };
}]);


EventPlannerModule.controller('ListUsersController', 
        ['$scope', '$location', '$route', 'flash', '$routeParams', 'EventPlannerService',
    function ($scope, $location, $route, flash, $routeParams, EventPlannerService) {
      $scope.msg = '';
      
      EventPlannerService.VListUsers({"requestedUser":$routeParams.requestedUser}).then(function (object) {
        $scope.res = object.data;      
        $scope.users = object.data["users"];
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }
      });
      $scope.ADeleteUser0 = function() {
        EventPlannerService.ADeleteUser().then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VListUsers') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};
      $scope.AVerifyAssitance1 = function() {
        EventPlannerService.AVerifyAssitance().then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VListUsers') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};
      $scope.show = function(username) {
        console.log(username);
        $location.path('/users/show/'+username);

      };
      $scope.VHome1 = function() {
        $location.path('/VHome');
      };
       $scope.VListEvents = function() {
        $location.path('/events');
      };

}]);

EventPlannerModule.controller('ShowUserController', ['$scope', '$location', '$route', 
                                                      'flash', '$routeParams', 'EventPlannerService', 
                                                      function ($scope, $location, 
                                                                $route, flash, $routeParams, 
                                                                EventPlannerService) {
      $scope.msg = '';
      EventPlannerService.VShowUser({"user":$routeParams.user}).then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }
      });
       $scope.VListUsers = function() {
        $location.path('/users');
      };
      $scope.VHome = function() {
        $location.path('/VHome');
      };
      $scope.VListEvents = function() {
        $location.path('/events');
      };
      $scope.AEvents2 = function() {
        EventPlannerService.AEvents().then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VShowUser') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};
      $scope.VShowEvent = function(eventid) {
        $location.path('/event/'+eventid);
      };
}]);