// myApp.controller("GraphController", ['$scope', '$routeParams' ,'StonesService',
var GraphController = function( $scope, $routeParams, StoneParsingService ) {

		console.log( StoneParsingService );

		$scope.name = 'test name';
		$scope.currentStone = {};
		$scope.stones = [];




		// StonesService.get().then(function(data) {
		// 	$scope.len = data.length;
		// 	$scope.stones = data;
		// 	angular.forEach(data, function(value) {
		// 		if (value.museum_id === parseInt($routeParams.stone)) {
		// 			$scope.currentStone = value;
		// 		}
		// 	});
		// 	console.log($routeParams);
		// });
}

module.exports = GraphController;
