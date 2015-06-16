myApp.controller("GraphController", ['$scope', '$routeParams' ,'StonesService',
	function($scope, $routeParams, StonesService) {

		$scope.name = "Graph";

		StonesService.get().then(function(data) {
			$scope.len = data.length;
			console.log($routeParams);
		}); 
	}
]);