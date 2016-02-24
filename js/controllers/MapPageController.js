require( 'angular' );
require( 'leaflet' );
require( 'leaflet-easybutton' );
var $ = require( 'jquery' );
var _ = require( 'underscore' );

var MapPageController = function( $scope, $http, $q, StoneDataService, StoneEraService, leafletData ) {

    // Properties
    $scope.overlayLeftIsActive = false;
    $scope.overlayBottomIsActive = true;
    $scope.selectorIsActive = false;
    $scope.selectorItems = {};
    $scope.currentItem = {};
    $scope.$currentPinElement;
    $scope.name = "Map";
    $scope.stoneDataOrigin = {};
    $scope.stoneDataDestination = {};
    $scope.timelineIndexes = { start: undefined, end: undefined };

    // UI Elements
    $scope.UiHeader = $( 'header' );
    $scope.UiOverlayBottomHandler = $( '.page__part--off-canvas-bottom-handle' );

    // Event Handlers
    $scope.dismissSelection = function( event ) {
        $scope.overlayLeftIsActive = false;
        $scope.selectorIsActive = false;
        $scope.UiHeader.removeClass( 'compressed' );
    };

    $scope.toggleOverlayBottom = function() {
        $scope.overlayBottomIsActive = !$scope.overlayBottomIsActive;
    };

    // Controller Functions
    $scope.updatePins = function( originData, destinationData ) {
        var newPins = [];

        angular.forEach( destinationData, function( item ) {
            newPins.push( $scope.createPin( item, 'destination' ) );
        });
        angular.forEach( originData, function( item ) {
            newPins.push( $scope.createPin( item, 'origin' ) );
        });

        $scope.pins = [];

        var removeWatchListener = $scope.$watch( 'pins', function( newValue, oldValue ) {
            $scope.pins = newPins;
            removeWatchListener();
        });
    };

    $scope.createPin = function( data, type ) {
        var pin = {},
            coordinates,
            marker = {},
            iconUrl;

        // Type
        pin.type = type;

        // Coordinates
        if ( type === 'origin' ) {
            coordinates = data[0].origin_coordinate.split( ',' );
        } else if ( type === 'destination' ) {
            coordinates = data[0].coordinate.split( ',' );
        }
        pin = angular.merge( pin, L.latLng( coordinates[0], coordinates[1] ) );

        // Data for all stones
        pin.stones = data;

        // Icon
        if ( type === 'origin' ) {
            iconUrl = 'img/assets/Pin_Gestein Herkunft_ini.svg';
        } else if ( type === 'destination' ) {
            iconUrl = ( data.length > 1 )
                ? 'img/assets/Pin_Mehrere_Steine_ini.svg'
                : 'img/assets/Pin_Gestein Fundort_ini.svg';
        }
        marker.iconUrl = iconUrl;
        marker.iconRetinaUrl = iconUrl;
        marker.className = 'map__pin';
        pin.icon = marker;

        return pin;
    }

    $scope.getStoneDataFromService = function( filterStart, filterEnd ) {
        var stoneDataOrigin = StoneDataService.getAllStonesGroupedByOrigin( filterStart, filterEnd );
        var stoneDataDestination = StoneDataService.getAllStonesGroupedByDestination( filterStart, filterEnd );

        $q.all( [ stoneDataOrigin, stoneDataDestination ] )
            .then( function ( result ) {
                $scope.stoneDataOrigin = result[0];
                $scope.stoneDataDestination = result[1];
                $scope.updatePins( $scope.stoneDataOrigin, $scope.stoneDataDestination );
            }, function( reason ) {
                console.error( reason );
            });
    }


    // Setting up the map data
    angular.extend( $scope, {
        center: {
            lat: 52.886525,
            lng: 14.139851,
            zoom: 5
        },
        defaults: {
            scrollWheelZoom: false
        },
        events: {
            map: {
                enable: ['zoomstart', 'drag', 'click', 'mousemove'],
                logic: 'emit'
            }
        },
        pins: [],
        mapboxtiles: {
            url: "https://{s}.tiles.mapbox.com/v4/knutator.c8d1fddc/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia251dGF0b3IiLCJhIjoiRlEzWmFjUSJ9.JLn3oQ3FbbCsjtuxQCpFjQ",
            options: {
                attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"
            }
        }
    });

    // load stone data
    $scope.getStoneDataFromService();

    // load era metadata
    StoneEraService.getErasLength()
        .then( function( result ) {
            $scope.timelineIndexes = { start: 0,  end: result-1 };
        });

    // Add event handler for the pins
    $scope.$on( 'leafletDirectiveMarker.click', function(event, args) {

        // mark the new pin
        //TODO: Replace the dummy CSS style for the marked pin with something that works
        if ( $scope.$currentPinElement) $scope.$currentPinElement.removeClass( 'map__pin--active' );
        $scope.$currentPinElement = $( args.leafletObject._icon );
        $scope.$currentPinElement.addClass( 'map__pin--active' );

        // Provide layout and data for the detail overlay
        $scope.overlayLeftIsActive = true;
        $scope.selectorIsActive = true;

        $scope.currentItem = args.leafletObject.options.stones[0];
        $scope.UiHeader.addClass('compressed');

        if (args.leafletObject.options.stones.length > 1) {
            $scope.selectorItems = args.leafletObject.options.stones;
            $scope.selectorIsActive = true;
        } else {
            $scope.selectorIsActive = false;
        }
    });

    // watch timeline selector for changes
    $scope.$watch( 'timelineIndexes', function() {
        $scope.getStoneDataFromService( $scope.timelineIndexes.start, $scope.timelineIndexes.end);
    }, true );
}

module.exports = MapPageController;
