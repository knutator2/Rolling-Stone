myApp.controller("GraphController", ['$scope', '$routeParams' ,'StonesService',
	function($scope, $routeParams, StonesService) {

		$scope.name = "Graph";
		$scope.currentStone = {};
		$scope.stones = [];

		$scope.closeDetailPage = function(event) {
            window.history.back();
        };

		StonesService.get().then(function(data) {
			$scope.len = data.length;
			$scope.stones = data;
			angular.forEach(data, function(value) {
				if (value.museum_id == parseInt($routeParams.stone)) {
					$scope.currentStone = value;
				}
			});
			// var qwertz = StonesService.getStoneById(parseInt($routeParams.stoneId,10));

   //      	qwertz.then(function(response) {
   //          	$scope.currentStone = response;
   //      	});
			console.log($routeParams);
		}); 
	}
]);