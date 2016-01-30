/**
 * Starting Point for the Angular application
 */

'use strict';

require( 'angular' );
require( 'angular-route' );
require( 'angular-animate' );
var DetailController = require( './controllers/DetailController' );

// var myApp = angular.module('RollingStone', ['leaflet-directive', 'stoneparsingservice', 'epocheservice', 'ngRoute', 'ngAnimate']);
var app = angular.module('Rapakiwi', ['ngRoute', 'ngAnimate']);

app.config(
    function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'js/views/detail.html',
            controller: 'DetailController'
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

app.controller('DetailController', ['$scope', '$routeParams', DetailController]);
