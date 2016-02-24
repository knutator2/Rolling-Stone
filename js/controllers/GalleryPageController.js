var $ = require( 'jquery' );

var GalleryPageController = function( $scope, $http, StoneDataService, StoneEraService ) {

    // Properties
    $scope.overlayLeftIsActive = false;
    $scope.overlayBottomIsActive = true;
    $scope.stoneData = undefined;
    $scope.timelineIndexes = { start: undefined, end: undefined };

    // UI Elements
    $scope.UiHeader = $( 'header' );

    // Event Handlers
    $scope.selectItem = function( $event, item ) {
        $event.stopPropagation();

        $scope.currentItem = item;
        $scope.overlayLeftIsActive = true;
        $scope.UiHeader.addClass( 'compressed' );
    };

    $scope.dismissSelection = function() {
        $scope.overlayLeftIsActive = false;
        $scope.UiHeader.removeClass( 'compressed' );
    };

    // load stone data
    $scope.getStoneData = function( filterStart, filterEnd ) {
        var allStonesPromise = StoneDataService.getAllStones( filterStart, filterEnd );

        allStonesPromise.then( function( result ) {
            $scope.stoneData = result;
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
