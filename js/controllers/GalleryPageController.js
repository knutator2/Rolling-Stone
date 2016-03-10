var $ = require( 'jquery' );
var _ = require( 'underscore' );

var GalleryPageController = function( $scope, $http, StoneDataService, StoneEraService ) {

    // Properties
    $scope.overlayLeftIsActive = false;
    $scope.overlayBottomIsActive = true;
    $scope.stoneData = undefined;
    $scope.timelineIndexes = { start: undefined, end: undefined };
    $scope.orderByMaterial = true;

    // UI Elements
    $scope.UiHeader = $( 'header' );

    // Event Handlers
    $scope.selectItem = function( $event, item ) {
        $event.stopPropagation();

        $scope.currentItem = item;
        $scope.overlayLeftIsActive = true;
        $scope.UiHeader.addClass( 'header--compressed' );
    };

    $scope.dismissSelection = function() {
        $scope.overlayLeftIsActive = false;
        $scope.UiHeader.removeClass( 'header--compressed' );
    };

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
}

module.exports = GalleryPageController;
