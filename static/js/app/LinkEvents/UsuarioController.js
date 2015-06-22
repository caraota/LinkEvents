LinkEventsModule.config(function ($routeProvider) {
    $routeProvider.when('/usuario/nuevo', {
        controller: 'CrearUsuarioController',
        templateUrl: 'app/LinkEvents/VRegistrarUsuario.html'
    }).when('/usuario/iniciar_sesion', {
        controller: 'IniciarSesionController',
        templateUrl: 'app/LinkEvents/VIniciarSesion.html'
    }).when('/VListarUsuarios/:eventoid', {
        controller: 'VListarUsuariosController',
        templateUrl: 'app/LinkEvents/VListarUsuarios.html'

    })
    ;
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

LinkEventsModule.controller('VListarUsuariosController', 
                              ['$scope', '$location', '$route', 
                               'flash', '$routeParams', 'LinkEventsService', 
                               function ($scope, $location, $route, flash, 
                                         $routeParams, LinkEventsService) {
      LinkEventsService.VListarUsuarios({"eventoid":$routeParams.eventoid}).then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }
      });

      $scope.VPrincipal = function() {
        $location.path('/VPrincipal');
      };

    }]);





