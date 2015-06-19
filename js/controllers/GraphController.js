myApp.controller("GraphController", ['$scope', '$routeParams' ,'StonesService',
	function($scope, $routeParams, StonesService) {

		$scope.name = "Graph";
		$scope.currentStone = {};
		$scope.stones = [];

		StonesService.get().then(function(data) {
			$scope.len = data.length;
			$scope.stones = data;
			angular.forEach(data, function(value) {
				if (value.museum_id === parseInt($routeParams.stone)) {
					$scope.currentStone = value;
				}
			});
			console.log($routeParams);
		}); 
	}
]);