LinkEventsModule.config(function ($routeProvider) {
    $routeProvider.when('/VPrincipal', {
                controller: 'VPrincipalController',
                templateUrl: 'app/LinkEvents/VPrincipal.html'
            }).when('/VShowEvent/:eventId', {
                controller: 'VShowEventController',
                templateUrl: 'app/LinkEvents/VShowEvent.html'
            }).when('/VEditEvent', {
                controller: 'VEditEventController',
                templateUrl: 'app/LinkEvents/VEditEvent.html'
            }).when('/VRegisterEvent', {
                controller: 'VRegisterEventController',
                templateUrl: 'app/LinkEvents/VRegisterEvent.html'
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
        
        $scope.VCrearEvento = function() {
            $location.path('/VCrearEvento');
          };

        $scope.AEliminarEvento2 = function(eventid) {
          LinkEventsService.AEliminarEvento({"eventId" : eventid}).then(function (object) {
            console.log('Hola')
            var msg = object.data["msg"];
            if (msg) flash(msg);
            var label = object.data["label"];
            if (label == '/VPrincipal') {
                $route.reload();
            } else {
                $location.path(label);
                $route.reload();
            }
          });};
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
    }]);
LinkEventsModule.controller('VShowEventController', 
        ['$scope', '$location', '$route', 'flash', '$routeParams', 'LinkEventsService',
    function ($scope, $location, $route, flash, $routeParams, LinkEventsService) {
      $scope.msg = '';
      LinkEventsService.VShowEvent({"eventId":$routeParams.eventId}).then(function (object) {
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
        LinkEventsService.AReserveEvent().then(function (object) {
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
        LinkEventsService.AUsers().then(function (object) {
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
        LinkEventsService.AGenerateCredentials().then(function (object) {
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
        LinkEventsService.AGenerateCertificate().then(function (object) {
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
LinkEventsModule.controller('VRegisterEventController', 
        ['$scope', '$location', '$route', 'flash', 'LinkEventsService',
    function ($scope, $location, $route, flash, LinkEventsService) {
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
        $location.path('/VListEvents');
      };

      $scope.fEventSubmitted = false;
      $scope.ACreateEvent0 = function(isValid) {
        $scope.fEventSubmitted = true;
        if (isValid) {
          LinkEventsService.ACreateEvent($scope.fEvent).then(function (object) {
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
