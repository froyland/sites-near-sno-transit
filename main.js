var config = {
	'awaitingcleanup': {
		'name': 'Awaiting Cleanup',
		'color': '#fb8072'
	},
	'cleanupstarted': {
		'name': 'Cleanup Started',
		'color':  '#ffd37f'
	},
	'monitoring': {
		'name': 'Monitoring',
		'color': '#80b1d3'
	}
}

var base = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var symbol_transit = {
	radius: 5,
	fillColor: '#fff',
	color: '#000',
	weight: 2,
	opacity: 1,
	fillOpacity: 0.7
};

var symbol_cleanupsites = {
	radius: 10,
	fillColor: '#000',
	color: '#000',
	weight: 2,
	opacity: 1,
	fillOpacity: 1
};

// import data
// points
var transitStops = new L.GeoJSON.AJAX('json/transitStops.geojson',
	{
		pointToLayer: function(feature, latlng){
			var options = symbol_transit;
			return L.circleMarker(latlng, options)
		},
		onEachFeature: function(feature, layer) {			
			var content = '<p>Stop Name: <strong>' + feature.properties.stop_name + '</strong></p>'					
			layer.bindPopup(content)
		}
});
	
var cleanupsites = new L.GeoJSON.AJAX('json/cleanupsites.geojson',
	{
		pointToLayer: function(feature, latlng){
			var options = symbol_cleanupsites;
			switch (feature.properties.siteStatus){
				case 'Cleanup Started':
					options.fillColor = config.cleanupstarted.color							
					break;
				case 'Awaiting Cleanup':
					options.fillColor = config.awaitingcleanup.color
					break;
				default:
					options.fillColor = config.monitoring.color
					break;
			}
			return L.circleMarker(latlng, options)                    
		},
		onEachFeature: function(feature, layer){			
			var content = '<p>Site Name: <strong>' + feature.properties.cleanupSiteName + '</strong><br />Status: <strong>' + feature.properties.siteStatus + '</strong><br />Site Page: <strong><a href="https://fortress.wa.gov/ecy/gsp/Sitepage.aspx?csid=' + feature.properties.csid + '" target="blank">Webpage</a></strong></p>'					
			layer.bindPopup(content)
		}				
});

var basemaps = {
	"basemap" : base
}

var data = {
	"<strong>Cleanup Sites</strong>": cleanupsites,
	"<strong>Transit Stops</strong>": transitStops            
}

var map = L.map('map', {
	center: [47.951, -122.215],
	zoom: 12,	
	layers: [base, transitStops, cleanupsites]
});

var layers = {
	'<svg width="25" height="20"><circle cx="15" cy="13" r="5" stroke="black" stroke-width="1.5" fill="#fff" /></svg><span>Transit Stops</span>': transitStops,			
	'<svg width="30" height="30"><circle cx="15" cy="15" r="10" stroke="black" stroke-width="1.5" fill="#fff" /></svg><span>Cleanup Sites</span>': cleanupsites,			
}

// create legend div
var legend = document.getElementById("legend")
for (item in config){
	var legitem = document.createElement("div")
	legitem.classList.add("legicon")
	legitem.style.background = config[item].color
	var legLabel = document.createElement("span")
	var text = document.createTextNode(config[item].name)
	legLabel.classList.add("legLabel")
	legLabel.appendChild(text)
	legend.appendChild(legitem)
	legend.appendChild(legLabel)
}

L.control.layers(basemaps, layers, {
	'collapsed': false,
	'hideSingleBase': true
}).addTo(map);

// layer selection
L.control.scale({
	maxWidth: 200
}).addTo(map)	