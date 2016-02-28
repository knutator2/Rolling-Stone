var $ = require( 'jquery' );

var HeaderController = function( $scope ) {
    $scope.header = {name: 'header.html', url: 'js/views/header.html'};
    $scope.siteNavOpen = false;

    $scope.toggleSiteNav = function() {
        var $burgerIcon = $( '.header_burger-icon' ),
            $siteNav = $( '.header_site-nav' );

        $scope.siteNavOpen = !$scope.siteNavOpen;

        if ( $scope.siteNavOpen ) {
            $burgerIcon.addClass( 'header_burger-icon--active' );
            $siteNav.addClass( 'header_site-nav--active' );
        } else {
            $burgerIcon.removeClass( 'header_burger-icon--active' );
            $siteNav.removeClass( 'header_site-nav--active' );
        }
    };
}

module.exports = HeaderController;
