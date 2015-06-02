$(document).ready(function () {  
   
    var map = new L.map('map', {
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    }).setView([52.886525, 14.139851], 7); 
    var storedMarkers = [];
    var focusedMarkerPair = {};
    var focusedLine = {};
    
    function parseCoordinateString(raw_coordinates) {
        var coordinates = raw_coordinates.split(',');
                
        // $.each(coordinates, function(index, el) { 
        //     coordinates[index] = parseFloat(el);
        // });
        return L.latLng(coordinates[0], coordinates[1]);
    }

    function addMarkerForType(type, coordinates) {
        var marker;
        var icon;
        switch(type) {
            case "origin_coordinate":
                icon = L.MakiMarkers.icon({icon: "rocket", color: "#f00", size: "m"});
                break;
            case "found_coordinate":
                icon = L.MakiMarkers.icon({icon: "circle", color: "#0f0", size: "m"});
                break;
        }
        console.log(coordinates);
        marker = L.marker(coordinates, {icon: icon}).addTo(map);
        return marker;

    }

    function focusMarkerPair(markerPair) {
        var linesegments = [];
        focusedMarkerPair = markerPair;
        $.each(markerPair, function(index, val) {
            val.setIcon(L.MakiMarkers.icon({icon: "swimming", color: "#ff0", size: "m"}));
            linesegments.push(val.getLatLng());
        });
        focusedLine = L.polyline(linesegments, {color: 'red'}).addTo(map);
    }

    function onMarkerShowPopup(event) {
        
        $.each(storedMarkers, function(markerPairIndex, markerPair) {
             $.each(markerPair, function(markerIndex, marker) {
                  var currentLatLng = marker.getLatLng();
                  if (currentLatLng.equals(event.popup.getLatLng())) {
                    focusMarkerPair(markerPair);
                    console.log('focused');
                  }
             });
        });
    }

    function onMarkerClosePopup(event) {
        focusedMarkerPair.found.setIcon(L.MakiMarkers.icon({icon: "circle", color: "#0f0", size: "m"}));
        focusedMarkerPair.origin.setIcon(L.MakiMarkers.icon({icon: "rocket", color: "#f00", size: "m"}));
        map.removeLayer(focusedLine);
    }

    function getDistanceString(originCoordinate, foundCoordiante) {
        var distanceInMeters = foundCoordiante.distanceTo(originCoordinate);
        var distanceInKilometers = Math.round(distanceInMeters / 1000 *100) / 100;
        return distanceInKilometers + ' km';
    }

    $.getJSON('js/metadata.json', function(data) {
        

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
             attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map); 
        $.each(data, function(index, el) {
            if (el.coordinate && el.origin_coordinate) {
                var coordinates = parseCoordinateString(el.coordinate);
                var origin_coordinates = parseCoordinateString(el.origin_coordinate);
                
                
                var marker = addMarkerForType("found_coordinate", coordinates);
                marker.bindPopup("<b>" + el.title + "</b><br />" +
                    "Distanz: " + getDistanceString(coordinates, origin_coordinates));
                marker.on('popupopen', onMarkerShowPopup);
                marker.on('popupclose', onMarkerClosePopup);

                var originMarker = addMarkerForType("origin_coordinate", origin_coordinates);
                originMarker.bindPopup("<b>" + el.title + "</b><br />" +
                    "Distanz: " + getDistanceString(coordinates, origin_coordinates));
                originMarker.on('popupopen', onMarkerShowPopup);
                originMarker.on('popupclose', onMarkerClosePopup);
                //originMarker.on('popup', onMarkerClick);
                storedMarkers.push({'origin' : originMarker, 'found' : marker});
            }
        }); 
    });
});
