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

    // Returns all stones with at least material and geological_era properties
    var getAllStones = function( filterStart, filterEnd ) {
        var promise = $http.get( 'js/metadata.json' ).then( function( response ) {
            var items = [];
            angular.forEach( response.data, function( element, index ) {
                if ( element.material && element.geological_era ) {
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

    // Returns all stones that have an origin and destination location available
    var getAllStonesWithLocationData =  function( filterStart, filterEnd ) {
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

        getAllStonesWithLocationData( filterStart, filterEnd ).then( function( result ) {
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

        getAllStonesWithLocationData( filterStart, filterEnd ).then( function( result ) {
            var groupedData;

            groupedData = _.groupBy( result, function( item ) {
                return item.coordinate;
            })

            deferred.resolve( groupedData );
        });

        return promise;
    };

    getAllStonesGroupedByEra = function( filterStart, filterEnd ) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        getAllStones( filterStart, filterEnd ).then( function( result ) {
            var groupedData,
                orderedGroupedData = [];

            groupedData = _.groupBy( result, function( item ) {
                return item.geological_era;
            })

            // Order the data chronologically
            if ( groupedData[ 'Präkambrium' ] ) { orderedGroupedData.push( groupedData[ 'Präkambrium' ] ); }
            if ( groupedData[ 'Kambrium' ] ) { orderedGroupedData.push( groupedData[ 'Kambrium' ] ); }
            if ( groupedData[ 'Ordovizium' ] ) { orderedGroupedData.push( groupedData[ 'Ordovizium' ] ); }
            if ( groupedData[ 'Silur' ] ) { orderedGroupedData.push( groupedData[ 'Silur' ] ); }
            if ( groupedData[ 'Devon' ] ) { orderedGroupedData.push( groupedData[ 'Devon' ] ); }
            if ( groupedData[ 'Karbon' ] ) { orderedGroupedData.push( groupedData[ 'Karbon' ] ); }
            if ( groupedData[ 'Perm' ] ) { orderedGroupedData.push( groupedData[ 'Perm' ] ); }
            if ( groupedData[ 'Trias' ] ) { orderedGroupedData.push( groupedData[ 'Trias' ] ); }
            if ( groupedData[ 'Jura' ] ) { orderedGroupedData.push( groupedData[ 'Jura' ] ); }
            if ( groupedData[ 'Kreide' ] ) { orderedGroupedData.push( groupedData[ 'Kreide' ] ); }
            if ( groupedData[ 'Tertiär' ] ) { orderedGroupedData.push( groupedData[ 'Tertiär' ] ); }

            deferred.resolve( orderedGroupedData );
        });

        return promise;
    };

    getAllStonesGroupedByMaterial = function( filterStart, filterEnd ) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        getAllStones( filterStart, filterEnd ).then( function( result ) {
            var groupedData,
                orderedGroupedData = [];

            groupedData = _.groupBy( result, function( item ) {
                return item.material;
            });

            // Order the data manually/alphabetically
            if ( groupedData[ 'Basalt' ] ) { orderedGroupedData.push( groupedData[ 'Basalt' ] ); }
            if ( groupedData[ 'Diabas' ] ) { orderedGroupedData.push( groupedData[ 'Diabas' ] ); }
            if ( groupedData[ 'Feuerstein' ] ) { orderedGroupedData.push( groupedData[ 'Feuerstein' ] ); }
            if ( groupedData[ 'Gneis' ] ) { orderedGroupedData.push( groupedData[ 'Gneis' ] ); }
            if ( groupedData[ 'Granit' ] ) { orderedGroupedData.push( groupedData[ 'Granit' ] ); }
            if ( groupedData[ 'Hornstein' ] ) { orderedGroupedData.push( groupedData[ 'Hornstein' ] ); }
            if ( groupedData[ 'Kalksandstein' ] ) { orderedGroupedData.push( groupedData[ 'Kalksandstein' ] ); }
            if ( groupedData[ 'Kalkspat' ] ) { orderedGroupedData.push( groupedData[ 'Kalkspat' ] ); }
            if ( groupedData[ 'Kalkstein' ] ) { orderedGroupedData.push( groupedData[ 'Kalkstein' ] ); }
            if ( groupedData[ 'Konglomerat' ] ) { orderedGroupedData.push( groupedData[ 'Konglomerat' ] ); }
            if ( groupedData[ 'Kreide' ] ) { orderedGroupedData.push( groupedData[ 'Kreide' ] ); }
            if ( groupedData[ 'Mergel' ] ) { orderedGroupedData.push( groupedData[ 'Mergel' ] ); }
            if ( groupedData[ 'Migmatit' ] ) { orderedGroupedData.push( groupedData[ 'Migmatit' ] ); }
            if ( groupedData[ 'Moler' ] ) { orderedGroupedData.push( groupedData[ 'Moler' ] ); }
            if ( groupedData[ 'Porphyr' ] ) { orderedGroupedData.push( groupedData[ 'Porphyr' ] ); }
            if ( groupedData[ 'Quarzit' ] ) { orderedGroupedData.push( groupedData[ 'Quarzit' ] ); }
            if ( groupedData[ 'Sandstein' ] ) { orderedGroupedData.push( groupedData[ 'Sandstein' ] ); }
            if ( groupedData[ 'Sandstein Konglomerat' ] ) { orderedGroupedData.push( groupedData[ 'Sandstein Konglomerat' ] ); }
            if ( groupedData[ 'Schiefer' ] ) { orderedGroupedData.push( groupedData[ 'Schiefer' ] ); }
            if ( groupedData[ 'Schluff' ] ) { orderedGroupedData.push( groupedData[ 'Schluff' ] ); }

            // TODO: Chronological order? Check if it's feasable to do this.

            deferred.resolve( orderedGroupedData );
        });

        return promise;
    };

    // filters the given stone data by the given geological eras
    var filterStonesByEra = function( stones, indexFrom, indexTo ) {
        var filteredData = [],
            reducedStandardFilterData = standardFilterData.slice( indexFrom, indexTo + 1 ),
            remainingEraNames = [];

        remainingEraNames = _.map( reducedStandardFilterData, function( item ) {
            return item.name_short;
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
        getAllStonesGroupedByEra: getAllStonesGroupedByEra,
        getAllStonesGroupedByMaterial: getAllStonesGroupedByMaterial,
        getAllStonesWithLocationData: getAllStonesWithLocationData,
        getAllStonesGroupedByOrigin: getAllStonesGroupedByOrigin,
        getAllStonesGroupedByDestination: getAllStonesGroupedByDestination
	};
}

module.exports = StoneDataService;
