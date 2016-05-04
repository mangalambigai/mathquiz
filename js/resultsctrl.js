angular.module('mathApp')
.controller('ResultsCtrl', function ($scope, $uibModalInstance, items) {
  this.correct = items[0];
  this.count = items[1];
  this.review = items[2];

  $scope.redo = function () {
    $uibModalInstance.close(true);
  };

  $scope.home = function () {
    $uibModalInstance.close(false);
  };
});