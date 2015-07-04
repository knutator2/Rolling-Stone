function parseMarkers(pins) {
  var result = _.map(pins, function(elem) {
    console.log(elem)
    return elem;
  })
}

 myApp.controller("MapController", ['$scope', '$http', '$timeout', 'StonesService', 'leafletData',
    	function($scope, $http, $timeout, StonesService, leafletData) {
    angular.extend($scope, {
 		center: 
 		{
            lat: 52.886525,
            lng: 14.139851,
            zoom: 5
        },
 		defaults: {
 			scrollWheelZoom: false
 		},
    events: {
            map: {
                enable: ['zoomstart', 'drag', 'click', 'mousemove'],
                logic: 'emit'
            }
        },
 		pins: {
        },
 		mapboxtiles: {
 			url: "https://{s}.tiles.mapbox.com/v4/knutator.c8d1fddc/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia251dGF0b3IiLCJhIjoiRlEzWmFjUSJ9.JLn3oQ3FbbCsjtuxQCpFjQ",
            options: {
                attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"
            }
 		}
 	});

 	var pins = StonesService.getPins();
  var map = [];
  var littleton = L.marker([52.520007, 13.404954])
  $scope.magnifyingPinLayer = L.layerGroup();

  console.log(pins);

  $scope.markerclick = function(event,args) {
    $scope.currentStone = args.leafletObject.options.stones[0];
        $scope.stoneOverlayIsActive = true;

        if (args.leafletObject.options.stones.length > 1) {
          $scope.stoneGroup = args.leafletObject.options.stones;
          $scope.stoneSelectorIsActive = true;

        } else {
          $scope.stoneSelectorIsActive = false;
        }
  }

  pins.then(function(response) {
 	 	//add pins to map
    console.log(response);

    $scope.pins = response;
    $scope.filteredPins = response.slice();
    $scope.$watch("filteredPins", function (newValue, oldValue) {
      console.log("markers did change");
      console.log(newValue);
      $scope.pins = newValue;
    });
    var magnifyingpins = _.map($scope.pins, function (elem) {
        
        var myIconUrl = elem.icon.iconUrl;
        var myIcon = L.icon({
         iconUrl: myIconUrl,
         iconRetinaUrl: myIconUrl,
         iconSize: [38, 95]
        });
        var new_marker = L.marker([elem.lat, elem.lng], {icon: myIcon});
        new_marker.stones = elem.stones;
        new_marker.on('click', function(e) {
          var args = {};
          args.leafletObject = {};
          args.leafletObject.options = {};
          args.leafletObject.options.stones = elem.stones;
          $scope.markerclick(e, args);
        });
        // new_marker.icon.iconUrl = myIconUrl;
        // new_marker.icon.iconRetinaUrl = myIconUrl;

        $scope.magnifyingPinLayer.addLayer(new_marker);
    })
    
    
  });

 	$scope.name = "Map";
  $scope.currentStone = {};
  $scope.stoneGroup = {};
  $scope.stoneOverlayIsActive = false;
  $scope.stoneSelectorIsActive = false;
  $scope.storedMarkers = [];
 	$scope.focusedMarkerPair = {};
 	$scope.focusedLine = {};
 	$scope.markerlayers = new L.featureGroup([]);
 	$scope.map = {};
  $scope.dismissSelection = function( event ) {
    $scope.stoneSelectorIsActive = false;
    $scope.stoneOverlayIsActive = false;
  };

  $scope.$on('leafletDirectiveMarker.click', function(event, args){
    $scope.markerclick(event,args)
  });

 	$scope.updateMarkers = function() {
 		console.log('Timeout called');
 		$scope.pins.newMarker = {lat: 59.81,
                lng: 10.65,
                message: "I want to travel here!",
                focus: false,
                draggable: false};
 	};
  $scope.buttonsAdded = false;

  // leafletData.getMap().then(function(map) {
    
    
  // });

  leafletData.getMap().then(function(map) {

    var tileUrl = 'https://{s}.tiles.mapbox.com/v4/knutator.c8d1fddc/{z}/{x}/{y}.png?scure=1&access_token=pk.eyJ1Ijoia251dGF0b3IiLCJhIjoiRlEzWmFjUSJ9.JLn3oQ3FbbCsjtuxQCpFjQ';

    var layer = L.tileLayer(tileUrl);
    
    
    //parseMarkers($scope.pins);

    var magnifyingGlass = L.magnifyingGlass({
      zoomOffset: 3,
      layers: [
        layer, $scope.magnifyingPinLayer
      ]
    });

    //make the glass disappear on click...
    magnifyingGlass.on('click', function (event) {
      $scope.dismissSelection(event);
    })

    // ...and reappear on right click
    map.on('contextmenu', function(mouseEvt) {
      
    });

    if ($scope.buttonsAdded === false) {
      L.easyButton('fa fa-search-plus', 
              function () {
                if(map.hasLayer(magnifyingGlass)) {
                  map.removeLayer(magnifyingGlass);
                } else {
                  map.addLayer(magnifyingGlass);
                  magnifyingGlass.setLatLng(mouseEvt.latlng);
                }
              },
      '',map);
      $scope.buttonsAdded = true;
      console.log('added button');  
    }
  });
}]);	