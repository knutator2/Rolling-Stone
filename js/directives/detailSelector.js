var detailSelector = function() {
    return {
        restrict: 'E',
        scope : {
            stones: '=',
            selectedStone: '=',
            selectorIsActive: '='
        },
        replace: true,
        templateUrl: 'js/directives/detailSelector.html',
        link: function (scope, element, attrs) {
            scope.updateCurrentStone = function(value) {
                scope.selectedStone = value;
            };
        }
    };
}

module.exports = detailSelector;
