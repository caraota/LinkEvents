EventPlannerModule.config(function ($routeProvider) {
    $routeProvider.when('/events', {
                controller: 'ListEventsController',
                templateUrl: 'app/EventPlanner/event/list.html'
            }).when('/event/:id', {
                controller: 'ShowEventController',
                templateUrl: 'app/EventPlanner/event/show.html'
            }).when('/events/edit/:id', {
                controller: 'VEditEventController',
                templateUrl: 'app/EventPlanner/VEditEvent.html'
            }).when('/events/new', {
                controller: 'RegisterEventController',
                templateUrl: 'app/EventPlanner/event/new.html'
            });       


}); 

EventPlannerModule.controller('RegisterEventController', 
                              ['$scope', '$location', '$route', 'flash', 
                               'EventPlannerService', 
                               function ($scope, $location, $route, 
                                         flash, EventPlannerService) {

      $scope.msg = '';
      $scope.fEvent = {};

      EventPlannerService.VRegisterEvent().then(function (object) {
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
          EventPlannerService.ACreateEvent($scope.fEvent).then(function (object) {
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

EventPlannerModule.controller('ListEventsController', 
        ['$scope', '$location', '$route', 'flash', 'EventPlannerService',
    function ($scope, $location, $route, flash, EventPlannerService) {
      $scope.msg = '';
      EventPlannerService.VListEvents().then(function (object) {
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

      $scope.VHome1 = function() {
        $location.path('/VHome');
      };

      $scope.show = function(eventId) {
        $location.path('/event/'+eventId);
      };

      $scope.ADeleteEvent3 = function() {
        EventPlannerService.ADeleteEvent().then(function (object) {
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

EventPlannerModule.controller('ShowEventController', 
                              ['$scope', '$location', '$route', 
                               'flash', '$routeParams', 'EventPlannerService', 
                               function ($scope, $location, $route, flash, 
                                         $routeParams, EventPlannerService) {
      $scope.msg = '';
      EventPlannerService.VShowEvent({"eventId":$routeParams.id}).then(function (object) {
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
        EventPlannerService.AReserveEvent({"eventId" : $routeParams.id}).then(function (object) {
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
        EventPlannerService.ACancelReservation({"eventId" : $routeParams.id}).then(function (object) {
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
        EventPlannerService.VListUsers({"eventId" : $routeParams.id}).then(function (object) {
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
        EventPlannerService.AGenerateCredentials({"eventId" : $routeParams.id}).then(function (object) {
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
        EventPlannerService.AGenerateCertificate({"eventId" : $routeParams.id}).then(function (object) {
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
