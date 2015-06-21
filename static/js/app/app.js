// Creación del módulo de la aplicación
var LinkEventsModule = angular.module('LinkEvents', ['ngRoute', 'ngAnimate', 'flash']);

// Routing
LinkEventsModule.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'LoginUserController',
            templateUrl: 'app/LinkEvents/user/login.html'
        });
});

LinkEventsModule.controller('LinkEventsController_',  ['$scope', '$http', '$location',
function($scope) {
    $scope.title = "Reserva de Eventos";
}]);

LinkEventsModule.directive('file', function () {
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
