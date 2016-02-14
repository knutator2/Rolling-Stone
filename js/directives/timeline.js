var $ = require( 'jquery' );
var _ = require( 'underscore' );

var timeline = function( StoneDataService, StoneEraService ) {
    return {
        restrict: 'E',
        scope : {
            timelineIndexes: '='
        },
        replace: true,
        templateUrl: 'js/directives/timeline.html',
        link: function (scope, element, attrs) {

            // dummy timeline selection
            $( '.timeline' ).on( 'click', function() {
                scope.$apply( function() {
                    scope.timelineIndexes.start = Math.floor( Math.random() * 5);
                    scope.timelineIndexes.end = Math.floor( Math.random() * 5 + 5);
                });
            })
        }
    };
}

module.exports = timeline;
