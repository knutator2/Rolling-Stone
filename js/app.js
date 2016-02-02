/**
 * Starting Point for the Angular application
 */

'use strict';

console.log( 'start init point' );

require( 'angular' );
require( 'angular-route' );
require( 'angular-animate' );
// require( 'leaflet' );
require( 'angular-simple-logger' );
require( 'angular-leaflet-directive' );
//var DetailController = require( './controllers/DetailController' );

// var myApp = angular.module('RollingStone', ['leaflet-directive', 'stoneparsingservice', 'epocheservice', 'ngRoute', 'ngAnimate']);
var app = angular.module('Rapakiwi', ['StoneDataService', 'ngRoute', 'ngAnimate', 'leaflet-directive']);

// Routing
app.config(
    function($routeProvider) {

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

// require services
require( './services' );

// require directives
require( './directives' );

// require controllers
require( './controllers' );
console.log( 'done init' );
// app.controller('DetailController', ['$scope', '$routeParams', DetailController]);
