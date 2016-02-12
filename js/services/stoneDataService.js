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

var StoneDataService = function( $resource, $http, $q ) {
	var promiseGet;
    var promiseGetPins;
    var promiseGetById;

    // Returns all stones that have an origin and destination location available
    var getAllStones =  function( filter ) {
        var promise = $http.get( 'js/metadata.json' ).then( function( response ) {
            var items = [];
            angular.forEach( response.data, function( element, index ) {
                if ( element.coordinate && element.origin_coordinate ) {
                    items.push( element );
                }
            });
            return items;
        });

        return promise;
    };

    // Returns a stone with the given ID
    var getStone = function( id ) {
        var promise = $http.get( 'js/metadata.json' ).then( function( response ) {
            var result;

            result = _.find( response.data, function( item ) {
                return ( item.museum_id === id );
            });

            return result;
        });
        return promise;
    };

    // Returns a stone with the next higher ID than given ID
    var getNextStone = function( id ) {
        // TODO: Implement!
    };

    // Returns a stone with the next lower ID than given ID
    var getPreviousStone = function( id ) {
        // TODO: Implement!
    };

    // Returns data for all stones, grouped by the origin location property
    var getAllStonesGroupedByOrigin = function( filter ) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        getAllStones().then( function( result ) {
            var groupedData;

            groupedData = _.groupBy( result, function( item ) {
                return item.coordinate;
            });

            deferred.resolve( groupedData );
        });

        return promise;
    };

    // Returns data for all stones, grouped by the destination location property
    var getAllStonesGroupedByDestination = function( filter ) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        getAllStones().then( function( result ) {
            var groupedData;

            groupedData = _.groupBy( result, function( item ) {
                return item.origin_coordinate;
            })

            deferred.resolve( groupedData );
        });

        return promise;
    };

    // Public API
	return {
        getStone: getStone,
        getNextStone: getNextStone,
        getPreviousStone: getPreviousStone,
        getAllStones: getAllStones,
        getAllStonesGroupedByOrigin: getAllStonesGroupedByOrigin,
        getAllStonesGroupedByDestination: getAllStonesGroupedByDestination,

        // old functionS: Need to be refactored most likely!
		get: function() {
			var promise = $http.get( 'js/metadata.json' ).then( function(response) {
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
			return promise;
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

module.exports = StoneDataService;
