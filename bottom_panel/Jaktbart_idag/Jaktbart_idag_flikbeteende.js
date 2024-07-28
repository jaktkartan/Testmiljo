document.addEventListener('DOMContentLoaded', () => {
    // Skapa HTML-strukturen
    document.body.innerHTML = `
        <h1>Jakttider</h1>

        <div id="disclaimer">
            <p>Observera: Försäkra dig alltid om att informationen stämmer genom att kontrollera <a href="https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/jaktforordning-1987905_sfs-1987-905/" target="_blank">Bilaga 1 i Jaktförordningen (1987:905)</a>.</p>
        </div>

        <label for="county">Välj län:</label>
        <select id="county">
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

        <label for="date">Välj datum:</label>
        <input type="date" id="date">
        <br>

        <div id="results"></div>
    `;

    // Funktion för att hämta GeoJSON-data
    async function fetchGeoJSON() {
        try {
            const response = await fetch('bottom_panel/Jaktbart_idag/Sveriges_lan.geojson');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching GeoJSON data:", error);
            return null;
        }
    }

    // Funktion för att hämta jaktdatan
    async function fetchHuntingData() {
        try {
            const response = await fetch('bottom_panel/Jaktbart_idag/jakttider.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching hunting data:", error);
            return [];
        }
    }

    // Funktion för att kontrollera om en punkt ligger inom en polygon
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
        return inside;
    }

    // Funktion för att hitta län baserat på koordinater
    async function findCountyForCoordinates(latitude, longitude, geojson) {
        if (!geojson || !geojson.features) {
            console.error('GeoJSON data is invalid.');
            return 'Okänt län';
        }

        for (let feature of geojson.features) {
            if (feature.geometry && feature.geometry.type === 'MultiPolygon') {
                for (let polygon of feature.geometry.coordinates) {
                    if (isPointInPolygon([longitude, latitude], polygon)) {
                        return feature.properties["LÄN"];
                    }
                }
            }
        }
        return 'Okänt län';
    }

    // Funktion för att översätta månadsnamn
    function translateMonth(monthName) {
        return months[monthName] || Object.keys(monthsReverse).find(key => monthsReverse[key] === monthName);
    }

    // Funktion för att formatera datum
    function formatDateForDisplay(dateString) {
        const [day, month] = dateString.split(' ');
        const translatedMonth = translateMonth(month);
        return `${parseInt(day)} ${translatedMonth}`;
    }

    // Funktion för att kontrollera om ett datum är inom ett intervall
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

    // Funktion för att formatera resultatet
    function formatResult(result, county) {
        let extraInfo = result['Upplysning'];
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

    // Funktion för att hämta och visa jakttider
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

        const results = data.filter(entry => {
            const areas = entry['Område'].split(',');
            const isInCounty = areas.some(area => area.trim() === county || area.trim() === "Alla län");
            const isInDateRange = isWithinDateRange(entry['Starttid'], entry['Sluttid'], date);
            return isInCounty && isInDateRange;
        });

        results.sort((a, b) => {
            if (a['Grupp'] === b['Grupp']) {
                return a['Slag av vilt'].localeCompare(b['Slag av vilt']);
            } else {
                const groupOrder = ['Däggdjur', 'Fågelarter'];
                return groupOrder.indexOf(a['Grupp']) - groupOrder.indexOf(b['Grupp']);
            }
        });

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

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = mammalResults + birdResults || "Inga resultat funna.";

        const resultItems = resultsDiv.querySelectorAll('.result-item');
        resultItems.forEach(item => {
            item.classList.add('slide-down');
        });
    }

    // Funktion för att initiera sidan
    async function initializePage() {
        const geojson = await fetchGeoJSON();
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;

        // Simulerad koordinat för att hitta län (ersätt med användarens aktuella plats)
        const latitude = 59.3293; // Exempelkoordinater (Stockholm)
        const longitude = 18.0686;

        const county = await findCountyForCoordinates(latitude, longitude, geojson);
        document.getElementById('county').value = county;

        getHuntingInfo();
    }

    // Starta sidan
    initializePage();

    // Lägg till eventlyssnare för ändringar i dropdown och datumfält
    document.getElementById('county').addEventListener('change', getHuntingInfo);
    document.getElementById('date').addEventListener('change', getHuntingInfo);
});
