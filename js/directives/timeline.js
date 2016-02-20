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

            // Functionality for moving the handles
            var $currentHandle,
                $opposingHandle,
                initialPosX,
                $selectorBar = $( '.timeline__selector-bar' );

            var initHandles = function() {
                $( '.timeline__selector-handle' ).data( 'pos-x', 0 );
            }

            var initHandleMovement = function( event ) {
                event.stopPropagation();
                event.preventDefault();

                var clientX = ( event.type === 'touchstart' )
                    ? event.originalEvent.touches[0].clientX
                    : event.clientX;
                var $handle = $( event.target );
                $handle.data( 'isMoving', true );
                $currentHandle = $handle;
                $opposingHandle = $handle.siblings( '.timeline__selector-handle' );
                initialOffsetX = ( $currentHandle.data( 'pos-x' ) )
                                ? $currentHandle.data( 'pos-x' )
                                : 0;
                initialPosX = clientX - initialOffsetX;
            }

            var moveHandle = function( event ) {
                if ( $currentHandle ) {
                    event.stopPropagation();
                    event.preventDefault();

                    var clientX = ( event.type === 'touchmove' )
                        ? event.originalEvent.touches[0].clientX
                        : event.clientX;
                    var handlePosition = $currentHandle.data( 'position' );
                    var offsetX = clientX - initialPosX;

                    offsetX = checkSelectionBarBoundaries( offsetX, handlePosition );
                    offsetX = checkOpposingHandle( offsetX, handlePosition );

                    $currentHandle
                        .css( 'transform', 'translate3d(' + offsetX + 'px, 0, 0)' );
                    $currentHandle.data( 'pos-x', offsetX );
                    updateHandleLink();
                } else {
                    return;
                }
            }

            var stopHandleMovement = function( event ) {
                if ( $currentHandle ) {
                    var currentHandlePosition = $currentHandle.data( 'position' );
                    var clientX = ( event.type === 'touchend' )
                        ? event.originalEvent.changedTouches[0].clientX
                        : event.clientX;
                    var newPosX = getHandleSnapPosition( clientX, currentHandlePosition );

                    newPosX = checkSelectionBarBoundaries( newPosX, currentHandlePosition )
                    newPosX = checkOpposingHandle( newPosX, currentHandlePosition );

                    $currentHandle
                        .css( 'transform', 'translate3d(' + newPosX + 'px, 0, 0)' );
                    $currentHandle.data( 'pos-x', newPosX );

                    if ( currentHandlePosition === 'left' ) {
                        scope.$apply( function() {
                            scope.timelineIndexes.start = calculateSelectionIndex( newPosX, currentHandlePosition );
                        });
                    } else if ( currentHandlePosition === 'right' ) {
                        scope.$apply( function() {
                            scope.timelineIndexes.end = calculateSelectionIndex( newPosX, currentHandlePosition );
                        });
                    }

                    updateHandleLink();

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
                    return snapPosition;
                } else if ( position === 'right' ) {
                    return snapPosition - barWidth;
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
                    if ( offsetX > barWidth + opposedPosX ) { // opposedPosX is negative!
                        return offsetX + (barWidth + opposedPosX - offsetX);
                    }
                } else if ( handlePosition === 'right' ) {
                    if ( opposedPosX > barWidth + offsetX ) { // offsetX is negative!
                        return offsetX + (opposedPosX) - (barWidth + offsetX);
                    }
                }

                return offsetX;
            }

            var calculateSelectionIndex = function( offsetX, handlePosition ) {
                var barWidth = $selectorBar.width(),
                    barSegmentOffset = barWidth / (scope.eraData.length - 1);

                if ( handlePosition === 'left' ) {
                    return Math.round( offsetX / barSegmentOffset );
                } else if ( handlePosition === 'right' ) {
                    return Math.round( (barWidth + offsetX) / barSegmentOffset ); //offsetX is negative!
                }
            }

            var updateHandleLink = function() {
                var $leftHandle = $( '.timeline__selector-handle--left' ),
                    $rightHandle = $( '.timeline__selector-handle--right' ),
                    $handleLink = $( '.timeline__selector-handle-link' ),
                    newWidth;

                newWidth = $rightHandle.offset().left - $leftHandle.offset().left;
                $handleLink.css( 'width', newWidth + 'px' );
            }

            var initHandleLink = function() {
                var $handleLink = $( '.timeline__selector-handle-link' ),
                    barWidth = $selectorBar.width();

                $handleLink.css( 'width', barWidth + 'px' );
            }

            //TODO: handle resizing of the window


            // Initialising the timeline
            loadEraData();
            initHandles();
            initHandleLink();

            $( '.timeline__selector-handle' ).on( 'mousedown touchstart', initHandleMovement );
            $( window ).on( 'mousemove touchmove', moveHandle )
            $( window ).on( 'mouseup touchend', stopHandleMovement );
        }
    };
}

module.exports = timeline;
