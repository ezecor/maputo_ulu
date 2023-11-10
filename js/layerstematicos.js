var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
});
var osm_mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
var osm_topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
var map = L.map('map', {
    center: [-25.9, 32.7],
    //minZoom: 11,
    //maxZoom: 13,
    zoom: 12,
    layers: [CartoDB_Positron]
});
var baseMaps = {
    "CartoDB": CartoDB_Positron,
    "OpenStreetMap": osm_mapnik,
    "OpenTopoMap": osm_topo,
    "Satélite": Esri_WorldImagery
};
//Layers temáticos
var uso1964 = L.geoJSON(uso_1964, {
    style: ulu_style,
    zindex: 2,
    onEachFeature: atributos
}); 
var uso1973 = L.geoJSON(uso_1973, {
    style: ulu_style,
    zindex: 2,
    onEachFeature: atributos
});
var uso1982 = L.geoJSON(uso_1982, {
    style: ulu_style,
    zindex: 2,
    onEachFeature: atributos
});
var uso1991 = L.geoJSON(uso_1991, {
    style: ulu_style,
    zindex: 2,
    onEachFeature: atributos
});
var uso2001 = L.geoJSON(uso_2001, {
    style: ulu_style,
    zindex: 2,
    onEachFeature: atributos
}).addTo(map);

var overlayMaps = {
    "Year":{
        "1964": uso1964,
        "1973": uso1973,
        "1982": uso1982,        
        "1991": uso1991,
        "2001": uso2001        
    }
};

var options = {
    exclusiveGroups: ["Year"],
    groupCheckboxes: true,
    collapsed: false
};
var layerControl = L.control.groupedLayers(baseMaps, overlayMaps, options);
map.addControl(layerControl);

//Extent
var bounds = uso2001.getBounds();
map.fitBounds(uso2001.getBounds());
map.setMaxBounds(bounds);

// Carrega os atributos para: tooltip, caixa de texto
function atributos(feature, layer) {
      layer.bindTooltip(feature.properties.N_I_D_EN);
}
//Simbologia dos layers temáticos
function ulu_style(feature) {
  //L.polygon(feature, {fill:"url(./img/s24.png)"}).addTo(map);
  
  var classe = feature.properties.N_I_C;
  if (classe == "1.0") {
    return {
      fill: "url(./img/s101.png)",
      weight: 0.0,
      opacity: 1,
      fillOpacity: 0.8
    };
  } else if (classe == "2.4") {
      return {
        
          //fill: "url(./img/s24.png)",
        //fillColor: "black",
        weight: 0.0,
        opacity: 1,
        fillOpacity: 0.8      
      };
  } else {
      return {
        fillColor: ulu_color(feature.properties.N_I_C),
        weight: 0.0,
        opacity: 1,
        fillOpacity: 0.8
      };     
  }     
}

function ulu_color(d) {
    //if(d == 1.0) return "./img/symb1_1.gif";
    if(d == "2.1") return "#cc0000";
    if(d == "2.2") return "#e63b00";
    if(d == "2.3") return "#ff9600";
    //if(d == 2.4) return "#fdae61";
    if(d == "3.0") return "#ffe414";
    if(d == "4.0") return "#003246";
    if(d == "5.0") return "#d7c29e";
    if(d == "6.0") return "#7cb8bf";
    if(d == "7.0") return "#737300";
    return "#d73027";  
}

var leg_UsoSolo = L.control({position: "bottomright"});
leg_UsoSolo.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legenda");
    div.innerHTML =
    'Level I<br>' +
    '<div style="background-image: url(./img/s101.png)"></div>Mixed-uses<br>' +
    '<div style="background-color: #cc0000"></div>Residential, fully infrastructure<br>' +
    '<div style="background-color: #e63b00"></div>Residential, patially deprived<br>' +
    '<div style="background-color: #ff9600"></div>Residential, deprived<br>' +
    '<div style="background-image: url(./img/s24.png)"></div>Residential emergent areas<br>' +
    '<div style="background-color: #ffe414"></div>Economic activity<br>' + 
    '<div style="background-color: #003246"></div>Facilities, infrastructure, and public services<br>' +
    '<div style="background-color: #d7c29e"></div>Vacant and derelict areas<br>' +
    '<div style="background-color: #7cb8bf"></div>Water bodies and floodable areas<br>' +
    '<div style="background-color: #737300"></div>Other natural, semi-natural and leisure areas<br>';          
    return div;
  };  

leg_UsoSolo.addTo(map);

// Escala
L.control.scale({
  position: 'bottomleft',
  //position: 'right',
  imperial: false
}).addTo(map);

map.attributionControl.setPrefix(
    '&copy; <a href="https://luco.fa.ulisboa.pt"><i>LUCO</i></a>' + ' | <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
);