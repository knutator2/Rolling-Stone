var linkbutton = function() {
    return {
        restrict: 'E',
        scope : {
            target: '@',
            text: '@',
            linkTitle: '@',
            iconClass: '@'
        },
        replace: true,
        templateUrl: 'js/directives/linkbutton.html',
    };
}

module.exports = linkbutton;
