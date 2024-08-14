function openJaktbartIdag() {
    // Dölj andra flikar
    document.getElementById('tab1').style.display = 'none';
    document.getElementById('tab2').style.display = 'none';
    document.getElementById('tab4').style.display = 'none';
    document.getElementById('tab5').style.display = 'none';

    // Hitta tab-pane för jaktbart idag
    const tabPane = document.getElementById('tab3');
    if (!tabPane) {
        console.error('Tab pane for jaktbart idag not found.');
        return;
    }

    // Visa tab3
    tabPane.style.display = 'flex';
    tabPane.style.flexDirection = 'column';
    tabPane.style.alignItems = 'center'; // Centrera innehållet horisontellt

    // Rensa tidigare innehåll
    tabPane.innerHTML = '';

    // Skapa och lägg till en rubrik högst upp
    const header = document.createElement('h1');
    header.textContent = 'Jaktbart idag!';
    header.className = 'tab3-header-title';
    tabPane.appendChild(header);

    // Skapa en container för län och datum val
    const selectionContainer = document.createElement('div');
    selectionContainer.className = 'selection-container';
    tabPane.appendChild(selectionContainer);

    const countyContainer = document.createElement('div');
    countyContainer.className = 'county-container';
    selectionContainer.appendChild(countyContainer);

    const countyLabel = document.createElement('label');
    countyLabel.htmlFor = 'county';
    countyLabel.textContent = 'Välj län:';
    countyContainer.appendChild(countyLabel);

    const countySelect = document.createElement('select');
    countySelect.id = 'county';
    countySelect.onchange = getHuntingInfo;
    const counties = ["Blekinge län", "Dalarnas län", "Gotlands län", "Gävleborgs län", "Hallands län", "Jämtlands län", "Jönköpings län", "Kalmar län", "Kronobergs län", "Norrbottens län", "Skåne län", "Stockholms län", "Södermanlands län", "Uppsala län", "Värmlands län", "Västerbottens län", "Västernorrlands län", "Västmanlands län", "Västra Götalands län", "Örebro län", "Östergötlands län"];
    counties.forEach(county => {
        const option = document.createElement('option');
        option.value = county;
        option.textContent = county;
        countySelect.appendChild(option);
    });
    countyContainer.appendChild(countySelect);

    const dateContainer = document.createElement('div');
    dateContainer.className = 'date-container';
    selectionContainer.appendChild(dateContainer);

    const dateLabel = document.createElement('label');
    dateLabel.htmlFor = 'date';
    dateLabel.textContent = 'Välj datum:';
    dateContainer.appendChild(dateLabel);

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'date';
    dateInput.name = 'date';
    dateInput.onchange = getHuntingInfo;
    dateContainer.appendChild(dateInput);

    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'results';
    tabPane.appendChild(resultsDiv);

    // Flytta disclaimer till slutet av funktionen
    const disclaimer = document.createElement('div');
    disclaimer.id = 'disclaimer';
    disclaimer.innerHTML = '<p>Observera: Försäkra dig alltid om att informationen stämmer genom att kontrollera <a href="https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/jaktforordning-1987905_sfs-1987-905/" target="_blank">Bilaga 1 i Jaktförordningen (1987:905)</a>.</p>';
    tabPane.appendChild(disclaimer);

    // Starta sidan med dagens datum i svensk tid
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' }).split('T')[0];
    dateInput.value = today;
    displaySavedUserPosition().then(getHuntingInfo);
}

// Jämför användarens sparade position med länspolygoner
function findCountyForCoordinates(latitude, longitude, geojson) {
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

function getSavedUserPosition() {
    var storedPosition = localStorage.getItem('lastKnownPosition');
    if (storedPosition) {
        var { latitude, longitude } = JSON.parse(storedPosition);
        return { latitude, longitude };
    } else {
        return null; // Returnera null om ingen position är sparad
    }
}

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

async function displaySavedUserPosition() {
    var savedPosition = getSavedUserPosition();
    if (savedPosition) {
        const geojson = await loadGeoJSON('bottom_panel/Jaktbart_idag/Sveriges_lan.geojson');
        if (!geojson) {
            console.error('GeoJSON is null or undefined.');
            return;
        }

        var county = findCountyForCoordinates(savedPosition.latitude, savedPosition.longitude, geojson);
        var countySelect = document.getElementById('county');
        countySelect.value = county;
    }
}

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

function translateMonth(monthName) {
    return months[monthName] || Object.keys(monthsReverse).find(key => monthsReverse[key] === monthName);
}

function formatDateForDisplay(dateString) {
    const [day, month] = dateString.split(' ');
    const translatedMonth = translateMonth(month);
    return `${parseInt(day)} ${translatedMonth}`;
}

function parseDateWithoutYear(dateString) {
    const [day, month] = dateString.split(' ');
    const monthNumber = monthsReverse[translateMonth(month)];
    if (!monthNumber) {
        console.error(`Invalid month: ${month}`);
        return null;
    }
    return `${monthNumber}-${day.padStart(2, '0')}`;
}

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

function formatResult(result, county, isEven) {
    let extraInfo = result['Upplysning'];
    if (county !== 'Norrbottens län' && extraInfo.includes('Gäller utom gränsälvsområdet')) {
        extraInfo = '';
    }
    if (county !== 'Dalarnas län' && extraInfo.includes('Gäller ej Älvdalens kommun, se separat jakttid')) {
        extraInfo = '';
    }

    const backgroundColor = isEven ? 'lightgray' : '#f9f9f9';

    return `
        <div class="result-item" style="background-color: ${backgroundColor};">
            <h3>${result['Slag av vilt']}</h3>
            <p><strong>Starttid:</strong> ${formatDateForDisplay(result['Starttid'])}</p>
            <p><strong>Sluttid:</strong> ${formatDateForDisplay(result['Sluttid'])}</p>
            ${extraInfo ? `<p><strong>Upplysning:</strong> ${extraInfo}</p>` : ''}
        </div>
    `;
}

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

    results.forEach((result, index) => {
        const isEven = index % 2 === 0; // Börja med mörkare bakgrundsfärg
        if (result['Grupp'] === 'Däggdjur') {
            if (mammalResults === '') {
                mammalResults += '<h2 class="result-heading">Däggdjur:</h2>';
            }
            mammalResults += formatResult(result, county, isEven);
        } else if (result['Grupp'] === 'Fågelarter') {
            if (birdResults === '') {
                birdResults += '<h2 class="result-heading">Fågelarter:</h2>';
            }
            birdResults += formatResult(result, county, isEven);
        }
    });

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = mammalResults + birdResults || "Inga resultat funna.";

    const resultItems = resultsDiv.querySelectorAll('.result-item');
    resultItems.forEach(item => {
        item.classList.add('slide-down');
    });
}

function initializePage() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    displaySavedUserPosition().then(getHuntingInfo);
}

const style = document.createElement('style');
style.innerHTML = `
#disclaimer {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    padding: 5px;
    margin-bottom: 10px;
    margin-top: 10px;
}

label {
    margin-right: 10px;
    font-weight: bold;
}

select, input[type="date"] {
    padding: 5px;
    font-size: 1em;
    width: auto;
    margin-bottom: 5px; /* Mindre radavstånd */
    max-width: 150px; /* Gör att menyn inte är bredare än nödvändigt */
}

.tab3-header-title {
    position: relative;
    margin-top: 20px;
    padding: 0;
    font-size: 24px;
    color: rgb(50, 94, 88);
    text-align: center;
}

#results {
    margin-left: 10px;
    margin-right: 10px;
}

.result-heading {
    font-size: 1.5em;
    margin-top: 20px;
}

.result-item {
    padding: 15px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.result-item h3 {
    margin-top: 0;
}

.result-item p {
    margin: 2px 0;
    padding: 0;
}

.slide-down {
    animation: slideDown 0.5s ease-in-out;
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

.selection-container {
    display: flex;
    justify-content: center; /* Centrera innehållet horisontellt */
    width: 100%;
    padding: 10px 0;
    gap: 20px; /* Lägg till utrymme mellan containerna */
}

.county-container, .date-container {
    display: flex;
    flex-direction: column;
    align-items: center; /* Centrera innehållet vertikalt inom containerna */
}
`;
document.head.appendChild(style);
