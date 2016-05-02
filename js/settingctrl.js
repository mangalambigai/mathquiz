angular.module('mathApp')
.controller('SettingsCtrl', ['$location', 'settings', function($location, settings){
    this.operationList = settings.operationList;
    this.questionCount = settings.questionCount;

    this.save = function() {
        settings.operationList = this.operationList;
        settings.questionCount = this.questionCount;
        $location.path('#/home');

    };
}]);