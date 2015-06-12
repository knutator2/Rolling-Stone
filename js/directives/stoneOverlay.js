myApp.directive('stoneoverlay', function() {
	return {
		restrict: 'E',
		scope : {
			stone: '=',
		},
		replace: true,
		templateUrl: 'js/directives/stoneOverlay.html',
		link : function (scope, element, attrs) {
			scope.action = function() {
				alert('TODO: schow More Page');
			}
		}
	};
});