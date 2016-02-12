require( 'angular' );
var _ = require( 'underscore' );

var StoneDataService = function( $resource, $http, $q ) {

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
                return item.origin_coordinate;
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
                return item.coordinate;
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
	};
}

module.exports = StoneDataService;
