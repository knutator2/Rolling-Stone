angular.module("RollingStone", [])
   .controller("MapController", function($scope) {
      $scope.name = "AngularJS";
      $scope.init = function() {
      	alert('hello world');
      };
    });