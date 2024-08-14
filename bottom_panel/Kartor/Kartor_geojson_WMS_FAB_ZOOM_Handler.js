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
        'Algforvaltningsomrade': null, 
        'Älgjaktsområden': null
    };

    var layerStyles = {
        'Allmän jakt: Däggdjur': {
            'Rvjaktilvdalenskommun_1.geojson': { fillColor: 'orange', color: 'rgb(50, 94, 88)', weight: 2, dashArray: '5, 10', fillOpacity: 0.001 },
            'Allman_jakt_daggdjur_2.geojson': { fillColor: 'blue', color: 'rgb(50, 94, 88)', weight: 2, fillOpacity: 0.001 }
        },
        'Allmän jakt: Fågel': {
            'Allman_jakt_fagel.geojson': { fillColor: 'yellow', color: 'rgb(50, 94, 88)', weight: 2, fillOpacity: 0.001 },
            'Grnsfrripjaktilvdalenskommun_2.geojson': { fillColor: 'rgb(50, 94, 88)', color: 'rgb(50, 94, 88)', weight: 2, dashArray: '5, 10', fillOpacity: 0.001 },
            'GrnslvsomrdetillFinland_5.geojson': { fillColor: 'blue', color: 'blue', weight: 8, fillOpacity: 0.5, dashArray: '5, 10' },
            'NedanfrLappmarksgrnsen_3.geojson': { fillColor: '#fdae61', color: '#edf8e9', weight: 2, fillOpacity: 0.5, dashArray: '5, 10' },
            'OvanfrLapplandsgrnsen_4.geojson': { fillColor: '#a6d96a', color: '#edf8e9', weight: 2, fillOpacity: 0.5 }
        }
    };

    var currentWMSLayer = null;
    var wmsClickHandler = null;
    var loadingMessageDiv = document.getElementById('loadingMessage');

    function showLoadingMessage() {
        console.log("Attempting to show loading message");
        if (loadingMessageDiv && loadingMessageDiv.style.display !== 'block') {
            loadingMessageDiv.style.display = 'block';
            
            // Lägg till CSS-styling för videon
            var videoElement = loadingMessageDiv.querySelector('video');
            if (videoElement) {
                videoElement.style.clipPath = "inset(1px 1px 1px 1px)";
                videoElement.style.borderRadius = "10px";
            }

            console.log("Loading message shown, display:", loadingMessageDiv.style.display);
        } else {
            console.log("Loading message NOT shown, current display:", loadingMessageDiv ? loadingMessageDiv.style.display : "No div found");
        }
    }

    function hideLoadingMessage() {
        console.log("Attempting to hide loading message");
        if (loadingMessageDiv && loadingMessageDiv.style.display === 'block') {
            loadingMessageDiv.style.display = 'none';
            console.log("Loading message hidden, display:", loadingMessageDiv.style.display);
        } else {
            console.log("Loading message NOT hidden, current display:", loadingMessageDiv ? loadingMessageDiv.style.display : "No div found");
        }
    }

    function showZoomMessage() {
        var zoomMessage = document.getElementById('zoom-message');
        zoomMessage.style.display = 'block';
    }

    function hideZoomMessage() {
        var zoomMessage = document.getElementById('zoom-message');
        zoomMessage.style.display = 'none';
    }

    function checkZoomLevel() {
        if (map.getZoom() < 11 && layerIsActive['Älgjaktsområden']) {
            showZoomMessage();
        } else {
            hideZoomMessage();
        }
    }

    async function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
        console.log("Starting to fetch GeoJSON data for", layerName);
        showLoadingMessage(); // Show loading message while fetching data
        try {
            for (const geojsonURL of geojsonURLs) {
                console.log("Fetching GeoJSON from:", geojsonURL);
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
                console.log("Layer added to map for", layerName);
            }
        } catch (error) {
            console.error("Error fetching GeoJSON data for", layerName, error);
        } finally {
            hideLoadingMessage(); // Hide loading message when data is done loading, whether successful or not
            console.log("Finished fetching GeoJSON data for", layerName);
        }
        updateFABVisibility(layerName, true); // Uppdatera FAB-knappen när lagret har laddats
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
    console.log("Toggling layer:", layerName);
    if (layerIsActive[layerName]) {
        layerIsActive[layerName] = false;
        deactivateLayer(layerName);
        hideLoadingMessage();  // Hide the loading message if the layer is deactivated
        return;
    }

    deactivateAllLayersKartor();
    layerIsActive[layerName] = true;

    if (geojsonURLs) {
        fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs); // Loading message is shown within this function
    } else if (layerName === 'Älgjaktsområden') {
        loadElgjaktWMS(true);
    } else if (layerName === 'Algforvaltningsomrade') {
        loadAlgforvaltningsomradeWMS(true); // Visa laddningsbild när WMS-lagret laddas
    }
}

function loadElgjaktWMS(add) {
    if (add) {
        if (currentWMSLayer) {
            console.log('Layer is already added. No action taken.');
            return;
        }
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
        map.on('zoomend', checkZoomLevel);

        checkZoomLevel(); // Kontrollera zoomnivån när lagret laddas

        updateFABVisibility('Älgjaktsområden', true); // Uppdatera FAB-knappen
    } else {
        if (currentWMSLayer) {
            console.log('Removing Älgjaktsområden layer.');
            map.off('click', wmsClickHandler);
            map.removeLayer(currentWMSLayer);
            currentWMSLayer = null;
            wmsClickHandler = null;
            hideZoomMessage();
            map.off('zoomend', checkZoomLevel);

            updateFABVisibility('Älgjaktsområden', false); // Uppdatera FAB-knappen
        }
    }
}

function loadAlgforvaltningsomradeWMS(add) {
    if (add) {
        if (currentWMSLayer) {
            console.log('Layer is already added. No action taken.');
            return;
        }
        
        showLoadingMessage(); // Visa laddningsbilden

        console.log('Adding Algforvaltningsomrade layer.');
        currentWMSLayer = L.tileLayer.wms('https://ext-geodata-applikationer.lansstyrelsen.se/arcgis/services/Jaktadm/lst_jaktadm_visning/MapServer/WMSServer', {
            layers: '0',
            format: 'image/png',
            transparent: true,
            attribution: 'Länsstyrelsen',
            opacity: 0.5
        });

        // När lagret har laddats, dölja laddningsbilden
        currentWMSLayer.on('load', function() {
            hideLoadingMessage();
            console.log("WMS layer loaded for Algforvaltningsomrade.");
        });

        // Lägg till lagret på kartan
        currentWMSLayer.addTo(map);

        wmsClickHandler = function(e) {
            handleWMSClick(e);
        };
        map.on('click', wmsClickHandler);

        updateFABVisibility('Algforvaltningsomrade', true); // Uppdatera FAB-knappen
    } else {
        if (currentWMSLayer) {
            console.log('Removing Algforvaltningsomrade layer.');
            map.off('click', wmsClickHandler);
            map.removeLayer(currentWMSLayer);
            currentWMSLayer = null;
            wmsClickHandler = null;

            updateFABVisibility('Algforvaltningsomrade', false); // Uppdatera FAB-knappen
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

        if ((layerName === 'Älgjaktsområden' || layerName === 'Algforvaltningsomrade') && currentWMSLayer) {
            map.off('click', wmsClickHandler);
            map.removeLayer(currentWMSLayer);
            currentWMSLayer = null;
            wmsClickHandler = null;
            hideZoomMessage();
            map.off('zoomend', checkZoomLevel);
        }
        updateFABVisibility(layerName, false); // Uppdatera FAB-knappen när lagret avaktiveras
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

    function updateFABVisibility(layerName, isActive) {
        let fabElement;
        
        if (layerName === 'Allmän jakt: Däggdjur') {
            fabElement = document.getElementById('fab-daggdjur');
        } else if (layerName === 'Allmän jakt: Fågel') {
            fabElement = document.getElementById('fab-fagel');
        } else if (layerName === 'Algforvaltningsomrade') {
            fabElement = document.getElementById('fab-alg');
        } else if (layerName === 'Älgjaktsområden') {
            fabElement = document.getElementById('fab-alg-omraden');
        }

        if (fabElement) {
            if (isActive) {
                fabElement.style.display = 'block';
            } else {
                fabElement.style.display = 'none';
            }
        }
    }

    return {
        toggleLayer: toggleLayer,
        loadElgjaktWMS: loadElgjaktWMS,
        loadAlgforvaltningsomradeWMS: loadAlgforvaltningsomradeWMS,
        deactivateAllLayersKartor: deactivateAllLayersKartor
    };
})();

// Lägg till meddelandet till HTML
var zoomMessageDiv = document.createElement('div');
zoomMessageDiv.id = 'zoom-message';
zoomMessageDiv.innerText = 'Zooma in i kartan för att data ska visas';
document.body.appendChild(zoomMessageDiv);

// Event listeners för FAB-knapparna
document.getElementById('fab-daggdjur').addEventListener('click', function() {
    var modal = document.getElementById('modal-daggdjur');
    modal.classList.toggle('show');
});

document.getElementById('fab-fagel').addEventListener('click', function() {
    var modal = document.getElementById('modal-fagel');
    modal.classList.toggle('show');
});

document.getElementById('fab-alg').addEventListener('click', function() {
    var modal = document.getElementById('modal-alg');
    modal.classList.toggle('show');
});

document.getElementById('fab-alg-omraden').addEventListener('click', function() {
    var modal = document.getElementById('modal-alg-omraden');
    modal.classList.toggle('show');
});
