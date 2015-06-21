EventPlannerModule.config(function ($routeProvider) {
    // TODO: Fix the routes' names
    $routeProvider.when('/VHome', {
                controller: 'VHomeController',
                templateUrl: 'app/EventPlanner/VHome.html'
            }).when('/VListEvents', {
                controller: 'VListEventsController',
                templateUrl: 'app/EventPlanner/VListEvents.html'
            }).when('/VShowEvent/:eventId', {
                controller: 'VShowEventController',
                templateUrl: 'app/EventPlanner/VShowEvent.html'
            }).when('/VEditEvent', {
                controller: 'VEditEventController',
                templateUrl: 'app/EventPlanner/VEditEvent.html'
            }).when('/VRegisterEvent', {
                controller: 'VRegisterEventController',
                templateUrl: 'app/EventPlanner/VRegisterEvent.html'
            }).when('/VListUsers/:requestedUser', {
                controller: 'VListUsersController',
                templateUrl: 'app/EventPlanner/VListUsers.html'
            }).when('/VCredential', {
                controller: 'VCredentialController',
                templateUrl: 'app/EventPlanner/VCredential.html'
            }).when('/VCertificate', {
                controller: 'VCertificateController',
                templateUrl: 'app/EventPlanner/VCertificate.html'
            });
});

EventPlannerModule.controller('VHomeController', 
        ['$scope', '$location', '$route', 'flash', 'EventPlannerService',
    function ($scope, $location, $route, flash, EventPlannerService) {
      $scope.msg = '';
      EventPlannerService.VHome().then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }
        if (object.data['actor']) {
            $scope.user = object.data['actor']; 
        }  
      });

      $scope.AEvents = function() {
        EventPlannerService.AEvents().then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VHome') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};
      $scope.AEvents1 = function(requestedEvent) {
        EventPlannerService.AEvents({"requestedEvent":((typeof requestedEvent === 'object')?JSON.stringify(requestedEvent):requestedEvent)}).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VHome') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};

        $scope.AUsers2 = function() {
        EventPlannerService.AUsers().then(function (object) {
          var msg = object.data["msg"];
          var users = object.data["users"];
          if (users) flash(users)
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VHome') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};
        $scope.NewEvent = function() {
            $location.path('/events/new');
          };

    }]);
EventPlannerModule.controller('VListEventsController', 
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
        $location.path('/event/new');
      };

      $scope.VHome1 = function() {
        $location.path('/VHome');
      };
      $scope.VShowEvent2 = function(eventId) {
        $location.path('/VShowEvent/'+eventId);
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
EventPlannerModule.controller('VShowEventController', 
        ['$scope', '$location', '$route', 'flash', '$routeParams', 'EventPlannerService',
    function ($scope, $location, $route, flash, $routeParams, EventPlannerService) {
      $scope.msg = '';
      EventPlannerService.VShowEvent({"eventId":$routeParams.eventId}).then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }
      });
      $scope.VListEvents0 = function() {
        $location.path('/VListEvents');
      };
      $scope.AReserveEvent1 = function() {
        EventPlannerService.AReserveEvent().then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VShowEvent') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};
      $scope.AUsers2 = function() {
        EventPlannerService.AUsers().then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VShowEvent') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};
      $scope.AGenerateCredentials3 = function() {
        EventPlannerService.AGenerateCredentials().then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VShowEvent') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};
      $scope.AGenerateCertificate4 = function() {
        EventPlannerService.AGenerateCertificate().then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VShowEvent') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};
      $scope.VShowEvent5 = function(eventId) {
        $location.path('/VShowEvent/'+eventId);
      };

    }]);
EventPlannerModule.controller('VEditEventController', 
        ['$scope', '$location', '$route', 'flash', 'EventPlannerService',
    function ($scope, $location, $route, flash, EventPlannerService) {
      $scope.msg = '';
      $scope.fEvent = {};

      EventPlannerService.VEditEvent().then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }
      });
      $scope.VShowEvent0 = function(eventId) {
        $location.path('/VShowEvent/'+eventId);
      };

      $scope.fEventSubmitted = false;
      $scope.AEditEvent1 = function(isValid) {
        $scope.fEventSubmitted = true;
        if (isValid) {
          EventPlannerService.AEditEvent($scope.fEvent).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              var label = object.data["label"];
              if (label == '/VEditEvent') {
                  $route.reload();
              } else {
                  $location.path(label);
              }
          });
        }
      };

    }]);
EventPlannerModule.controller('VRegisterEventController', 
        ['$scope', '$location', '$route', 'flash', 'EventPlannerService',
    function ($scope, $location, $route, flash, EventPlannerService) {
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
        $location.path('/VListEvents');
      };

      $scope.fEventSubmitted = false;
      $scope.ACreateEvent0 = function(isValid) {
        $scope.fEventSubmitted = true;
        if (isValid) {
          EventPlannerService.ACreateEvent($scope.fEvent).then(function (object) {
              var msg = object.data["msg"];
              if (msg) flash(msg);
              var label = object.data["label"];
              if (label == '/VRegisterEvent') {
                  $route.reload();
              } else {
                  $location.path(label);
              }
          });
        }
      };

    }]);
EventPlannerModule.controller('VCredentialController', 
        ['$scope', '$location', '$route', 'flash', 'EventPlannerService',
    function ($scope, $location, $route, flash, EventPlannerService) {
      $scope.msg = '';
      EventPlannerService.VCredential().then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }
      });
      $scope.VShowEvent0 = function(eventId) {
        $location.path('/VShowEvent/'+eventId);
      };

    }]);
EventPlannerModule.controller('VCertificateController', 
        ['$scope', '$location', '$route', 'flash', 'EventPlannerService',
    function ($scope, $location, $route, flash, EventPlannerService) {
      $scope.msg = '';
      EventPlannerService.VCertificate().then(function (object) {
        $scope.res = object.data;
        for (var key in object.data) {
            $scope[key] = object.data[key];
        }
        if ($scope.logout) {
            $location.path('/');
        }
      });
      $scope.VShowEvent0 = function(eventId) {
        $location.path('/VShowEvent/'+eventId);
      };

    }]);
