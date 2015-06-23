LinkEventsModule.config(function ($routeProvider) {
    $routeProvider.when('/VEvento/:id', {
                controller: 'VEventoController',
                templateUrl: 'app/LinkEvents/VEvento.html'
            }).when('/VEditarEvento/:id', {
                controller: 'VEditarEventoController',
                templateUrl: 'app/LinkEvents/VEditarEvento.html'
            }).when('/VCrearEvento', {
                controller: 'VCrearEventoController',
                templateUrl: 'app/LinkEvents/VCrearEvento.html'
            });
}); 

LinkEventsModule.controller('VCrearEventoController', 
                              ['$scope', '$location', '$route', 'flash', 
                               'LinkEventsService', 
                               function ($scope, $location, $route, 
                                         flash, LinkEventsService) {
      $scope.msg = '';
      $scope.fEvento = {};

      LinkEventsService.VCrearEvento().then(function (object) {
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

      $scope.fEventoCreado = false;
      $scope.ACrearEvento0 = function(isValid) {
        $scope.fEventoCreado = true;
        if (isValid) {
          LinkEventsService.ACrearEvento($scope.fEvento).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              var label = object.data["label"];
              if (label == '/VCrearEvento') {
                  $route.reload();
              } else {
                  $location.path(label);
              }
          });
        }
      };
}]);

LinkEventsModule.controller('VEventoController', 
                              ['$scope', '$location', '$route', 
                               'flash', '$routeParams', 'LinkEventsService', 
                               function ($scope, $location, $route, flash, 
                                         $routeParams, LinkEventsService) {
      $scope.msg = '';
      LinkEventsService.VEvento({"eventoid":$routeParams.id}).then(function (object) {
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

      // Reserve the event
      $scope.ReservarEvento = function() {
        LinkEventsService.AReservarEvento({"eventoid" : $routeParams.id}).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VEvento') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};

      $scope.EliminarReserva = function() {
        LinkEventsService.AEliminarReserva({"eventoid" : $routeParams.id}).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VEvento') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });
      
      }
      // List the users that will assists to this event
      $scope.VListarUsuarios2 = function(eventId) {
          $location.path('/VListarUsuarios/'+eventId);
      };

      // Generate the credentials 
      $scope.GenerarCredencial = function() {
        LinkEventsService.AGenerarCredencial({"eventoid" : $routeParams.id}).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var credencial_link = object.data["credencial"]
          var link_descarga = document.createElement('a');
          link_descarga.name = 'generarcredencial.pdf';
          link_descarga.href = credencial_link;
          link_descarga.target = "_blank";
          link_descarga.click();
        });};
        
      // Generate the certificate 
      $scope.GenerarCertificado = function() {
        LinkEventsService.AGenerarCertificado({"eventoid" : $routeParams.id}).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          var certificado_ruta = object.data["certificado"]
          var link    = document.createElement('a');
          link.name   = 'certificado.pdf';
          link.href   = certificado_ruta;
          link.target = "_blank";
          link.click();
      });};

      $scope.VEditarEvento = function(eventid) {
        $location.path('/VEditarEvento/'+eventid);
      };
    }]);

LinkEventsModule.controller('VEditarEventoController', 
                              ['$scope', '$location', '$route', 
                               'flash', '$routeParams', 'LinkEventsService', 
                               function ($scope, $location, $route, flash, 
                                         $routeParams, LinkEventsService) {
      $scope.msg = '';
      $scope.fEvento = {};
      LinkEventsService.VEditarEvento({"eventoid":$routeParams.id}).then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }
      });

      $scope.AEditarEvento1 = function(isValid) {
        if (isValid) {
          LinkEventsService.AEditarEvento($scope.fEvento,$routeParams.id).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              var label = object.data["label"];
              if (label == '/VEditarEvento') {
                  $route.reload();
              } else {
                  $location.path(label);
              }
          });
        }
      };

      $scope.VPrincipal = function() {
        $location.path('/VPrincipal');
      };

    }]);
