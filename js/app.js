angular.module('mathApp', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/quiz', {
        templateUrl: 'partials/quiz.html',
        controller: 'QuizCtrl',
        controllerAs: 'quiz'
    })
    .when('/settings', {
        templateUrl: 'partials/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings'
    })
    .when('/home', {
        templateUrl: 'partials/home.html'
    })
    .otherwise({
        redirectTo: '/home'
    });
}]);
