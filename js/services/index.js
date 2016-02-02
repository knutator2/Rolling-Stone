'use strict';

require( 'angular-resource' );

// var app = require( 'angular' ).module( 'Rapakiwi' );
// app.service( 'StonesService', require('./stoneParsingService.js'));

var StoneDataService = require( 'angular' ).module( 'StoneDataService', ['ngResource'] );

// app.controller( 'DetailController', require('./DetailController.js' ));
// app.controller( 'GraphController', require('./GraphController.js' ));

StoneDataService.factory( 'StoneParsingService', require('./stoneParsingService.js'));//['$resource', '$http', function($resource, $http));
StoneDataService.factory( 'StoneEpocheService', require('./stoneEpocheService.js'));

// var service = angular.module('stoneparsingservice', ['ngResource']);
//
// // Split given coordinate and parse it into leaflet specific format
// function parseCoordinateString(raw_coordinates) {
//         var coordinates = raw_coordinates.split(',');
//         return L.latLng(coordinates[0], coordinates[1]);
// }
