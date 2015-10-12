/**
 * Starting Point for the Angular application
 */

var myApp = angular.module('RollingStone', ['leaflet-directive', 'stoneparsingservice', 'epocheservice', 'ngRoute', 'ngAnimate']);

myApp.config(function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'js/views/map.html',
            controller: 'MapController'
        })
        .when('/map', {
            templateUrl: 'js/views/map.html',
            controller: 'MapController'
        })
        .when('/graph', {
            templateUrl: 'js/views/graph.html',
            controller: 'GraphController'
        })
        .when('/detail', {
            templateUrl: 'js/views/detail.html',
            controller: 'DetailController'
        });
});