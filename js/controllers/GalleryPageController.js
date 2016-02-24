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
    var loadStoneData = function() {
        var allStonesPromise = StoneDataService.getAllStones();

        allStonesPromise.then( function( result ) {
            $scope.stoneData = result;
        });
    };

    loadStoneData();

    // load era metadata
    StoneEraService.getErasLength()
        .then( function( result ) {
            $scope.timelineIndexes = { start: 0,  end: result-1 };
        });
}

module.exports = GalleryPageController;
