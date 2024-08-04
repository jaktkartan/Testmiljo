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

function loadAlgjaktskartanWMS(add) {
    if (add) {
        if (currentWMSLayer) {
            console.log('Layer is already added. No action taken.');
            return;
        }
        checkZoomLevel();
        console.log('Adding Älgjaktskartan layer.');
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
        updateFAB('Älgjaktskartan', true); // Säkerställ att FAB-knappen visas
    } else {
        if (currentWMSLayer) {
            console.log('Removing Älgjaktskartan layer.');
            map.off('click', wmsClickHandler);
            map.removeLayer(currentWMSLayer);
            currentWMSLayer = null;
            wmsClickHandler = null;
            hideZoomMessage(); // Dölj meddelandet när lagret tas bort
            map.off('zoomend', checkZoomLevel); // Ta bort händelsen för zoomnivån
            updateFAB('Älgjaktskartan', false); // Säkerställ att FAB-knappen döljs
        }
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
