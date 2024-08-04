var Kartor_geojsonHandler = (function() {
    var layerIsActive = {
        'Allmän jakt: Däggdjur': false,
        'Allmän jakt: Fågel': false,
        'Algforvaltningsomrade': false,
        'Älgjaktsområden': false
    };

    var geojsonLayers = {
        'Allmän jakt: Däggdjur': [],
        'Allmän jakt: Fågel': [],
        'Algforvaltningsomrade': null, // Ändrat till null
        'Älgjaktsområden': null
    };

    var layerStyles = {
        'Allmän jakt: Däggdjur': {
            'Rvjaktilvdalenskommun_1.geojson': { fillColor: 'orange', color: 'rgb(50, 94, 88)', weight: 2, dashArray: '5, 10', fillOpacity: 0.001 },
            'Allman_jakt_daggdjur_2.geojson': { fillColor: 'blue', color: 'rgb(50, 94, 88)', weight: 2, fillOpacity: 0.001 }
        },
        'Allmän jakt: Fågel': {
            'Lnsindelning_1.geojson': { fillColor: 'yellow', color: 'rgb(50, 94, 88)', weight: 2, fillOpacity: 0.001 },
            'Grnsfrripjaktilvdalenskommun_2.geojson': { fillColor: 'rgb(50, 94, 88)', color: 'rgb(50, 94, 88)', weight: 2, dashArray: '5, 10', fillOpacity: 0.001 },
            'GrnslvsomrdetillFinland_5.geojson': { fillColor: 'blue', color: 'blue', weight: 8, fillOpacity: 0.5, dashArray: '5, 10' },
            'NedanfrLappmarksgrnsen_3.geojson': { fillColor: '#fdae61', color: '#edf8e9', weight: 2, fillOpacity: 0.5, dashArray: '5, 10' },
            'OvanfrLapplandsgrnsen_4.geojson': { fillColor: '#a6d96a', color: '#edf8e9', weight: 2, fillOpacity: 0.5 }
        }
    };

    var currentWMSLayer = null;
    var wmsClickHandler = null;

    function showZoomMessage() {
        var zoomMessage = document.getElementById('zoom-message');
        zoomMessage.style.display = 'block';
    }

    function hideZoomMessage() {
        var zoomMessage = document.getElementById('zoom-message');
        zoomMessage.style.display = 'none';
    }

    function checkZoomLevel() {
        if (map.getZoom() < 11) {
            showZoomMessage();
        } else {
            hideZoomMessage();
        }
    }

    async function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        for (const geojsonURL of geojsonURLs) {
            try {
                const response = await axios.get(geojsonURL);
                const geojson = response.data;
                const layer = L.geoJSON(geojson, {
                    style: function(feature) {
                        var filename = getFilenameFromURL(geojsonURL);
                        return layerStyles[layerName][filename].style ? layerStyles[layerName][filename].style(feature) : layerStyles[layerName][filename];
                    },
                    onEachFeature: function(feature, layer) {
                        addClickHandlerToLayer(layer);
                    }
                });

                geojsonLayers[layerName].push(layer);

                if (layerIsActive[layerName]) {
                    layer.addTo(map);
                }
            } catch (error) {
                console.error("Error fetching GeoJSON data.");
            }
        }

        updateFAB(layerName, true);
    }

    function addClickHandlerToLayer(layer) {
        layer.on('click', function(e) {
            if (e.originalEvent) {
                e.originalEvent.stopPropagation();
            }
            var properties = e.target.feature.properties;
            if (!popupPanelVisible) {
                showPopupPanel(properties);
            } else {
                updatePopupPanelContent(properties);
            }
        });
    }

    function toggleLayer(layerName, geojsonURLs) {
        // Check if the layer is already active
        if (layerIsActive[layerName]) {
            // If active, deactivate it
            layerIsActive[layerName] = false;
            deactivateLayer(layerName);
            return; // Exit the function
        }

        // If not active, proceed with deactivating all layers and activating the selected one
        deactivateAllLayersKartor();

        layerIsActive[layerName] = true;

        if (geojsonURLs) {
            fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs);
        } else if (layerName === 'Älgjaktsområden') {
            loadElgjaktWMS(true);
        } else if (layerName === 'Algforvaltningsomrade') {
            loadAlgforvaltningsomradeWMS(true); // Lägg till detta anrop
        }
    }

    function loadElgjaktWMS(add) {
        if (add) {
            if (currentWMSLayer) {
                console.log('Layer is already added. No action taken.');
                return;
            }
            checkZoomLevel();
            console.log('Adding Älgjaktsområden layer.');
            currentWMSLayer = L.tileLayer.wms('https://ext-geodata-applikationer.lansstyrelsen.se/arcgis/services/Jaktadm/lst_jaktadm_visning/MapServer/WMSServer', {
                layers: '2',
                format: 'image/png',
                transparent: true,
                attribution: 'Länsstyrelsen',
                opacity: 0.5
            }).addTo(map);

            wmsClickHandler = function(e) {
                handleWMSClick(e);
            };
            map.on('click', wmsClickHandler);

            // Lägg till händelse för att övervaka zoomnivån
            map.on('zoomend', checkZoomLevel);

            console.log("WMS layer added to map:", currentWMSLayer);
            updateFAB('Älgjaktsområden', true); // Säkerställ att FAB-knappen visas
        } else {
            if (currentWMSLayer) {
                console.log('Removing Älgjaktsområden layer.');
                map.off('click', wmsClickHandler);
                map.removeLayer(currentWMSLayer);
                currentWMSLayer = null;
                wmsClickHandler = null;
                hideZoomMessage(); // Dölj meddelandet när lagret tas bort
                map.off('zoomend', checkZoomLevel); // Ta bort händelsen för zoomnivån
                updateFAB('Älgjaktsområden', false); // Säkerställ att FAB-knappen döljs
            }
        }
    }

    function loadAlgforvaltningsomradeWMS(add) {
        if (add) {
            if (currentWMSLayer) {
                console.log('Layer is already added. No action taken.');
                return;
            }
            checkZoomLevel();
            console.log('Adding Algforvaltningsomrade layer.');
            currentWMSLayer = L.tileLayer.wms('https://ext-geodata-applikationer.lansstyrelsen.se/arcgis/services/Jaktadm/lst_jaktadm_visning/MapServer/WMSServer', {
                layers: '1',
                format: 'image/png',
                transparent: true,
                attribution: 'Länsstyrelsen',
                opacity: 0.5
            }).addTo(map);

            wmsClickHandler = function(e) {
                handleWMSClick(e);
            };
            map.on('click', wmsClickHandler);

            // Lägg till händelse för att övervaka zoomnivån
            map.on('zoomend', checkZoomLevel);

            console.log("WMS layer added to map:", currentWMSLayer);
            updateFAB('Algforvaltningsomrade', true); // Säkerställ att FAB-knappen visas
        } else {
            if (currentWMSLayer) {
                console.log('Removing Algforvaltningsomrade layer.');
                map.off('click', wmsClickHandler);
                map.removeLayer(currentWMSLayer);
                currentWMSLayer = null;
                wmsClickHandler = null;
                hideZoomMessage(); // Dölj meddelandet när lagret tas bort
                map.off('zoomend', checkZoomLevel); // Ta bort händelsen för zoomnivån
                updateFAB('Algforvaltningsomrade', false); // Säkerställ att FAB-knappen döljs
            }
        }
    }

    function handleWMSClick(e) {
        if (currentWMSLayer) {
            var latlng = e.latlng;
            var url = getFeatureInfoUrl(latlng, currentWMSLayer, map, {
                'info_format': 'text/xml',
                'propertyName': 'Områdesnamn,Områdesnummer'
            });

            console.log("GetFeatureInfo URL:", url);

            fetch(url)
                .then(response => response.text())
                .then(data => {
                    console.log("FeatureInfo data:", data);
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(data, "application/xml");
                    var fields = xmlDoc.getElementsByTagName("FIELDS")[0];
                    if (fields) {
                        var properties = {};
                        for (var i = 0; i < fields.attributes.length; i++) {
                            var attr = fields.attributes[i];
                            properties[attr.name] = attr.value;
                        }
                        if (!popupPanelVisible) {
                            showPopupPanel(properties);
                        } else {
                            updatePopupPanelContent(properties);
                        }
                    } else {
                        console.log("No features found.");
                    }
                })
                .catch(error => {
                    console.error("Error fetching feature info:", error);
                });
        }
    }

    function getFeatureInfoUrl(latlng, wmsLayer, map, params) {
        var point = map.latLngToContainerPoint(latlng, map.getZoom());
        var size = map.getSize();
        var bounds = map.getBounds();
        var crs = map.options.crs;

        var sw = crs.project(bounds.getSouthWest());
        var ne = crs.project(bounds.getNorthEast());

        var defaultParams = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: crs.code,
            styles: '',
            version: wmsLayer._wmsVersion,
            format: wmsLayer.options.format,
            bbox: sw.x + ',' + sw.y + ',' + ne.x + ',' + ne.y,
            height: size.y,
            width: size.x,
            layers: wmsLayer.wmsParams.layers,
            query_layers: wmsLayer.wmsParams.layers,
            info_format: 'application/json'
        };

        params = L.Util.extend(defaultParams, params);

        params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);
        params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);

        return wmsLayer._url + L.Util.getParamString(params, wmsLayer._url, true);
    }

    function deactivateAllLayersKartor() {
        Object.keys(layerIsActive).forEach(function(layerName) {
            if (layerIsActive[layerName]) {
                layerIsActive[layerName] = false;
                deactivateLayer(layerName);
            }
        });

        hideAllFABs(); // Lägg till detta för att dölja alla FAB-knappar
    }

    function hideAllFABs() {
        var fabButtons = document.querySelectorAll('.fab');
        fabButtons.forEach(function(button) {
            button.style.display = 'none';
        });
    }

    function deactivateLayer(layerName) {
        if (geojsonLayers[layerName]) {
            if (Array.isArray(geojsonLayers[layerName])) {
                geojsonLayers[layerName].forEach(function(layer) {
                    map.removeLayer(layer);
                });
                geojsonLayers[layerName] = [];
            } else {
                map.removeLayer(geojsonLayers[layerName]);
                geojsonLayers[layerName] = null;
            }
        }

        // Specifically handle WMS layer deactivation
        if ((layerName === 'Älgjaktsområden' || layerName === 'Algforvaltningsomrade') && currentWMSLayer) {
            console.log('Specifically removing ' + layerName + ' layer.');
            map.off('click', wmsClickHandler);
            map.removeLayer(currentWMSLayer);
            currentWMSLayer = null;
            wmsClickHandler = null;
            hideZoomMessage(); // Dölj meddelandet när lagret tas bort
            map.off('zoomend', checkZoomLevel); // Ta bort händelsen för zoomnivån
        }
    }

    function updateFAB(layerName, show) {
        // Hide all FAB buttons
        var fabButtons = document.querySelectorAll('.fab');
        fabButtons.forEach(function(button) {
            button.style.display = 'none';
        });

        // Show the correct FAB button
        var fabId = getFABId(layerName);
        var fabButton = document.getElementById(fabId);
        if (fabButton) {
            fabButton.style.display = show ? 'block' : 'none';
        }
    }

    function getFABId(layerName) {
        switch(layerName) {
            case 'Allmän jakt: Däggdjur':
                return 'fab-daggdjur';
            case 'Allmän jakt: Fågel':
                return 'fab-fagel';
            case 'Algforvaltningsomrade':
                return 'fab-alg';
            case 'Älgjaktsområden':
                return 'fab-alg-omraden';
            default:
                return '';
        }
    }

    function getFilenameFromURL(url) {
        return url.substring(url.lastIndexOf('/') + 1);
    }

function generatePopupContent(properties) {
    var content = '<div style="max-width: 300px; overflow-y: auto;">';

    for (var prop in properties) {
        if (properties.hasOwnProperty(prop)) {
            var value = properties[prop];

            if (prop === 'BILD' && value && /\.(jpg|jpeg|png|gif)$/.test(value)) {
                content += '<p><img src="' + value + '" style="max-width: 100%;" alt="Bild"></p>';
            }
        }
    }

    content += '</div>';
    return content;
}


    return {
        toggleLayer: toggleLayer,
        loadElgjaktWMS: loadElgjaktWMS,
        loadAlgforvaltningsomradeWMS: loadAlgforvaltningsomradeWMS, // Lägg till denna export
        deactivateAllLayersKartor: deactivateAllLayersKartor
    };
})();

// Lägg till meddelandet till HTML
var zoomMessageDiv = document.createElement('div');
zoomMessageDiv.id = 'zoom-message';
zoomMessageDiv.innerText = 'Zooma in i kartan för att data ska visas';
document.body.appendChild(zoomMessageDiv);
