// TODO: Refactor... Didn't try it out, but it looks like it's not working :-D

var StoneEpocheService = function($resource, $http) {
    var promise;
    return {
        get: function() {
			if ( !promise ) {
				promise = $http.get('js/geo_era.json').then(function (response) {
					var items = [];
					return response.data;
				});
			}
			return promise;
		}
    }
}

module.exports = StoneEpocheService;
