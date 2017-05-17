var DetailOverlay = function() {
	return {
		restrict: 'E',
		scope : {
			item: '='
		},
		replace: true,
		templateUrl: 'js/directives/detailOverlay.html'
	};
}

module.exports = DetailOverlay;
