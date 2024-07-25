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
        var tab = document.getElementById('tab3');
        tab.innerHTML = '';

        // Visa rull-lista för att välja annat län direkt
        showCountySelection(savedPosition); // Flyttad hit för att visa rull-listan först

        // Ladda GeoJSON-filen och avgör län baserat på sparade koordinater
        loadGeoJSON('bottom_panel/Jaktbart_idag/Sveriges_lan.geojson')
            .then(geojson => {
                var county = findCountyForCoordinates(savedPosition.latitude, savedPosition.longitude, geojson);

                // Bygg URL för Google Sheets baserat på länets namn
                var googleSheetsURL;
                switch (county.toUpperCase()) {
                    case '':
                        googleSheetsURL = '';
                        break;

                        case 'BLEKINGE LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQsxbRSsqhB9xtsgieRjlGw7BZyavANLgf6Q1I_7vmW1JT7vidkcQyXr3S_i8DS7Q/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'DALARNAS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdU_PeaOHXTCF6kaZb0k-431-WY47GIhhfJHaXD17-fC72GvBp2j1Tedcoko-cHQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'GOTLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQnahCXZhD9i9dBjwHe70vxPgeoOE6bG7syOVElw-yYfTzFoh_ANDxov5ttmQWYCw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'GÄVLEBORGS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKBoQAP9xihDzgBbm3t_SFZ70leHTWK0tJ82v1koj9QzSFJQxxkPmKLwATSoAPMA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'HALLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2BFE-SRmBCBS-0yByDhuEVp_sTnVw1zTiknHvfzE0Fmw4efRYz0EPMwnhGKiy5g/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'JÄMTLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTG9X1E7-ZXI7gp9-BizmipzFh701pawm3hxzVKu_DyRtQ1p2zshsjLy4-PB2exEw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'JÖNKÖPINGS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0cpVw1Eu79k1YIHiSLawV2PbV9kYxiRtrpM8dp33OdC-U-qsWS7GkqWMbTi2WkQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'KALMARS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR72MO0TobqcwmZI2ioQ9lJGw38V1B2qECC5RILBDJHSHR7sOV3U_P3ucSolLieMg/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'KRONOBERGS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpPY36rcqD3cp18IHfEeZcyJ2m-N4MZMX63_3lVZEaxvlR00JeQ8-mLyPHCyPD4Q/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'NORRBOTTENS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSE8OM2nEjFB8MPX8Uq9x5eRkFiLAOUUc_f358zWCxEYZUP2I_FDG1JCNFbM9Vuyg/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'SKÅNES LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRH9Vp7_2DfEMY2qkQ7TI_haVuWH4u14zSff5NyOSafAzgGG22pIENzyRKpDObpEA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'STOCKHOLMS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS9BnmJgLti5F3KZmXVMQXZO1cSJ9-3GJiDMgoTcd0Yyiv4fCbNkpycpG80nrcNnA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'SÖDERMANLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQvDQei2FICBkyASfI0ZKktuRKVeOnLtk4RMEXqT_Ycg-ycmWydMbIQQM72O1Ctiw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'UPPSALA LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtBAPI022uMmngp6WwyK6dTD0IU8xM5j_WuN3T5dgpssPCg5gatmDGVtGc4r_aWQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'VÄRMLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQyx5mAaJouc0DkfdjF9LGND-LrEk3b7ndFCRb_4ever12Gf95c1K5hLjYph3mcmw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'VÄSTERBOTTENS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTQY5Xy7Mp13JyoehpsZcZiELwv1EBKybInh2HPSR8OK1c-_PZOvUTS4rD4uhFHRQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'VÄSTERNORRLAND':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTK_yxu8WaXUNqFvMBFY1B-AtjrmRJ6KzoHJpK_0pOmEGF_UNgP7U-EoO5_ujSE4A/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'VÄSTMANLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSU9ys200Rvtft1xU8Vz6hwCTiNlAK-9poMwuLht1l9SYzIqtIfOnb_XM8toL2pfA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'VÄSTRA GÖTALAND':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTgFOYLMInhQ7SZDQ4SFE17OJBpcUYSZcyVeCY_q2zBKNsdc5hbSwoRNMoFOMIeag/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'ÖREBROS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTeXGD1OrUQ2L43q1pCdmt1clCZ5aCgbNSKaH2Bi_UOCrv8SXMOY_ePD5uzF7nBSQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'ÖSTERGÖTLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQOyZdJccrGY4NDIGozjnF_IEpyp4_ZjjFxGY7trJVIieueJIJn3y76OqnsVEbMDg/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;       

                    default:
                        googleSheetsURL = ''; // Om län inte hittas, tom URL
                        break;
                }

                // Visa Google Sheets i en iframe om URL är definierad
                if (googleSheetsURL) {
                    var iframe = document.createElement('iframe');
                    iframe.src = googleSheetsURL;
                    iframe.style.width = '100%';
                    iframe.style.height = '1400px'; // Justera höjden efter behov
                    iframe.setAttribute('frameborder', '0');
                    tab.appendChild(iframe);
                } else {
                    var noDataInfo = document.createElement('p');
                    noDataInfo.textContent = 'Ingen data tillgänglig för detta län.';
                    tab.appendChild(noDataInfo);
                }
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

// Funktion för att visa en lista över län för att välja ett annat län
function showCountySelection(savedPosition) {
    var tab = document.getElementById('tab3');
    var countyList = document.createElement('div');
    countyList.className = 'county-list';
    tab.appendChild(countyList);

    var select = document.createElement('select');
    countyList.appendChild(select);
    
    // Lägg till ett tomt alternativ först
    var optionElement = document.createElement('option');
    optionElement.textContent = 'Välj annat län'; // Tomt alternativ
    select.appendChild(optionElement);
    
    // Alternativ för varje län
    var options = ['BLEKINGE LÄN', 'DALARNAS LÄN', 'GOTLANDS LÄN', 'GÄVLEBORGS LÄN', 'HALLANDS LÄN', 
    'JÄMTLANDS LÄN', 'JÖNKÖPINGS LÄN', 'KALMARS LÄN', 'KRONOBERGS LÄN', 'NORRBOTTENS LÄN', 
    'SKÅNES LÄN', 'STOCKHOLMS LÄN', 'SÖDERMANLANDS LÄN', 'UPPSALA LÄN', 'VÄRMLANDS LÄN', 
    'VÄSTERBOTTENS LÄN', 'VÄSTERNORRLAND', 'VÄSTMANLANDS LÄN', 'VÄSTRA GÖTALAND', 
    'ÖREBROS LÄN', 'ÖSTERGÖTLANDS LÄN'];
    options.forEach(option => {
        var optionElement = document.createElement('option');
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });

    // Lyssnare för val av län
    select.addEventListener('change', function() {
        var selectedCounty = select.value;
        updateIframeForCounty(selectedCounty);
    });
}

// Funktion för att uppdatera iframen för det valda länet
function updateIframeForCounty(county) {
    var tab = document.getElementById('tab3');
    var existingIframe = tab.querySelector('iframe');

    // Bygg URL för Google Sheets baserat på det valda länet
    var googleSheetsURL;
    switch (county.toUpperCase()) {
                        case 'BLEKINGE LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQsxbRSsqhB9xtsgieRjlGw7BZyavANLgf6Q1I_7vmW1JT7vidkcQyXr3S_i8DS7Q/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'DALARNAS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdU_PeaOHXTCF6kaZb0k-431-WY47GIhhfJHaXD17-fC72GvBp2j1Tedcoko-cHQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'GOTLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQnahCXZhD9i9dBjwHe70vxPgeoOE6bG7syOVElw-yYfTzFoh_ANDxov5ttmQWYCw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'GÄVLEBORGS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKBoQAP9xihDzgBbm3t_SFZ70leHTWK0tJ82v1koj9QzSFJQxxkPmKLwATSoAPMA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'HALLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR2BFE-SRmBCBS-0yByDhuEVp_sTnVw1zTiknHvfzE0Fmw4efRYz0EPMwnhGKiy5g/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'JÄMTLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTG9X1E7-ZXI7gp9-BizmipzFh701pawm3hxzVKu_DyRtQ1p2zshsjLy4-PB2exEw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'JÖNKÖPINGS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR0cpVw1Eu79k1YIHiSLawV2PbV9kYxiRtrpM8dp33OdC-U-qsWS7GkqWMbTi2WkQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'KALMARS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR72MO0TobqcwmZI2ioQ9lJGw38V1B2qECC5RILBDJHSHR7sOV3U_P3ucSolLieMg/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'KRONOBERGS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpPY36rcqD3cp18IHfEeZcyJ2m-N4MZMX63_3lVZEaxvlR00JeQ8-mLyPHCyPD4Q/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'NORRBOTTENS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSE8OM2nEjFB8MPX8Uq9x5eRkFiLAOUUc_f358zWCxEYZUP2I_FDG1JCNFbM9Vuyg/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'SKÅNES LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRH9Vp7_2DfEMY2qkQ7TI_haVuWH4u14zSff5NyOSafAzgGG22pIENzyRKpDObpEA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'STOCKHOLMS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS9BnmJgLti5F3KZmXVMQXZO1cSJ9-3GJiDMgoTcd0Yyiv4fCbNkpycpG80nrcNnA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'SÖDERMANLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQvDQei2FICBkyASfI0ZKktuRKVeOnLtk4RMEXqT_Ycg-ycmWydMbIQQM72O1Ctiw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'UPPSALA LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtBAPI022uMmngp6WwyK6dTD0IU8xM5j_WuN3T5dgpssPCg5gatmDGVtGc4r_aWQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'VÄRMLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQyx5mAaJouc0DkfdjF9LGND-LrEk3b7ndFCRb_4ever12Gf95c1K5hLjYph3mcmw/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'VÄSTERBOTTENS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTQY5Xy7Mp13JyoehpsZcZiELwv1EBKybInh2HPSR8OK1c-_PZOvUTS4rD4uhFHRQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'VÄSTERNORRLAND':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTK_yxu8WaXUNqFvMBFY1B-AtjrmRJ6KzoHJpK_0pOmEGF_UNgP7U-EoO5_ujSE4A/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'VÄSTMANLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSU9ys200Rvtft1xU8Vz6hwCTiNlAK-9poMwuLht1l9SYzIqtIfOnb_XM8toL2pfA/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'VÄSTRA GÖTALAND':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTgFOYLMInhQ7SZDQ4SFE17OJBpcUYSZcyVeCY_q2zBKNsdc5hbSwoRNMoFOMIeag/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'ÖREBROS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTeXGD1OrUQ2L43q1pCdmt1clCZ5aCgbNSKaH2Bi_UOCrv8SXMOY_ePD5uzF7nBSQ/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;
                        case 'ÖSTERGÖTLANDS LÄN':
                            googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQOyZdJccrGY4NDIGozjnF_IEpyp4_ZjjFxGY7trJVIieueJIJn3y76OqnsVEbMDg/pubhtml?gid=1144895507&single=true&widget=false&headers=false&chrome=false';
                            break;       
        default:
            googleSheetsURL = ''; // Om län inte hittas, tom URL
            break;
    }

    // Uppdatera eller skapa iframen
    if (googleSheetsURL) {
        if (existingIframe) {
            existingIframe.src = googleSheetsURL;
        } else {
            var iframe = document.createElement('iframe');
            iframe.src = googleSheetsURL;
            iframe.style.width = '100%';
            iframe.style.height = '600px'; // Justera höjden efter behov
            iframe.setAttribute('frameborder', '0');
            tab.appendChild(iframe);
        }
    } else {
        if (existingIframe) {
            existingIframe.remove();
        }
        var noDataInfo = document.createElement('p');
        noDataInfo.textContent = 'Ingen data tillgänglig för detta län.';
        tab.appendChild(noDataInfo);
    }
}
