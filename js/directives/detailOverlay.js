var DetailOverlay = function() {
	return {
		restrict: 'E',
		scope : {
			stone: '='
		},
		replace: true,
		templateUrl: 'js/directives/detailOverlay.html'
	};
}

module.exports = DetailOverlay;
