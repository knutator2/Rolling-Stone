var $ = require( 'jquery' );
var _ = require( 'underscore' );

var timeline = function( StoneEraService ) {
    return {
        restrict: 'E',
        scope : {
            timelineIndexes: '=',
            eraData: '@'
        },
        replace: true,
        templateUrl: 'js/directives/timeline.html',
        link: function (scope, element, attrs) {

            // load era date
            var loadEraData = function() {
                eraDataPromise = StoneEraService.getAllEras();

                eraDataPromise.then( function( result ) {
                    scope.eraData = result;
                });
            }

            // TODO: Move this dummy functionality to the handle functionality!!!
            // dummy timeline selection
            $( '.timeline' ).on( 'click', function() {
                scope.$apply( function() {
                    scope.timelineIndexes.start = Math.floor( Math.random() * 5);
                    scope.timelineIndexes.end = Math.floor( Math.random() * 5 + 5);
                });
            })

            // Functionality for moving the handles
            var $currentHandle,
                $opposingHandle,
                initialPosX,
                $selectorBar = $( '.timeline__selector-bar' );

            var initHandles = function() {
                $( '.timeline__selector-handle' ).data( 'pos-x', 0 );
            }

            var initHandleMovement = function( event ) {
                var $handle = $( event.target );
                $handle.data( 'isMoving', true );
                $currentHandle = $handle;
                $opposingHandle = $handle.siblings( '.timeline__selector-handle' );
                initialOffsetX = ( $currentHandle.data( 'pos-x' ) )
                                ? $currentHandle.data( 'pos-x' )
                                : 0;
                initialPosX = event.clientX - initialOffsetX;
            }

            var moveHandle = function( event ) {
                if ( $currentHandle ) {
                    var handlePosition = $currentHandle.data( 'position' );
                    var offsetX = event.clientX - initialPosX;

                    offsetX = checkSelectionBarBoundaries( offsetX, handlePosition );
                    offsetX = checkOpposingHandle( offsetX, handlePosition );

                    $currentHandle
                        .css( 'transform', 'translate3d(' + offsetX + 'px, 0, 0)' );
                    $currentHandle.data( 'pos-x', offsetX );
                } else {
                    return;
                }
            }

            var stopHandleMovement = function( event ) {
                if ( $currentHandle ) {
                    var currentHandlePosition = $currentHandle.data( 'position' );
                    var newPosX = getHandleSnapPosition( event.clientX, currentHandlePosition );

                    newPosX = checkSelectionBarBoundaries( newPosX, currentHandlePosition )
                    newPosX = checkOpposingHandle( newPosX, currentHandlePosition );

                    $currentHandle
                        .css( 'transform', 'translate3d(' + newPosX + 'px, 0, 0)' );
                    $currentHandle.data( 'pos-x', newPosX );
                    $currentHandle = undefined;
                    $opposingHandle = undefined;
                    initialPosX = undefined;
                } else {
                    return;
                }
            }

            var getHandleSnapPosition = function( posX, position ) {
                var snapPosition,
                    barWidth = $selectorBar.width(),
                    barSegmentWidth = barWidth / (scope.eraData.length - 1),
                    barPosX = posX - $selectorBar.offset().left;

                var diffUpperBoundary = barSegmentWidth - (barPosX % barSegmentWidth);
                var diffLowerBoundary = barPosX % barSegmentWidth;

                if ( diffUpperBoundary < diffLowerBoundary ) {
                    snapPosition = Math.floor( barPosX / barSegmentWidth ) * barSegmentWidth + barSegmentWidth;
                } else {
                    snapPosition = Math.floor( barPosX / barSegmentWidth ) * barSegmentWidth;
                }

                if ( position === 'left' ) {
                    return snapPosition - 12;
                } else if ( position === 'right' ) {
                    return snapPosition - barWidth + 12;
                }
            }

            var checkSelectionBarBoundaries = function( posX, position ) {
                var barWidth = $selectorBar.width();

                if ( position === 'left' ) {
                    posX = Math.max( 0, posX ); // left boundary
                    posX = Math.min( barWidth, posX ) // right boundary
                } else if ( position === 'right' ) {
                    posX = Math.max( -barWidth, posX );// left boundary
                    posX = Math.min( 0, posX ); // right boundary
                }
                return posX;
            }

            var checkOpposingHandle = function( offsetX, handlePosition ) {
                var barWidth = $selectorBar.width(),
                    opposedPosX = $opposingHandle.data( 'pos-x' );

                if ( handlePosition === 'left' ) {
                    if ( offsetX > barWidth + opposedPosX - 24) { // opposedPosX is negative!
                        return offsetX + (barWidth + opposedPosX - 24 - offsetX);
                    }
                } else if ( handlePosition === 'right' ) {
                    if ( opposedPosX + 24 > barWidth + offsetX ) { // offsetX is negative!
                        return offsetX + (opposedPosX + 24) - (barWidth + offsetX);
                    }
                }

                return offsetX;
            }

            //TODO: handle resizing of the window


            // Initialising the timeline
            loadEraData();
            initHandles();

            $( '.timeline__selector-handle' ).on( 'mousedown', initHandleMovement );
            $( window ).on( 'mousemove', moveHandle )
            $( window ).on( 'mouseup', stopHandleMovement );
        }
    };
}

module.exports = timeline;
