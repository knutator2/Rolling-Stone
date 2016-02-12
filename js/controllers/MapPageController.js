// myApp.controller("MapController", ['$scope', '$http', '$timeout', 'StonesService', 'leafletData',

require( 'angular' );
require( 'leaflet-easybutton' );
var $ = require( 'jquery' );
var _ = require( 'underscore' );

var MapController = function( $scope, $http, $timeout, $q, StoneDataService, leafletData ) {

    // Properties
    $scope.overlayLeftIsActive = false;
    $scope.overlayBottomIsActive = true;
    $scope.selectorIsActive = false;
    $scope.selectorItems = {};
    $scope.currentItem = {};
    $scope.name = "Map";
    $scope.stoneDataOrigin = {};
    $scope.stoneDataDestination = {};

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
        console.log( originData );
        console.log( destinationData );

        //TODO: Create all pin objects (remove this from the stoneDataService)

        //TODO: After creating all the pins, set them to $scope.pins

        //TODO: ?

        //TODO: Profit!
    };

    $scope.getStoneDataFromService = function( ) {
        var stoneDataOrigin = StoneDataService.getAllStonesGroupedByOrigin();
        var stoneDataDestination = StoneDataService.getAllStonesGroupedByDestination();

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
        pins: {},
        mapboxtiles: {
            url: "https://{s}.tiles.mapbox.com/v4/knutator.c8d1fddc/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia251dGF0b3IiLCJhIjoiRlEzWmFjUSJ9.JLn3oQ3FbbCsjtuxQCpFjQ",
            options: {
                attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"
            }
        }
    });

    $scope.getStoneDataFromService();




    // TODO: Remove garbage from below here!
    var pins = StoneDataService.getPins();
  //console.log(pins);
  pins.then(function(response) {
        //add pins to map
    //console.log(response);

    $scope.pins = response;

    // $scope.filteredPins = response.slice();
    // $scope.$watch("filteredPins", function (newValue, oldValue) {
    //   console.log("markers did change");
    //   console.log(newValue);
    //   $scope.pins = newValue;
    // });
    //angular.forEach(response, function(el) {
      // var coordinates = parseCoordinateString(el.coordinate);
      // var origin_coordinates = parseCoordinateString(el.origin_coordinate);
      // var marker = addMarkerForType("found_coordinate", coordinates);
      // marker.bindPopup("<b>" + el.title + "</b><br />" +
      //    "Distanz: " + getDistanceString(coordinates, origin_coordinates));
      // marker.on('popupopen', onMarkerShowPopup);
      // marker.on('popupclose', onMarkerClosePopup);

      // var originMarker = addMarkerForType("origin_coordinate", origin_coordinates);
      // originMarker.bindPopup("<b>" + el.title + "</b><br />" +
      //    "Distanz: " + getDistanceString(coordinates, origin_coordinates));
      // originMarker.on('popupopen', onMarkerShowPopup);
      // originMarker.on('popupclose', onMarkerClosePopup);

      //$scope.storedMarkers.push({'origin' : originMarker, 'found' : marker});
      //$scope.markerlayers.addLayer(originMarker);
      //$scope.markerlayers.addLayer(marker);
    //});
  });

    // $http.get('js/metadata.json').then(function(data) {
    //  console.log(data);
    // });

    // $timeout(function() { $scope.updateMarkers(); }, 3000);


  //$scope.currentStone = {};
  // $scope.stoneGroup = {};
  //$scope.stoneOverlayIsActive = false;
  //$scope.stoneSelectorIsActive = false;
  $scope.storedMarkers = [];
    $scope.focusedMarkerPair = {};
    $scope.focusedLine = {};
    $scope.markerlayers = new L.featureGroup([]);
    $scope.map = {};


  $scope.$on( 'leafletDirectiveMarker.click', function(event, args) {
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

    // $scope.updateMarkers = function() {
    //     console.log('Timeout called');
    //     $scope.pins.newMarker = {lat: 59.81,
    //             lng: 10.65,
    //             message: "I want to travel here!",
    //             focus: false,
    //             draggable: false};
    // };

    // TODO: Find out what this is!
  // $scope.buttonsAdded = false;
  //
  // leafletData.getMap().then(function(map) {
  //   if ($scope.buttonsAdded === false) {
  //     L.easyButton('fa fa-search-plus',
  //             function () {alert('hello!');},
  //            '',
  //            map
  //           );
  //     $scope.buttonsAdded = true;
  //     console.log('added button');
  //   }
  //
  // });
}

module.exports = MapController;

        // $http.get('js/metadata.json').then(function(data) {
  //        L.tileLayer('https://{s}.tiles.mapbox.com/v4/knutator.l8m1lim1/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia251dGF0b3IiLCJhIjoiRlEzWmFjUSJ9.JLn3oQ3FbbCsjtuxQCpFjQ').addTo(map);
  //        angular.forEach(data, function(index, el) {
  //            if (el.coordinate && el.origin_coordinate) {
  //                var coordinates = parseCoordinateString(el.coordinate);
  //                var origin_coordinates = parseCoordinateString(el.origin_coordinate);
  //                var marker = addMarkerForType("found_coordinate", coordinates);
  //                marker.bindPopup("<b>" + el.title + "</b><br />" +
  //                    "Distanz: " + getDistanceString(coordinates, origin_coordinates));
  //                marker.on('popupopen', onMarkerShowPopup);
  //                marker.on('popupclose', onMarkerClosePopup);

  //                var originMarker = addMarkerForType("origin_coordinate", origin_coordinates);
  //                originMarker.bindPopup("<b>" + el.title + "</b><br />" +
  //                    "Distanz: " + getDistanceString(coordinates, origin_coordinates));
  //                originMarker.on('popupopen', onMarkerShowPopup);
  //                originMarker.on('popupclose', onMarkerClosePopup);

  //                $scope.storedMarkers.push({'origin' : originMarker, 'found' : marker});
  //                $scope.markerlayers.addLayer(originMarker);
  //                $scope.markerlayers.addLayer(marker);
  //            }
  //        });
  //        $scope.map.fitBounds(markerlayers.getBounds());
        // });
  //   };

//     function parseCoordinateString(raw_coordinates) {
//         var coordinates = raw_coordinates.split(',');

//         // $.each(coordinates, function(index, el) {
//         //     coordinates[index] = parseFloat(el);
//         // });
//         return L.latLng(coordinates[0], coordinates[1]);
//     }

//     function addMarkerForType(type, coordinates) {
//         var marker;
//         var icon;
//         switch(type) {
//             case "origin_coordinate":
//                 icon = L.MakiMarkers.icon({icon: "rocket", color: "#f00", size: "m"});
//                 break;
//             case "found_coordinate":
//                 icon = L.MakiMarkers.icon({icon: "circle", color: "#0f0", size: "m"});
//                 break;
//         }
//         console.log(coordinates);
//         marker = L.marker(coordinates, {icon: icon}).addTo(map);
//         return marker;

//     }

//     function focusMarkerPair(markerPair) {
//         var linesegments = [];
//         focusedMarkerPair = markerPair;
//         angular.forEach(markerPair, function(index, val) {
//             val.setIcon(L.MakiMarkers.icon({icon: "swimming", color: "#ff0", size: "m"}));
//             linesegments.push(val.getLatLng());
//         });
//         focusedLine = L.polyline(linesegments, {color: 'red'}).addTo(map);
//     }

//     function onMarkerShowPopup(event) {

//         angular.forEach(storedMarkers, function(markerPairIndex, markerPair) {
//              angular.forEach(markerPair, function(markerIndex, marker) {
//                   var currentLatLng = marker.getLatLng();
//                   if (currentLatLng.equals(event.popup.getLatLng())) {
//                     focusMarkerPair(markerPair);
//                     console.log('focused');
//                   }
//              });
//         });
//     }

//     function onMarkerClosePopup(event) {
//         focusedMarkerPair.found.setIcon(L.MakiMarkers.icon({icon: "circle", color: "#0f0", size: "m"}));
//         focusedMarkerPair.origin.setIcon(L.MakiMarkers.icon({icon: "rocket", color: "#f00", size: "m"}));
//         map.removeLayer(focusedLine);
//     }

//     function getDistanceString(originCoordinate, foundCoordiante) {
//         var distanceInMeters = foundCoordiante.distanceTo(originCoordinate);
//         var distanceInKilometers = Math.round(distanceInMeters / 1000 *100) / 100;
//         return distanceInKilometers + ' km';
//     }
// });
