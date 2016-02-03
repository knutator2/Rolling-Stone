// var service = angular.module('stoneparsingservice', ['ngResource']);

require( 'angular' );
require( 'leaflet' );
var _ = require( 'underscore' );

// Split given coordinate and parse it into leaflet specific format
function parseCoordinateString(raw_coordinates) {
        var coordinates = raw_coordinates.split(',');
        return L.latLng(coordinates[0], coordinates[1]);
}

var destinationIcon = L.icon({
        iconUrl: 'http://joshuafrazier.info/images/firefox.svg',
        iconSize: [38, 95], // size of the icon
        });

var StoneParsingService = function($resource, $http) {
	var promiseGet;
    var promiseGetPins;
    var promiseGetById;
	return {
		get: function() {
			promiseGet = $http.get('js/metadata.json').then(function (response) {
				var items = [];
				angular.forEach(response.data, function(el, index) {
	        		if (el.coordinate && el.origin_coordinate) {
	        			var coordinates = parseCoordinateString(el.coordinate);
  						var origin_coordinates = parseCoordinateString(el.origin_coordinate);
  						var pin = angular.merge({}, el, coordinates);
  						var pin_orig = angular.merge({}, el, origin_coordinates);
  						pin.type = "Destination";
  						//pin.icon = L.marker.icon({icon: "rocket", color: "#f00", size: "m"}).options;
  						pin_orig.type = "Source";
  						//pin_orig.icon = L.MakiMarkers.icon({icon: "circle", color: "#0f0", size: "m"}).options;
	            		items.push(pin);
	            		items.push(pin_orig);
	        		}
    			});
				return items;
			});
			return promiseGet;
		},

        /*
        Returns all the stones, grouped by location (needed for the map)
         */
        getPins: function() {
            promiseGetPins = $http.get('js/metadata.json').then(function (response) {
                var pins = [],
                    groupedDataDestination,
                    groupedDataOrigins;

                // Get pins for discovery locations
                groupedDataDestination = _.groupBy(response.data, function(stoneItem) {
                    return stoneItem.coordinate;
                });

                angular.forEach(groupedDataDestination, function(element, index) {
                    var atLeastOneOriginAvailable = _.find( element, function (element) {
                        return element.origin_coordinate;
                    });

                    if (index !== 'undefined' && atLeastOneOriginAvailable) {
                        var pin = {},
                            coordinates,
                            stones;

                        coordinates = parseCoordinateString(index);
                        stones = element;

                        pin.stones = stones;
                        pin.type = "Destination";
                        //pin.icon = L.MakiMarkers.icon({icon: "rocket", color: "#f00", size: "m"}).options;
                        var marker = L.marker({icon: "rocket", color: "#f00", size: "m"});
                        marker.iconUrl = pin.stones.length > 1 ? "img/assets/Pin_Mehrere_Steine_ini.svg" : "img/assets/Pin_Gestein Fundort_ini.svg";
                        pin.icon = marker;
                        pin = angular.merge(pin, coordinates);
                        marker.iconRetinaUrl = marker.iconUrl;

                        pins.push(pin);
                    }
                });

                // Get pins for origin locations
                groupedDataOrigins = _.groupBy(response.data, function(stoneItem) {
                    return stoneItem.origin_coordinate;
                });

                angular.forEach(groupedDataOrigins, function(element, index) {
                    var atLeastOneDestinationAvailable = _.find( element, function (element) {
                        return element.coordinate;
                    });

                    if (index !== 'undefined' && atLeastOneDestinationAvailable) {
                        var pin = {},
                            coordinates,
                            stones;

                        coordinates = parseCoordinateString(index);
                        stones = element;

                        pin.stones = stones;
                        pin.type = "Origin";
                        var marker = L.marker();
                        marker.iconUrl = "img/assets/Pin_Gestein Herkunft_ini.svg";
                        pin.icon = marker;
                        pin = angular.merge(pin, coordinates);

                        pins.push(pin);

                    }
                });


                return pins;
            });
            return promiseGetPins;
        },

        getStoneById: function(stoneId) {
            promiseGetById = $http.get('js/metadata.json').then(function (response) {
                var result;

                result = _.find(response.data, function(item) {
                    return (item.museum_id === stoneId);
                });

                return result;
            });
        return promiseGetById;
        }
	};
}

module.exports = StoneParsingService;
