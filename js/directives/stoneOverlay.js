// myApp.directive('stoneoverlay', function() {
var stoneOverlay = function() {
	return {
		restrict: 'E',
		scope : {
			stone: '=',
			overlayIsActive: '='
		},
		replace: true,
		templateUrl: 'js/directives/stoneOverlay.html'
	};
}

module.exports = stoneOverlay;
