function markerColor(aqi) {
    if (aqi <= 50) {
        return "green"
    } else if (aqi <= 51 &&  aqi <= 100) {
        return "yellow"
    } else if (aqi <= 101 && aqi <= 150) {
        return "orange"
    } else if (aqi <= 151 && aqi <= 200) {
        return "red"
    } else if (aqi <= 201 && aqi <= 300) {
        return "purple"
    } else {
        return "maroon"
    }
}

function getColor(d) {
    if (d == 'Good') {
        return 'green'
    } else if (d == 'Moderate') {
        return 'yellow'
    } else if (d == 'Unhealthy for Sensitive Groups') {
        return 'orange'
    } else if (d == 'Unhealthy') {
        return 'red'
    } else if (d == 'Very Unhealthy') {
        return 'purple'
    } else {
        return 'maroon'
    }
}

// Read markers data from data.csv
$.get('Data/currentAQIData.csv', function(csvString) {
    
    const data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data; // Using Header: true to Key Data by Field Name
    
    // For each row in data, create a marker and add it to the map
    for (let i in data) {
        let row = data[i];
        CurrentAQIValue = row.CurrentAQIValue
        let caMarkers =
            L.circle([row.Latitude, row.Longitude], {
            radius: 7500,
            fillOpacity: 0.50,
            stroke: false,
            fillColor: markerColor(row.CurrentAQIValue)
            }).bindPopup("<strong>" + row.CurrentPollutant + "</strong><br>" + 
                "<h3>"+ CurrentAQIValue + "</h3>")
        caMarkers.addTo(map);
    };
        
});
// Display Carto Basemap Tiles with Light Features and Labels
// This will be the Default Map
const street = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

const baseMaps = {
    Street: street
};

// Seting Up Initial Map Center and Zoom Level
const map = L.map('map', {
    center: [36.7378, -119.7871],
    zoom: 7, 
    layers: [street]
});

L.control.layers(baseMaps).addTo(map);

const legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend'),
        categories = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];
        div.innerHTML += "<strong>Air Quality Levels of Concern</strong><br>";

        for (let i = 0; i < categories.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(categories[i]) + '"></i>'
                + categories[i] + (categories[i] ? '<br>':'+');
        }
        return div;
    };

    legend.addTo(map);


