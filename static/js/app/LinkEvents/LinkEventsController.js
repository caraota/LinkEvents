LinkEventsModule.config(function ($routeProvider) {
    $routeProvider.when('/VPrincipal', {
                controller: 'VPrincipalController',
                templateUrl: 'app/LinkEvents/VPrincipal.html'
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

        $scope.VEvento = function(eventid) {
          $location.path('/VEvento/'+eventid);
        };
    }]);
