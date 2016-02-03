'use strict';

require( 'angular-resource' );

var StoneDataService = require( 'angular' ).module( 'StoneDataService', ['ngResource'] );

StoneDataService.factory( 'StoneParsingService', require('./stoneParsingService.js'));
StoneDataService.factory( 'StoneEpocheService', require('./stoneEpocheService.js'));
