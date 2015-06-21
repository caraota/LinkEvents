// Creación del módulo de la aplicación
var EventPlannerModule = angular.module('EventPlanner', 
                                        ['ngRoute', 'ngAnimate', 'flash']);

// Routing
EventPlannerModule.config(function ($routeProvider) {
    $routeProvider
    .when('/', { // Root
        controller: 'LoginUserController',
        templateUrl: 'app/EventPlanner/user/login.html'
    });
});

// General controller
EventPlannerModule.controller('EventPlannerController_',  ['$scope', '$http', '$location',
        function($scope) {
            $scope.title = "DiseñoAplicaciónEventos";
        }]);

EventPlannerModule.directive('file', function () {
    return {
        restrict: 'A',
    scope: {
        file: '='
    },
    link: function (scope, el, attrs) {
        el.bind('change', function (event) {
            var file = event.target.files[0];
            scope.file = file ? file : undefined;
            scope.$apply();
        });
    }
    };
});
