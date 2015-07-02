myApp.directive('stoneselector', function() {
    return {
        restrict: 'E',
        scope : {
            stones: '=',
            selectedStone: '=',
            selectorIsActive: '='
        },
        replace: true,
        templateUrl: 'js/directives/stoneSelector.html' 
    };
});