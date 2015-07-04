myApp.controller("DetailController", ['$scope', '$routeParams', 'StonesService',
    function($scope, $routeParams, StonesService) {

        $scope.name = "Detail";
        $scope.currentStone = {};
        var qwertz = StonesService.getStoneById(parseInt($routeParams.stoneId,10));

        qwertz.then(function(response) {
            $scope.currentStone = response;
        });

        // $scope.currentStone = {test: "yeee"};

        $scope.stones = []; // Could be used for later

        // StonesService.get().then(function(data) {
        //     $scope.len = data.length;
        //     $scope.stones = data;
        //     angular.forEach(data, function(value) {
        //         if (value.museum_id === parseInt($routeParams.stone)) {
        //             $scope.currentStone = value;
        //         }
        //     });
        //     console.log($routeParams);
        // }); 
    }
]);