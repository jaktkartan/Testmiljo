// Jämför användarens sparade position med länspolygoner
function findCountyForCoordinates(latitude, longitude, geojson) {
    if (!geojson || !geojson.features) {
        console.error('GeoJSON data is invalid.');
        return 'Okänt län';
    }

    console.log('Latitude:', latitude, 'Longitude:', longitude); // Logga koordinaterna

    for (let feature of geojson.features) {
        console.log('Feature properties:', feature.properties); // Logga feature properties för felsökning

        if (feature.geometry && feature.geometry.type === 'MultiPolygon') {
            for (let polygon of feature.geometry.coordinates) {
                if (isPointInPolygon([longitude, latitude], polygon)) {
                    console.log('Match found in polygon for county:', feature.properties["LÄN"]);
                    return feature.properties["LÄN"]; // Använd korrekt fält
                }
            }
        }
    }

    console.log('No match found for coordinates.');
    return 'Okänt län'; // Om ingen matchning hittades
}

// Funktion för att avgöra om en punkt ligger inuti en polygon
function isPointInPolygon(point, polygon) {
    if (!polygon || polygon.length === 0 || polygon[0].length === 0) {
        console.error('Polygon data is invalid.');
        return false;
    }

    let x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = polygon[0].length - 1; i < polygon[0].length; j = i++) {
        let xi = polygon[0][i][0], yi = polygon[0][i][1];
        let xj = polygon[0][j][0], yj = polygon[0][j][1];

        let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    console.log('Point:', point, 'inside polygon:', inside);
    return inside;
}

// Hämta användarens sparade position från localStorage
function getSavedUserPosition() {
    var storedPosition = localStorage.getItem('lastKnownPosition');
    if (storedPosition) {
        var { latitude, longitude } = JSON.parse(storedPosition);
        return { latitude, longitude };
    } else {
        return null; // Returnera null om ingen position är sparad
    }
}

// Visa användarens sparade position i fliken
function displaySavedUserPosition() {
    var savedPosition = getSavedUserPosition();
    if (savedPosition) {
        var tab = document.getElementById('tab3');
        tab.innerHTML = '';

        // Ladda GeoJSON-filen och avgör län baserat på sparade koordinater
        loadGeoJSON('bottom_panel/Jaktbart_idag/Corrected_Sveriges_lan.geojson')
            .then(geojson => {
                if (!geojson) {
                    console.error('GeoJSON is null or undefined.');
                    var errorInfo = document.createElement('p');
                    errorInfo.textContent = 'Fel vid laddning av GeoJSON.';
                    tab.appendChild(errorInfo);
                    return;
                }

                console.log('GeoJSON loaded:', geojson); // Logga GeoJSON-datan

                var county = findCountyForCoordinates(savedPosition.latitude, savedPosition.longitude, geojson);

                // Visa länet i tabben
                var countyInfo = document.createElement('p');
                countyInfo.textContent = `Du befinner dig i: ${county}`;
                tab.appendChild(countyInfo);
            })
            .catch(error => {
                console.error('Error loading GeoJSON:', error);
                var errorInfo = document.createElement('p');
                errorInfo.textContent = 'Fel vid laddning av GeoJSON.';
                tab.appendChild(errorInfo);
            });
    } else {
        console.log("Ingen sparad position hittades.");
    }
}

// Funktion för att ladda GeoJSON-filen
async function loadGeoJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to load GeoJSON file');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading GeoJSON:', error);
        return null;
    }
}

// Kör funktionen för att visa användarens sparade position
displaySavedUserPosition();
