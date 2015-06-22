LinkEventsModule.config(function ($routeProvider) {
    $routeProvider.when('/events', {
                controller: 'ListEventsController',
                templateUrl: 'app/LinkEvents/event/list.html'
            }).when('/event/:id', {
                controller: 'ShowEventController',
                templateUrl: 'app/LinkEvents/event/show.html'
            }).when('/events/edit/:id', {
                controller: 'VEditarEventoController',
                templateUrl: 'app/LinkEvents/VEditarEvento.html'
            }).when('/events/new', {
                controller: 'RegisterEventController',
                templateUrl: 'app/LinkEvents/event/new.html'
            });       


}); 

LinkEventsModule.controller('RegisterEventController', 
                              ['$scope', '$location', '$route', 'flash', 
                               'LinkEventsService', 
                               function ($scope, $location, $route, 
                                         flash, LinkEventsService) {

      $scope.msg = '';
      $scope.fEvent = {};

      LinkEventsService.VRegisterEvent().then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }

        if ($scope.logout) {
            $location.path('/');
        }
      });

      $scope.VListEvents1 = function() {
        $location.path('/events');
      };

      $scope.fEventSubmitted = false;
      $scope.ACreateEvent0 = function(isValid) {
        $scope.fEventSubmitted = true;
        if (isValid) {
          LinkEventsService.ACreateEvent($scope.fEvent).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              var label = object.data["label"];
              if (label == '/events/new') {
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

      $scope.AEliminarEvento3 = function(eventId) {
        LinkEventsService.AEliminarEvento(eventId).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VListEvents') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};
}]);

LinkEventsModule.controller('ShowEventController', 
                              ['$scope', '$location', '$route', 
                               'flash', '$routeParams', 'LinkEventsService', 
                               function ($scope, $location, $route, flash, 
                                         $routeParams, LinkEventsService) {
      $scope.msg = '';
      LinkEventsService.VShowEvent({"eventId":$routeParams.id}).then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }
      });

      $scope.VListEvents0 = function() {
        $location.path('/events');
      };

      // Reserve the event
      $scope.ReserveEvent = function() {
        LinkEventsService.AReserveEvent({"eventId" : $routeParams.id}).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VShowEvent') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};

      $scope.CancelReservation = function() {
        LinkEventsService.ACancelReservation({"eventId" : $routeParams.id}).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VShowEvent') {
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
      $scope.GenerateCredentials = function() {
        LinkEventsService.AGenerateCredentials({"eventId" : $routeParams.id}).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var credentials_link = object.data["credentials"]
          var download_link    = document.createElement('a');
          download_link.name   = 'credenciales.pdf';
          download_link.href   = credentials_link;
          download_link.target = "_blank";
          download_link.click();
        });};
        
      // Generate the certificate 
      $scope.GenerateCertificate = function() {
        LinkEventsService.AGenerateCertificate({"eventId" : $routeParams.id}).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          var certificate_link = object.data["certificate"]

          var download_link    = document.createElement('a');
          download_link.name   = 'certificado.pdf';
          download_link.href   = certificate_link;
          download_link.target = "_blank";
          download_link.click();
      });};

      $scope.VShowEvent5 = function(eventId) {
        $location.path('/VShowEvent/'+eventId);
      };

    }]);
