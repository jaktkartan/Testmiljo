// Ladda GeoJSON-filen med Sveriges länspolygoner.
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
                    return feature.properties.LÄN;
                }
            }
        }
    }

    return 'Okänt län'; // Om ingen matchning hittades
}

// Funktion för att avgöra om en punkt ligger inuti en polygon
function isPointInPolygon(point, polygon) {
    if (!polygon || polygon.length === 0 || polygon[0].length === 0) {
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
        // Ladda GeoJSON-filen och avgör län baserat på sparade koordinater
        loadGeoJSON('bottom_panel/Jaktbart_idag/Sveriges_lan.geojson')
            .then(geojson => {
                var county = findCountyForCoordinates(savedPosition.latitude, savedPosition.longitude, geojson);
                if (county !== 'Okänt län') {
                    document.getElementById('county').value = county;
                    getHuntingInfo();
                }
            })
            .catch(error => {
                console.error('Error loading GeoJSON:', error);
            });
    } else {
        console.log("Ingen sparad position hittades.");
    }
}

document.addEventListener("DOMContentLoaded", initializePage);

function initializePage() {
    const head = document.head;
    const body = document.body;

    const style = document.createElement("style");
    style.textContent = `
        #disclaimer {
            font-size: 0.9em;
            color: #666;
            margin-top: 10px;
        }
        #disclaimer a {
            color: #007bff;
            text-decoration: none;
        }
        #disclaimer a:hover {
            text-decoration: underline;
        }
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
    `;
    head.appendChild(style);

    const title = document.createElement("h1");
    title.textContent = "Jakttider";
    body.appendChild(title);

    const disclaimer = document.createElement("div");
    disclaimer.id = "disclaimer";
    disclaimer.innerHTML = `
        <p>Observera: Försäkra dig alltid om att informationen stämmer genom att kontrollera <a href="https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/jaktforordning-1987905_sfs-1987-905/" target="_blank">Bilaga 1 i Jaktförordningen (1987:905)</a>.</p>
    `;
    body.appendChild(disclaimer);

    const countyLabel = document.createElement("label");
    countyLabel.setAttribute("for", "county");
    countyLabel.textContent = "Välj län:";
    body.appendChild(countyLabel);

    const countySelect = document.createElement("select");
    countySelect.id = "county";
    countySelect.onchange = getHuntingInfo;
    const counties = [
        "Blekinge län", "Dalarnas län", "Gotlands län", "Gävleborgs län", "Hallands län", 
        "Jämtlands län", "Jönköpings län", "Kalmar län", "Kronobergs län", "Norrbottens län", 
        "Skåne län", "Stockholms län", "Södermanlands län", "Uppsala län", "Värmlands län", 
        "Västerbottens län", "Västernorrlands län", "Västmanlands län", "Västra Götalands län", 
        "Örebro län", "Östergötlands län"
    ];
    counties.forEach(county => {
        const option = document.createElement("option");
        option.value = county;
        option.textContent = county;
        countySelect.appendChild(option);
    });
    body.appendChild(countySelect);
    body.appendChild(document.createElement("br"));

    const dateLabel = document.createElement("label");
    dateLabel.setAttribute("for", "date");
    dateLabel.textContent = "Välj datum:";
    body.appendChild(dateLabel);

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.id = "date";
    dateInput.name = "date";
    dateInput.onchange = getHuntingInfo;
    body.appendChild(dateInput);
    body.appendChild(document.createElement("br"));

    const resultsDiv = document.createElement("div");
    resultsDiv.id = "results";
    body.appendChild(resultsDiv);
    body.appendChild(document.createElement("br"));

    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    displaySavedUserPosition();
    getHuntingInfo();
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
