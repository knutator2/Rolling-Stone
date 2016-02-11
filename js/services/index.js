'use strict';

require( 'angular-resource' );

var StoneService = require( 'angular' ).module( 'StoneService', ['ngResource'] );

StoneService.factory( 'StoneDataService', require('./stoneDataService.js'));
StoneService.factory( 'StoneEpocheService', require('./stoneEpocheService.js'));
