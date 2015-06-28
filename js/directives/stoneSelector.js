myApp.directive('stoneselector', function() {
    return {
        restrict: 'E',
        scope : {
            stone: '=',
        },
        replace: true,
        templateUrl: 'js/directives/stoneSelector.html' 
    };
});