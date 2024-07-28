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
        loadGeoJSON('bottom_panel/Jaktbart_idag/Sveriges_lan.geojson')
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



<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Jakttider</title>
    <style>
        /* Stil för notisen */
        #disclaimer {
            font-size: 0.9em;
            color: #666;
            margin-top: 10px;
        }
        /* Stil för länken i notisen */
        #disclaimer a {
            color: #007bff;
            text-decoration: none;
        }
        #disclaimer a:hover {
            text-decoration: underline;
        }
        /* Animation för att visa resultatet */
        .slide-down {
            animation: slideDown 0.5s ease-out;
        }
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body onload="initializePage()">
    <!-- Sidans titel -->
    <h1>Jakttider</h1>

    <!-- Notis för att informera användaren -->
    <div id="disclaimer">
        <p>Observera: Försäkra dig alltid om att informationen stämmer genom att kontrollera <a href="https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/jaktforordning-1987905_sfs-1987-905/" target="_blank">Bilaga 1 i Jaktförordningen (1987:905)</a>.</p>
    </div>

    <!-- Dropdown för att välja län -->
    <label for="county">Välj län:</label>
    <select id="county" onchange="getHuntingInfo()">
        <option value="Blekinge län">Blekinge län</option>
        <option value="Dalarnas län">Dalarnas län</option>
        <option value="Gotlands län">Gotlands län</option>
        <option value="Gävleborgs län">Gävleborgs län</option>
        <option value="Hallands län">Hallands län</option>
        <option value="Jämtlands län">Jämtlands län</option>
        <option value="Jönköpings län">Jönköpings län</option>
        <option value="Kalmar län">Kalmar län</option>
        <option value="Kronobergs län">Kronobergs län</option>
        <option value="Norrbottens län">Norrbottens län</option>
        <option value="Skåne län">Skåne län</option>
        <option value="Stockholms län">Stockholms län</option>
        <option value="Södermanlands län">Södermanlands län</option>
        <option value="Uppsala län">Uppsala län</option>
        <option value="Värmlands län">Värmlands län</option>
        <option value="Västerbottens län">Västerbottens län</option>
        <option value="Västernorrlands län">Västernorrlands län</option>
        <option value="Västmanlands län">Västmanlands län</option>
        <option value="Västra Götalands län">Västra Götalands län</option>
        <option value="Örebro län">Örebro län</option>
        <option value="Östergötlands län">Östergötlands län</option>
    </select>
    <br>

    <!-- Datumväljare -->
    <label for="date">Välj datum:</label>
    <input type="date" id="date" name="date" onchange="getHuntingInfo()">
    <br>

    <!-- Div för att visa resultaten -->
    <div id="results"></div>
    <br>

    <script>
        // Funktion för att hämta jaktdatan från en JSON-fil
        async function fetchHuntingData() {
            try {
                const response = await fetch('bottom_panel/Jaktbart_idag/jakttider.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching hunting data:", error);
                return [];
            }
        }

        // Månader på svenska och engelska för översättning
        const months = {
            'January': 'Januari',
            'February': 'Februari',
            'March': 'Mars',
            'April': 'April',
            'May': 'Maj',
            'June': 'Juni',
            'July': 'Juli',
            'August': 'Augusti',
            'September': 'September',
            'October': 'Oktober',
            'November': 'November',
            'December': 'December'
        };

        const monthsReverse = {
            'Januari': '01',
            'Februari': '02',
            'Mars': '03',
            'April': '04',
            'Maj': '05',
            'Juni': '06',
            'Juli': '07',
            'Augusti': '08',
            'September': '09',
            'Oktober': '10',
            'November': '11',
            'December': '12'
        };

        // Funktion för att översätta månadsnamn från engelska till svenska och vice versa
        function translateMonth(monthName) {
            return months[monthName] || Object.keys(monthsReverse).find(key => monthsReverse[key] === monthName);
        }

        // Funktion för att formatera datum för visning
        function formatDateForDisplay(dateString) {
            const [day, month] = dateString.split(' ');
            const translatedMonth = translateMonth(month);
            return `${parseInt(day)} ${translatedMonth}`;
        }

        // Funktion för att parsa datum utan år
        function parseDateWithoutYear(dateString) {
            const [day, month] = dateString.split(' ');
            const monthNumber = monthsReverse[translateMonth(month)];
            if (!monthNumber) {
                console.error(`Invalid month: ${month}`);
                return null;
            }
            return `${monthNumber}-${day.padStart(2, '0')}`;
        }

        // Funktion för att kontrollera om ett datum är inom ett datumintervall
        function isWithinDateRange(startDate, endDate, checkDate) {
            const check = new Date(checkDate);
            const checkMonthDay = `${(check.getMonth() + 1).toString().padStart(2, '0')}-${check.getDate().toString().padStart(2, '0')}`;

            const [startDay, startMonth] = startDate.split(' ');
            const [endDay, endMonth] = endDate.split(' ');

            const startMonthDay = `${monthsReverse[translateMonth(startMonth)]}-${startDay.padStart(2, '0')}`;
            const endMonthDay = `${monthsReverse[translateMonth(endMonth)]}-${endDay.padStart(2, '0')}`;

            if (startMonthDay <= endMonthDay) {
                return startMonthDay <= checkMonthDay && checkMonthDay <= endMonthDay;
            } else {
                return startMonthDay <= checkMonthDay || checkMonthDay <= endMonthDay;
            }
        }

        // Funktion för att formatera resultatet för visning
        function formatResult(result, county) {
            let extraInfo = result['Upplysning'];
            // Kontrollera om specifika upplysningar ska döljas
            if (county !== 'Norrbottens län' && extraInfo.includes('Gäller utom gränsälvsområdet')) {
                extraInfo = '';
            }
            if (county !== 'Dalarnas län' && extraInfo.includes('Gäller ej Älvdalens kommun, se separat jakttid')) {
                extraInfo = '';
            }

            return `
                <div class="result-item">
                    <h3>${result['Slag av vilt']}</h3>
                    <p><strong>Starttid:</strong> ${formatDateForDisplay(result['Starttid'])}</p>
                    <p><strong>Sluttid:</strong> ${formatDateForDisplay(result['Sluttid'])}</p>
                    ${extraInfo ? `<p><strong>Upplysning:</strong> ${extraInfo}</p>` : ''}
                </div>
            `;
        }

        // Funktion för att hämta och visa jakttider baserat på valda län och datum
        async function getHuntingInfo() {
            const county = document.getElementById('county').value.trim();
            const date = document.getElementById('date').value;

            if (!county || !date) {
                document.getElementById('results').innerHTML = "Vänligen välj både län och datum.";
                return;
            }

            const data = await fetchHuntingData();

            if (data.length === 0) {
                document.getElementById('results').innerHTML = "Inga resultat funna.";
                return;
            }

            // Filtrera resultat baserat på valt län och datum
            const results = data.filter(entry => {
                const areas = entry['Område'].split(',');
                const isInCounty = areas.some(area => area.trim() === county || area.trim() === "Alla län");
                const isInDateRange = isWithinDateRange(entry['Starttid'], entry['Sluttid'], date);
                return isInCounty && isInDateRange;
            });

            // Sortera resultatet
            results.sort((a, b) => {
                if (a['Grupp'] === b['Grupp']) {
                    return a['Slag av vilt'].localeCompare(b['Slag av vilt']);
                } else {
                    const groupOrder = ['Däggdjur', 'Fågelarter'];
                    return groupOrder.indexOf(a['Grupp']) - groupOrder.indexOf(b['Grupp']);
                }
            });

            // Organisera resultatet med rubriker för Däggdjur och Fågelarter
            let mammalResults = '';
            let birdResults = '';

            results.forEach(result => {
                if (result['Grupp'] === 'Däggdjur') {
                    if (mammalResults === '') {
                        mammalResults += '<h2>Däggdjur:</h2>';
                    }
                    mammalResults += formatResult(result, county);
                } else if (result['Grupp'] === 'Fågelarter') {
                    if (birdResults === '') {
                        birdResults += '<h2>Fågelarter:</h2>';
                    }
                    birdResults += formatResult(result, county);
                }
            });

            // Visa resultatet
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = mammalResults + birdResults || "Inga resultat funna.";

            // Lägg till slide-down animation
            const resultItems = resultsDiv.querySelectorAll('.result-item');
            resultItems.forEach(item => {
                item.classList.add('slide-down');
            });
        }

        // Funktion för att initiera sidan med dagens datum och visa resultatet
        function initializePage() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('date').value = today;
            getHuntingInfo();
        }
    </script>
</body>
</html>
