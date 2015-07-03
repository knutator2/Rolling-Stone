myApp.directive('stoneoverlay', function() {
	return {
		restrict: 'E',
		scope : {
			stone: '=',
			overlayIsActive: '='
		},
		replace: true,
		templateUrl: 'js/directives/stoneOverlay.html'
	};
});