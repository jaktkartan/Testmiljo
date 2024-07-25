document.addEventListener("DOMContentLoaded", function() {
    // Skapa stil-elementet
    const style = document.createElement('style');
    style.innerHTML = `
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
    document.head.appendChild(style);

    // Skapa och fyll body-innehållet
    const body = document.body;
    body.innerHTML = `
        <h1>Jakttider</h1>
        <div id="disclaimer">
            <p>Observera: Försäkra dig alltid om att informationen stämmer genom att kontrollera <a href="https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/jaktforordning-1987905_sfs-1987-905/" target="_blank">Bilaga 1 i Jaktförordningen (1987:905)</a>.</p>
        </div>
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
        <label for="date">Välj datum:</label>
        <input type="date" id="date" name="date" onchange="getHuntingInfo()">
        <br>
        <div id="results"></div>
        <br>
    `;

    // Lägg till övrig JavaScript-logik
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

    function initializePage() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        getHuntingInfo();
    }

    initializePage();
});
