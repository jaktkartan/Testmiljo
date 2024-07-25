function loadElgjaktsomradenWMS() {
    // Funktion för att generera en slumpmässig färg i en naturlig nyans
    function getRandomColor() {
        var hue = Math.floor(Math.random() * 360); // Färgton
        var lightness = Math.floor(Math.random() * 40) + 40; // Ljushet från 40 till 80
        return `hsl(${hue}, 70%, ${lightness}%)`;
    }

    // Färgcache för att bevara färger för varje feature
    var colorCache = {};

    // Skapa FeatureLayer
    var featureLayer = L.esri.featureLayer({
        url: 'https://ext-geodata-applikationer.lansstyrelsen.se/arcgis/rest/services/Jaktadm/lst_jaktadm_visning/MapServer/0',
        style: function (feature) {
            // Om feature inte redan har en färg i cache, generera och spara i cache
            if (!colorCache[feature.id]) {
                colorCache[feature.id] = getRandomColor();
            }
            return {
                color: colorCache[feature.id], // Kantfärg
                weight: 2, // Kantens tjocklek
                opacity: 1, // Kantens opacitet
                fillColor: colorCache[feature.id], // Fyllningsfärg
                fillOpacity: 0.5 // Konstant transparens på fyllningen
            };
        },
        onEachFeature: function (feature, layer) {
            // Bygg en HTML-tabell med attributdata
            var popupContent = '<table class="popup-table">';
            if (feature.properties) {
                for (var key in feature.properties) {
                    if (feature.properties.hasOwnProperty(key)) {
                        popupContent += '<tr><th>' + key + '</th><td>' + feature.properties[key] + '</td></tr>';
                    }
                }
            }
            popupContent += '</table>';
            
            // Bind popup med HTML-tabellen
            layer.bindPopup(popupContent);
        },
        // Hämta endast de polygoner som finns inom det aktuella kartutsnittet
        where: "1=1",
        useCors: false
    });

    // Lägg till FeatureLayer till kartan
    window.map.addLayer(featureLayer);

    // Funktion som uppdaterar datalagret baserat på kartans bounding box
    function updateFeatureLayer() {
        var bounds = window.map.getBounds();
        var query = featureLayer.createQuery();
        query.intersects(bounds);
        featureLayer.queryFeatures(query, function (error, featureCollection) {
            if (error) {
                console.error('Error querying features:', error);
                return;
            }
            featureLayer.clearLayers();
            featureLayer.addData(featureCollection.features);
        });
    }

    // Uppdatera datalagret när användaren panorerar eller zoomar
    window.map.on('moveend', updateFeatureLayer);

    // Initial uppdatering när kartan först laddas
    updateFeatureLayer();
}
