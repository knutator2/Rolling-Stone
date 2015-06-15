var myApp = angular.module('RollingStone', ['leaflet-directive', 'stoneparsingservice', 'ngRoute', 'ngAnimate']);

myApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'map.html',
			controller: 'MapController'
		})
		.when('/map', {
			templateUrl: 'map.html',
			controller: 'MapController'
		})
		.when('/graph', {
			templateUrl: 'graph.html',
			controller: 'GraphController'
		});
});