'use strict';

require( 'angular-resource' );

var app = require( 'angular' ).module( 'Rapakiwi' );

app.directive('stonegraph', require( './stoneGraph.js' ));
app.directive('detailoverlay', require( './detailOverlay.js' ));
app.directive('detailselector', require( './detailSelector.js' ));
app.directive('stonetimeline', require( './stoneTimeline.js' ));
