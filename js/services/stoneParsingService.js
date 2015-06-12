var service = angular.module('stoneparsingservice', ['ngResource']);

// Split given coordinate and parse it into leaflet specific format
function parseCoordinateString(raw_coordinates) {
        var coordinates = raw_coordinates.split(',');
        return L.latLng(coordinates[0], coordinates[1]);
}



service.factory('StonesService', ['$resource', '$http', function($resource, $http) {
	var promise;
	var stoneParsingService = {
		get: function() {
			if ( !promise ) {
				promise = $http.get('js/metadata.json').then(function (response) {
					console.log("serviceresponse = " + response);
					var items = [];
					angular.forEach(response.data, function(el, index) {
						console.log('cycled');
		        		if (el.coordinate && el.origin_coordinate) {
		        			var coordinates = parseCoordinateString(el.coordinate);
      						var origin_coordinates = parseCoordinateString(el.origin_coordinate);
      						var pin = angular.merge({}, el, coordinates);
      						var pin_orig = angular.merge({}, el, origin_coordinates);
      						pin.type = "Destination";
      						pin.icon = L.MakiMarkers.icon({icon: "rocket", color: "#f00", size: "m"}).options;
      						pin_orig.type = "Source";
      						pin_orig.icon = L.MakiMarkers.icon({icon: "circle", color: "#0f0", size: "m"}).options;
		            		items.push(pin);
		            		items.push(pin_orig);
		        		}
	    			}); 
					return items;
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