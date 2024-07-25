// Knappen tab1 (upptäck) rensar geojson-lager och WMS från tab2 (kartor) fliken.
document.getElementById('tab1').addEventListener('click', function() {
    if (typeof Kartor_geojsonHandler !== 'undefined') {
        Kartor_geojsonHandler.deactivateAllLayersKartor();
    } else {
        console.error("Kartor_geojsonHandler är inte definierad.");
    }
});

// Knappen tab2 (kartor) rensar geojson-lager från tab1 (upptäck) fliken.
document.getElementById('tab2').addEventListener('click', function() {
    if (typeof Upptack_geojsonHandler !== 'undefined') {
        Upptack_geojsonHandler.deactivateAllLayers();
    } else {
        console.error("Upptack_geojsonHandler är inte definierad.");
    }
});

// Funktion för att återställa flikarna till sitt ursprungliga tillstånd
function resetTabs() {
    var tabs = document.getElementsByClassName('tab-pane');
    for (var i = 0; i < tabs.length; i++) {
        // Se till att rensa varje flik
        clearTabPaneContent(tabs[i]);
        tabs[i].style.display = 'none'; // Döljer alla flikar
    }
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none'; // Döljer tab-content behållaren
}

// Funktion för att öppna en flik
function openTab(tabId, url) {
    resetTabs(); // Rensa tidigare flikar
    var tab = document.getElementById(tabId);
    tab.style.display = 'block'; // Visa den valda fliken
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'block'; // Visa tab-content behållaren

    // Fyll fliken baserat på tabId
    if (tabId === 'tab1') {
        openUpptack(); // Anropar funktion för tab1
    } else if (tabId === 'tab2') {
        openKartor(); // Anropar funktion för tab2
    } else if (tabId === 'tab3') {
        populateTab3(); // Anropar funktion för tab3
    } else if (tabId === 'tab4') {
        populateTab4(); // Anropar funktion för tab4
    } else if (tabId === 'tab5') {
        fetchTab5Content(url); // Anropar funktion för tab5
    }
}

// Funktion för att rensa innehållet i en tab-pane på ett säkert sätt
function clearTabPaneContent(tabPane) {
    while (tabPane.firstChild) {
        tabPane.removeChild(tabPane.firstChild);
    }
}

// Funktion för att öppna Kaliberkrav-fliken
function openKaliberkravTab(url) {
    var tabContent = document.getElementById('tab-content');
    var tab = document.createElement('div');
    tab.className = 'tab-pane';
    tabContent.appendChild(tab);

    fetch(url)
        .then(response => response.text())
        .then(html => {
            tab.innerHTML += html;
            tab.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching Kaliberkrav content:', error);
        });
}

// Funktion för att fylla tab3
function populateTab3() {
    var tab = document.getElementById('tab3');
    tab.innerHTML = ''; // Rensar innehållet i tab3

    var heading = document.createElement('h2');
    heading.textContent = 'Jaktbart idag';
    tab.appendChild(heading);

    var paragraph = document.createElement('p');
    paragraph.textContent = 'Senaste lagrade position:';
    tab.appendChild(paragraph);

    displaySavedUserPosition(); // Anropar funktion för att visa position
}

// Funktion för att fylla tab4
function populateTab4() {
    var tab = document.getElementById('tab4');
    tab.innerHTML = '';

    var heading = document.createElement('h2');
    heading.textContent = 'Kaliberkrav';
    tab.appendChild(heading);

    var paragraph = document.createElement('p');
    paragraph.textContent = 'Kaliberkrav och lämplig hagelstorlek vid jakt';
    tab.appendChild(paragraph);

    var button1 = document.createElement('button');
    var img1 = document.createElement('img');
    img1.src = 'bottom_panel/Kartor/bilder/daggdjurikon.png';
    img1.alt = 'Kaliberkrav: Däggdjur';
    img1.style.width = '90px';  // Justera storlek efter behov
    img1.style.height = '90px'; // Justera storlek efter behov
    button1.appendChild(img1);
    button1.onclick = function() {
        openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Daggdjur.html');
    };
    tab.appendChild(button1);

    var button2 = document.createElement('button');
    var img2 = document.createElement('img');
    img2.src = 'bottom_panel/Kartor/bilder/fagelikon.png';
    img2.alt = 'Kaliberkrav: Fågel';
    img2.style.width = '90px';  // Justera storlek efter behov
    img2.style.height = '90px'; // Justera storlek efter behov
    button2.appendChild(img2);
    button2.onclick = function() {
        openKaliberkravTab('bottom_panel/Kaliberkrav/Kaliberkrav_Fagel.html');
    };
    tab.appendChild(button2);
}

// Funktion för att hämta innehållet för tab5
function fetchTab5Content(url) {
    var tab = document.getElementById('tab5');
    fetch(url)
        .then(response => response.text())
        .then(html => {
            tab.innerHTML = html; // Lägg till innehållet för tab5
        })
        .catch(error => {
            console.error('Error fetching tab content:', error);
        });
}


// Lyssnare för klick utanför flikar och panelknappar
document.addEventListener('click', function(event) {
    var tabContent = document.getElementById('tab-content');
    if (!tabContent.contains(event.target) && !event.target.matches('.panel-button img')) {
        resetTabs();
    }
});

// Funktion för att stänga flikinnehåll
function closeTabContent() {
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none';
}


// Lyssnare för när sidan laddas
document.addEventListener('DOMContentLoaded', function() {
    displaySavedUserPosition(); // Visa sparade positionen när sidan laddas
});
