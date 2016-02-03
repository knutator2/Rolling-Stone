/**
 * Starting Point for the Angular application
 */

'use strict';

require( 'angular' );
require( 'angular-route' );
require( 'angular-animate' );
require( 'angular-simple-logger' );
require( 'angular-leaflet-directive' );

var app = angular.module('Rapakiwi', ['StoneDataService', 'ngRoute', 'ngAnimate', 'leaflet-directive']);

// Routing
app.config( function($routeProvider) {
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
