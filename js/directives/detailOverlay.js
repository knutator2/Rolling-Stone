var DetailOverlay = function() {
	return {
		restrict: 'E',
		scope : {
			stone: '=',
			overlayIsActive: '='
		},
		replace: true,
		templateUrl: 'js/directives/detailOverlay.html'
	};
}

module.exports = DetailOverlay;
