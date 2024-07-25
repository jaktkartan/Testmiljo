var layerURLs = {
    'Mässor': ['https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/Massor.geojson'],
    'Jaktkort': ['https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/jaktkort.geojson'],
    'Jaktskyttebanor': ['https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Upptack/jaktskyttebanor.geojson']
};

var Upptack_geojsonHandler;

setTimeout(function() {
    Upptack_geojsonHandler = (function(map) {
        var layerIsActive = {
            'Mässor': true,
            'Jaktkort': true,
            'Jaktskyttebanor': true
        };

        var geojsonLayers = {
            'Mässor': [],
            'Jaktkort': [],
            'Jaktskyttebanor': []
        };

        var layerStyles = {
            'Mässor': {
                iconUrl: 'bottom_panel/Upptack/bilder/massa_ikon.png',
                iconSize: [40, 40],
                fallbackStyle: {
                    fallbackIconUrl: 'bottom_panel/Upptack/bilder/punkt_massor.png',
                    fallbackIconSize: [15, 15]
                }
            },
            'Jaktkort': {
                iconUrl: 'bottom_panel/Upptack/bilder/jaktkort_ikon.png',
                iconSize: [40, 40],
                fallbackStyle: {
                    fallbackIconUrl: 'bottom_panel/Upptack/bilder/punkt_jaktkort.png',
                    fallbackIconSize: [15, 15]
                }
            },
            'Jaktskyttebanor': {
                iconUrl: 'https://github.com/jaktkartan/jaktkartan/blob/main/bilder/ikon_jaktskyttebanor.png?raw=true',
                iconSize: [40, 40],
                fallbackStyle: {
                    fallbackIconUrl: 'bottom_panel/Upptack/bilder/punkt_jaktskyttebanor.png',
                    fallbackIconSize: [15, 15]
                }
            }
        };

        function fetchGeoJSONDataAndCreateLayer(layerName, geojsonURLs) {
            geojsonURLs.forEach(function(geojsonURL) {
                axios.get(geojsonURL)
                    .then(function(response) {
                        var geojson = response.data;

                        var layer = L.geoJSON(geojson, {
                            pointToLayer: function(feature, latlng) {
                                var style = getMarkerStyle(layerName);
                                return L.marker(latlng, { icon: style.icon });
                            },
                            style: function(feature) {
                                return getFallbackStyle(layerName);
                            },
                            onEachFeature: function(feature, layer) {
                                var popupContent = generatePopupContent(feature, layerName);
                                layer.bindPopup(popupContent);
                            }
                        });

                        geojsonLayers[layerName].push(layer);

                        if (layerIsActive[layerName]) {
                            layer.addTo(map);
                        }

                        console.log(`Layer ${layerName} fetched and created.`);
                        updateFabUpptackVisibility(); // Uppdatera FAB-knappen när lager skapas
                    })
                    .catch(function(error) {
                        console.log("Error fetching GeoJSON data for " + layerName + ":", error.message);
                    });
            });
        }

        function toggleLayer(layerName) {
            console.log(`Toggling layer: ${layerName}`);
            if (layerName === 'Visa_allt') {
                activateAllLayers();
            } else if (layerName === 'Rensa_allt') {
                deactivateAllLayers();
            } else {
                filterLayer(layerName);
            }
            updateFabUpptackVisibility(); // Uppdatera FAB-knappen när lager togglas
        }

        function activateLayer(layerName) {
            console.log(`Activating layer: ${layerName}`);
            if (!geojsonLayers[layerName].length) {
                fetchGeoJSONDataAndCreateLayer(layerName, layerURLs[layerName]);
            } else {
                geojsonLayers[layerName].forEach(function(layer) {
                    layer.addTo(map);
                });
            }
            layerIsActive[layerName] = true;
            console.log(`Layer ${layerName} activated.`);
            updateFabUpptackVisibility(); // Uppdatera FAB-knappen när lager aktiveras
        }

        function deactivateLayer(layerName) {
            console.log(`Deactivating layer: ${layerName}`);
            geojsonLayers[layerName].forEach(function(layer) {
                map.removeLayer(layer);
            });
            layerIsActive[layerName] = false;
            console.log(`Layer ${layerName} deactivated.`);
            updateFabUpptackVisibility(); // Uppdatera FAB-knappen när lager avaktiveras
        }

        function activateAllLayers() {
            console.log("Activating all layers");
            Object.keys(layerURLs).forEach(function(layerName) {
                activateLayer(layerName);
            });
            updateFabUpptackVisibility();
        }

        function deactivateAllLayers() {
            console.log("Deactivating all layers");
            Object.keys(layerIsActive).forEach(function(name) {
                if (layerIsActive[name]) {
                    geojsonLayers[name].forEach(function(layer) {
                        map.removeLayer(layer);
                    });
                    layerIsActive[name] = false;
                }
            });
            updateFabUpptackVisibility();
        }

        function filterLayer(layerName) {
            console.log(`Filtering to layer: ${layerName}`);
            deactivateAllLayers();
            activateLayer(layerName);
        }

        function generatePopupContent(feature, layerName) {
            var popupContent = '<div style="max-width: 300px; overflow-y: auto;">';

            var fields = {
                'Mässor': ['NAMN', 'INFO', 'LINK', 'VAGBESKRIV'],
                'Jaktkort': ['Rubrik', 'Info', 'Link', 'VAGBESKRIV']
            };

            var hideProperties = [];
            var hideNameOnlyProperties = fields[layerName] || [];

            for (var prop in feature.properties) {
                if (hideProperties.includes(prop)) continue;
                var value = feature.properties[prop];

                if (prop === 'BILD' && value) {
                    popupContent += '<p><img src="' + value + '" style="max-width: 100%;" alt="Bild"></p>';
                } else if (prop === 'LINK' || prop === 'Link') {
                    if (value) {
                        popupContent += '<p><a href="' + value + '" target="_blank">Länk</a></p>';
                    }
                } else if (prop === 'VAGBESKRIV' || prop === 'VägBeskrivning') {
                    if (value) {
                        popupContent += '<p><a href="' + value + '" target="_blank">Vägbeskrivning</a></p>';
                    }
                } else if (hideNameOnlyProperties.includes(prop) && value) {
                    popupContent += '<p>' + value + '</p>';
                } else if (value) {
                    popupContent += '<p><strong>' + prop + ':</strong> ' + value + '</p>';
                }
            }

            popupContent += '</div>';
            return popupContent;
        }

        function getIconAnchor(iconSize) {
            return [iconSize[0] / 2, iconSize[1] / 2];
        }

        function getMarkerStyle(layerName) {
            var zoomLevel = map.getZoom();
            var style;

            if (zoomLevel >= 7 && zoomLevel <= 18) {
                style = {
                    icon: L.icon({
                        iconUrl: layerStyles[layerName].iconUrl,
                        iconSize: layerStyles[layerName].iconSize,
                        iconAnchor: getIconAnchor(layerStyles[layerName].iconSize),
                        popupAnchor: [0, -layerStyles[layerName].iconSize[1] / 2]
                    })
                };
            } else {
                style = {
                    icon: L.icon({
                        iconUrl: layerStyles[layerName].fallbackStyle.fallbackIconUrl,
                        iconSize: layerStyles[layerName].fallbackStyle.fallbackIconSize,
                        iconAnchor: getIconAnchor(layerStyles[layerName].fallbackStyle.fallbackIconSize),
                        popupAnchor: [0, -layerStyles[layerName].fallbackStyle.fallbackIconSize[1] / 2]
                    })
                };
            }

            return style;
        }

        function getFallbackStyle(layerName) {
            return layerStyles[layerName].fallbackStyle;
        }

        function updateFabUpptackVisibility() {
            var anyLayerActive = Object.values(layerIsActive).some(isActive => isActive === true);
            var fabUpptackButton = document.getElementById('fab-upptack');
            if (anyLayerActive) {
                fabUpptackButton.style.display = 'flex';
                fabUpptackButton.classList.add('show'); // Lägg till 'show' klass för säkerhets skull
                console.log("FAB button set to display: flex");
            } else {
                fabUpptackButton.style.display = 'none';
                fabUpptackButton.classList.remove('show'); // Ta bort 'show' klass för säkerhets skull
                console.log("FAB button set to display: none");
            }
            console.log(`FAB button visibility updated: ${anyLayerActive ? 'visible' : 'hidden'}`);
        }

        // Initialisera alla lager från början och uppdatera FAB-knappen
        activateAllLayers();

        map.on('zoomend', function() {
            Object.keys(geojsonLayers).forEach(function(layerName) {
                geojsonLayers[layerName].forEach(function(layer) {
                    var zoomLevel = map.getZoom();
                    layer.eachLayer(function(marker) {
                        var style = getMarkerStyle(layerName);
                        marker.setIcon(style.icon);
                    });
                });
            });
        });

        document.getElementById('fab-upptack').addEventListener('click', function() {
            var modal = document.getElementById('modal-upptack');
            modal.classList.toggle('show');
        });

        return {
            toggleLayer: toggleLayer,
            deactivateAllLayers: deactivateAllLayers,
            activateAllLayers: activateAllLayers,
            activateLayer: activateLayer
        };
    })(map);
}, 1000);
