myApp.controller("GraphController", ['$scope', '$routeParams' ,'StonesService',
	function($scope, $routeParams, StonesService) {

		$scope.name = "Graph";
		$scope.currentStone = {};

		StonesService.get().then(function(data) {
			$scope.len = data.length;
			angular.forEach(data, function(value) {
				if (value.museum_id === parseInt($routeParams.stone)) {
					$scope.currentStone = value;
				}
			});
			console.log($routeParams);
		}); 
	}
]);