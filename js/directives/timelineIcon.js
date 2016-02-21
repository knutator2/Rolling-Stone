var $ = require( 'jquery' );

var timelineIcon = function() {
    return {
        restrict: 'EA',
        scope : {
            eraItem: '='
        },
        replace: true,
        templateUrl: 'js/directives/timelineIcon.html',
        link: function (scope, element, attrs) {

            var showEraInfo = function() {
                $( '.timeline__textbox' )
                    .css( 'display', 'block' )
                    .find( '.timeline__textbox-text' )
                    .html( scope.eraItem.text_short );
            }

            var hideEraInfo = function() {
                $( '.timeline__textbox' )
                    .css( 'display', 'none' );
            }

            element.on( 'mouseenter', showEraInfo );
            element.on( 'mouseleave', hideEraInfo );
        }
    };
}

module.exports = timelineIcon;
