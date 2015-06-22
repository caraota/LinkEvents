LinkEventsModule.config(function ($routeProvider) {
    $routeProvider.when('/eventos', {
                controller: 'ListarEventosController',
                templateUrl: 'app/LinkEvents/evento/listar.html'
            }).when('/VEvento/:id', {
                controller: 'VEventoController',
                templateUrl: 'app/LinkEvents/VEvento.html'
            }).when('/events/edit/:id', {
                controller: 'VEditarEventoController',
                templateUrl: 'app/LinkEvents/VEditEvent.html'
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

LinkEventsModule.controller('ListEventsController', 
        ['$scope', '$location', '$route', 'flash', 'LinkEventsService',
    function ($scope, $location, $route, flash, LinkEventsService) {
      $scope.msg = '';
      LinkEventsService.VListEvents().then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }
      });

      $scope.VRegisterEvent0 = function() {
        $location.path('/events/new');
      };

      $scope.VPrincipal1 = function() {
        $location.path('/VPrincipal');
      };

      $scope.show = function(eventId) {
        $location.path('/event/'+eventId);
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
      $scope.AUsers2 = function(eventId) {
        LinkEventsService.VListUsers({"eventId" : $routeParams.id}).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);

          $location.path('/users/'+eventId);
          /*var label = object.data["label"];
          if (label == '/VShowEvent') {
              $route.reload();
          } else {
              $location.path(label);
          }*/
        });};

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

      $scope.VEvento5 = function(eventId) {
        $location.path('/VEvento/'+eventoid);
      };

    }]);
