'use strict';

require( 'angular-resource' );

var app = require( 'angular' ).module( 'Rapakiwi' );

app.directive('stonegraph', require( './stoneGraph.js' ));
app.directive('detailoverlay', require( './detailOverlay.js' ));
app.directive('stoneselector', require( './stoneSelector.js' ));
app.directive('stonetimeline', require( './stoneTimeline.js' ));
