<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaflet Karta med WMS Lager</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        #map {
            width: 100%;
            height: 600px;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        // Skapa en karta och sätt standardvyn
        var map = L.map('map').setView([63.0, 16.0], 5);

        // Lägg till OSM Standard-baskarta
        var osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors, CC-BY-SA'
        }).addTo(map);

        // Lägg till WMS-lager för Älgjaktområden
        var wmsUrl = "https://ext-geodata-applikationer.lansstyrelsen.se/arcgis/services/Jaktadm/lst_jaktadm_visning/MapServer/WMSServer";
        var algjaktomraden = L.tileLayer.wms(wmsUrl, {
            layers: '2',
            format: 'image/png',
            transparent: true,
            opacity: 0.35,
            version: '1.3.0',
            attribution: ''
        }).addTo(map);

        // Lägg till lagerkontroll
        var baseMaps = {
            "OSM Standard": osmStandard
        };

        var overlayMaps = {
            "Älgjaktområden": algjaktomraden
        };

        L.control.layers(baseMaps, overlayMaps).addTo(map);

        // Kontrollera om WMS-lagret är tillgängligt
        algjaktomraden.on('tileerror', function(error, tile) {
            console.error('WMS layer could not be loaded:', error);
            alert('Failed to load WMS layer. Please check the WMS URL and parameters.');
        });

        // Lägg till en funktionslogg för att se om WMS-lagret laddas korrekt
        console.log('Map initialized and layers added.');

    </script>
</body>
</html>
