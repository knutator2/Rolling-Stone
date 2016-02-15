require( 'angular' );
var _ = require( 'underscore' );

var StoneDataService = function( $resource, $http, $q, StoneEraService ) {

    var standardFilterData;
    var initFilterData = function() {
        allErasPromise = StoneEraService.getAllEras();

        allErasPromise.then( function( result ) {
            standardFilterData = result;
        });
    }

    initFilterData();

    // Returns all stones that have an origin and destination location available
    var getAllStones =  function( filterStart, filterEnd ) {
        var promise = $http.get( 'js/metadata.json' ).then( function( response ) {
            var items = [];
            angular.forEach( response.data, function( element, index ) {
                if ( element.coordinate && element.origin_coordinate ) {
                    items.push( element );
                }
            });

            if ( filterStart !== undefined && filterEnd !== undefined ) {
                items = filterStonesByEra( items, filterStart, filterEnd );
            }
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
    var getAllStonesGroupedByOrigin = function( filterStart, filterEnd ) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        getAllStones( filterStart, filterEnd ).then( function( result ) {
            var groupedData;

            groupedData = _.groupBy( result, function( item ) {
                return item.origin_coordinate;
            });

            deferred.resolve( groupedData );
        });

        return promise;
    };

    // Returns data for all stones, grouped by the destination location property
    var getAllStonesGroupedByDestination = function( filterStart, filterEnd ) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        getAllStones( filterStart, filterEnd ).then( function( result ) {
            var groupedData;

            groupedData = _.groupBy( result, function( item ) {
                return item.coordinate;
            })

            deferred.resolve( groupedData );
        });

        return promise;
    };

    // filters the given stone data by the given geological eras
    var filterStonesByEra = function( stones, indexFrom, indexTo ) {
        var filteredData = [],
            reducedStandardFilterData = standardFilterData.slice( indexFrom, indexTo + 1 ),
            remainingEraNames = [];

        remainingEraNames = _.map( reducedStandardFilterData, function( item ) {
            return item.name;
        })

        _.each( stones, function( stone ) {
            if ( _.contains( remainingEraNames, stone.geological_era ) ) {
                filteredData.push( stone );
            }
        });

        return filteredData;
    }

    // Public API
	return {
        getStone: getStone,
        getNextStone: getNextStone,
        getPreviousStone: getPreviousStone,
        getAllStones: getAllStones,
        getAllStonesGroupedByOrigin: getAllStonesGroupedByOrigin,
        getAllStonesGroupedByDestination: getAllStonesGroupedByDestination
	};
}

module.exports = StoneDataService;
