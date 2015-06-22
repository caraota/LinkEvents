LinkEventsModule.config(function ($routeProvider) {
    $routeProvider.when('/VPrincipal', {
                controller: 'VPrincipalController',
                templateUrl: 'app/LinkEvents/VPrincipal.html'
            }).when('/VListEvents', {
                controller: 'VListEventsController',
                templateUrl: 'app/LinkEvents/VListEvents.html'
            }).when('/VEditEvent', {
                controller: 'VEditEventController',
                templateUrl: 'app/LinkEvents/VEditEvent.html'
            }).when('/VListUsers/:requestedUser', {
                controller: 'VListUsersController',
                templateUrl: 'app/LinkEvents/VListUsers.html'
            }).when('/VCredential', {
                controller: 'VCredentialController',
                templateUrl: 'app/LinkEvents/VCredential.html'
            }).when('/VCertificate', {
                controller: 'VCertificateController',
                templateUrl: 'app/LinkEvents/VCertificate.html'
            });
});

LinkEventsModule.controller('VPrincipalController', 
        ['$scope', '$location', '$route', 'flash', 'LinkEventsService',
    function ($scope, $location, $route, flash, LinkEventsService) {
      $scope.msg = '';
      LinkEventsService.VPrincipal().then(function (object) {
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
        LinkEventsService.AEvents().then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VPrincipal') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};
      $scope.AEvents1 = function(requestedEvent) {
        LinkEventsService.AEvents({"requestedEvent":((typeof requestedEvent === 'object')?JSON.stringify(requestedEvent):requestedEvent)}).then(function (object) {
          var msg = object.data["msg"];
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VPrincipal') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};

        $scope.AUsers2 = function() {
        LinkEventsService.AUsers().then(function (object) {
          var msg = object.data["msg"];
          var users = object.data["users"];
          if (users) flash(users)
          if (msg) flash(msg);
          var label = object.data["label"];
          if (label == '/VPrincipal') {
              $route.reload();
          } else {
              $location.path(label);
          }
        });};
        $scope.VCrearEvento = function() {
            $location.path('/VCrearEvento');
          };

    }]);
LinkEventsModule.controller('VListEventsController', 
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
        $location.path('/event/new');
      };

      $scope.VPrincipal1 = function() {
        $location.path('/VPrincipal');
      };
      $scope.VShowEvent2 = function(eventId) {
        $location.path('/VShowEvent/'+eventId);
      };
      $scope.ADeleteEvent3 = function() {
        LinkEventsService.ADeleteEvent().then(function (object) {
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
LinkEventsModule.controller('VEditEventController', 
        ['$scope', '$location', '$route', 'flash', 'LinkEventsService',
    function ($scope, $location, $route, flash, LinkEventsService) {
      $scope.msg = '';
      $scope.fEvent = {};

      LinkEventsService.VEditEvent().then(function (object) {
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
          LinkEventsService.AEditEvent($scope.fEvent).then(function (object) {
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
LinkEventsModule.controller('VCredentialController', 
        ['$scope', '$location', '$route', 'flash', 'LinkEventsService',
    function ($scope, $location, $route, flash, LinkEventsService) {
      $scope.msg = '';
      LinkEventsService.VCredential().then(function (object) {
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
LinkEventsModule.controller('VCertificateController', 
        ['$scope', '$location', '$route', 'flash', 'LinkEventsService',
    function ($scope, $location, $route, flash, LinkEventsService) {
      $scope.msg = '';
      LinkEventsService.VCertificate().then(function (object) {
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
