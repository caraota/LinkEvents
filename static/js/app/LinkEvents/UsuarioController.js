LinkEventsModule.config(function ($routeProvider) {
    $routeProvider.when('/usuario/nuevo', {
        controller: 'CrearUsuarioController',
        templateUrl: 'app/LinkEvents/VRegistrarUsuario.html'
    }).when('/usuario/iniciar_sesion', {
        controller: 'IniciarSesionController',
        templateUrl: 'app/LinkEvents/VIniciarSesion.html'
    }).when('/users/:requestedUser', {
        controller: 'ListUsersController',
        templateUrl: 'app/LinkEvents/user/list.html'
    }).when('/users/', {
        controller: 'ListUsersController',
        templateUrl: 'app/LinkEvents/user/list.html'
    }).when('/users/show/:user', {
        controller: 'ShowUserController',
        templateUrl: 'app/LinkEvents/user/show.html'
    }).when('/users/edit/:user', {
        controller: 'VEditUserController',
        templateUrl: 'app/LinkEvents/user/edit.html'
    }).when('/event/participants/:id', {
        controller: 'ListUserController',
        templateUrl: 'app/LinkEvents/user/list.html'
    });
}); 

LinkEventsModule.controller('CrearUsuarioController', 
                              ['$scope', '$location', '$route', 'flash', 'LinkEventsService', 
                                  function ($scope, $location, $route, flash, LinkEventsService) {
      $scope.msg = '';
      $scope.fUser = {};

      LinkEventsService.VRegistrarUsuario().then(function (object) {
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
      $scope.VIniciarSesion1 = function() {
        $location.path('/usuario/iniciar_sesion');
      };

      $scope.fUserSubmitted = false;
      $scope.ACrearUsuario0 = function(isValid) {
        $scope.fUserSubmitted = true;
        if (isValid) {
          LinkEventsService.ACrearUsuario($scope.fUser).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              var label = object.data["label"];
              if (label == '/usuario/nuevo') {
                  $route.reload();
              } else {
                  $location.path(label);
              }
          });
        }
      };

}]);

LinkEventsModule.controller('IniciarSesionController', 
        ['$scope', '$location', '$route', 'flash', 'LinkEventsService',
    function ($scope, $location, $route, flash, LinkEventsService) {
      $scope.msg = '';
      $scope.fLogin = {};

      LinkEventsService.VIniciarSesion().then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }

        if (object.data['actor']) {
            //$location.path('/linkevents/VHome');
        }  
      });

      $scope.VRegistrarUsuario0 = function() {
        $location.path('/usuario/nuevo');
      };

      $scope.fLoginSubmitted = false;
      $scope.AIniciarSesion1 = function(isValid) {
        $scope.fLoginSubmitted = true;
        if (isValid) {
          LinkEventsService.AIniciarSesion($scope.fLogin).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              var label = object.data["label"];
              if (label == '/usuario/iniciar_sesion') {
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


LinkEventsModule.controller('ListUsersController', 
        ['$scope', '$location', '$route', 'flash', '$routeParams', 'LinkEventsService',
    function ($scope, $location, $route, flash, $routeParams, LinkEventsService) {
      $scope.msg = '';
      
      LinkEventsService.VListUsers({"requestedUser":$routeParams.requestedUser}).then(function (object) {
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
        LinkEventsService.ADeleteUser().then(function (object) {
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
        LinkEventsService.AVerifyAssitance().then(function (object) {
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

LinkEventsModule.controller('ShowUserController', ['$scope', '$location', '$route', 
                                                      'flash', '$routeParams', 'LinkEventsService', 
                                                      function ($scope, $location, 
                                                                $route, flash, $routeParams, 
                                                                LinkEventsService) {
      $scope.msg = '';
      LinkEventsService.VShowUser({"user":$routeParams.user}).then(function (object) {
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
        LinkEventsService.AEvents().then(function (object) {
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