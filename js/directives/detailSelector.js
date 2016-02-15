var detailSelector = function() {
    return {
        restrict: 'E',
        scope : {
            items: '=',
            selectedItem: '='
        },
        replace: true,
        templateUrl: 'js/directives/detailSelector.html',
        link: function (scope, element, attrs) {
            scope.updateCurrentItem = function(value) {
                scope.selectedItem = value;
            };
        }
    };
}

module.exports = detailSelector;
