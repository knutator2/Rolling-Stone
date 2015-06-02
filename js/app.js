var RollingStone = angular.module('RollingStone', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

console.log(RollingStone.config);