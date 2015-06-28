myApp.directive('stoneoverlay', function() {
	return {
		restrict: 'E',
		scope : {
			stone: '=',
			overlayIsActive: '='
		},
		replace: true,
		templateUrl: 'js/directives/stoneOverlay.html',
		link : function (scope, element, attrs) {
			scope.action = function() {
				console.log(scope.stone);
				console.log(scope.overlayIsActive);
				// alert('TODO: show More Page');
			}
		}
	};
});