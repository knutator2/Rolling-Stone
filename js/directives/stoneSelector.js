//myApp.directive('stoneselector', function() {
var stoneSelector = function() {
    return {
        restrict: 'E',
        scope : {
            stones: '=',
            selectedStone: '=',
            selectorIsActive: '='
        },
        replace: true,
        templateUrl: 'js/directives/stoneSelector.html',
        link: function (scope, element, attrs) {
            scope.updateCurrentStone = function(value) {
                scope.selectedStone = value;
            };
        }
    };
}

module.exports = stoneSelector;
