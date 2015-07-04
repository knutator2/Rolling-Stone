var service = angular.module('epocheservice', ['ngResource']);

// Split given coordinate and parse it into leaflet specific format
function parseCoordinateString(raw_coordinates) {
        var coordinates = raw_coordinates.split(',');
        return L.latLng(coordinates[0], coordinates[1]);
}

var destinationIcon = L.icon({
        iconUrl: 'http://joshuafrazier.info/images/firefox.svg',
        iconSize: [38, 95], // size of the icon
        });



service.factory('EpocheService', ['$resource', '$http', function($resource, $http) {
	var promise;
	var stoneParsingService = {
		get: function() {
			if ( !promise ) {
				promise = $http.get('js/geo_era.json').then(function (response) {
					var items = [];
					return response.data;
	    			
					
				});
			}
			return promise;
		}
	};
	return stoneParsingService;
}]);


  // return $resource('js/metadata.json',{}, {
  //    query: {method:'GET', isArray:true}
  //  });
//  }]);
