var _ = require( 'underscore' );

var StoneEraService = function($resource, $http) {

    // Returns a promise which's result is an array with all eras,
    // ordered from oldest to youngest era
    var getAllEras = function() {
        var promise;

        promise = $http.get( 'js/geo_era.json' ).then(function (response) {
            var result;

            result = _.sortBy( response.data, function( item ) {
                return item.start;
            });

            result = result.reverse();

            return result;
        });

        return promise;
    }

    var getErasLength = function() {
        var promise;

        promise = $http.get( 'js/geo_era.json' ).then(function (response) {
            return response.data.length;
        });

        return promise;
    }

    return {
        getAllEras: getAllEras,
        getErasLength: getErasLength
    }
}

module.exports = StoneEraService;
