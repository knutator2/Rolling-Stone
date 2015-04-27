 $(document).ready(function () {
    console.log('parse json');
    $.getJSON('js/metadata.json', function(data) {
        console.log(data);
        var map = L.map('map').setView([52.886525, 14.139851], 13);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
             attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map); 
        $.each(data, function(index, el) {
            if (el.coordinate) {
                var coordinates = el.coordinate.split(',');
                console.log(coordinates);
                $.each(coordinates, function(index, el) { coordinates[index] = parseFloat(el)});
                console.log(coordinates);
                var marker = L.marker(coordinates).addTo(map);
                marker.bindPopup("<b>" + el.title + "</b><br>I am a popup.");
            }
        });

        $.each(data, function(index, el) {
            if (el.origin_coordinate) {
                var coordinates = el.origin_coordinate.split(',');
                console.log(coordinates);
                $.each(coordinates, function(index, el) { coordinates[index] = parseFloat(el)});
                console.log(coordinates);
                L.marker(coordinates).addTo(map);
            }
        });
        
    });

});
