var $ = require( 'jquery' );
var _ = require( 'underscore' );

var GalleryPageController = function( $scope, $http, $timeout, StoneDataService, StoneEraService ) {

    // Properties
    $scope.overlayLeftIsActive = false;
    $scope.overlayBottomIsActive = true;
    $scope.stoneData = undefined;
    $scope.timelineIndexes = { start: undefined, end: undefined };
    $scope.orderByMaterial = true;

    // UI Elements
    $scope.$UiHeader = $( 'header' );
    $scope.$gallery = $( '.gallery' );

    // Event Handlers
    $scope.selectItem = function( $event, item ) {
        $event.stopPropagation();

        $scope.currentItem = item;
        $scope.overlayLeftIsActive = true;
    };

    $scope.dismissSelection = function() {
        $scope.overlayLeftIsActive = false;
    };

    $scope.toggleGalleryOrder = function() {
        $scope.orderByMaterial = !$scope.orderByMaterial;
        $scope.getStoneData( $scope.timelineIndexes.start, $scope.timelineIndexes.end );
    }

    // load stone data
    $scope.getStoneData = function( filterStart, filterEnd ) {
        var stoneDataPromise;

        if ( $scope.orderByMaterial ) {
            stoneDataPromise = StoneDataService.getAllStonesGroupedByMaterial( filterStart, filterEnd );
        }
        else {
            stoneDataPromise = StoneDataService.getAllStonesGroupedByEra( filterStart, filterEnd );
        }

        stoneDataPromise.then( function( result ) {
            _.each( result, function( group ) {
                var headlineItem = {};

                headlineItem.type = 'sectionHeadline';
                headlineItem.headline = ( $scope.orderByMaterial ) ? group[0].material : group[0].geological_era ;

                group.unshift( headlineItem );
            });

            var concatenatedArray = result.reduce( function(a, b) {
                return a.concat(b);
            }, []);

            $scope.stoneData = concatenatedArray;
        });
    };

    $scope.getStoneData();

    // load era metadata
    StoneEraService.getErasLength()
        .then( function( result ) {
            $scope.timelineIndexes = { start: 0,  end: result-1 };
        });

    // watch timeline selector for changes
    $scope.$watch( 'timelineIndexes', function() {
        $scope.getStoneData( $scope.timelineIndexes.start, $scope.timelineIndexes.end );
    }, true );

    $timeout( function () {
        $scope.$UiHeader.addClass( 'header--compressed' );
    }, 1000);

    // hide gallery items that are not on screen for performance enhancement
    $scope.$gallery.on( 'scroll.gallery', function( event ) {
        var currentViewportLeft = event.target.scrollLeft,
            currentViewportRight = currentViewportLeft + window.innerWidth,
            galleryItems = document.querySelectorAll( '.gallery__item' ),
            itemWidth = galleryItems[1].offsetWidth;

        _.forEach( galleryItems, function( element ) {
            if ( (element.offsetLeft + itemWidth) < currentViewportLeft || element.offsetLeft > currentViewportRight ) {
                 $( element ).addClass( 'gallery__item--hidden' );
            }
            else {
                $( element ).removeClass( 'gallery__item--hidden' );
            }
        });
    });
}

module.exports = GalleryPageController;
