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
        clearTabPaneContent(tabs[i]);
        tabs[i].style.display = 'none';
    }
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none';
}

// Funktion för att öppna en flik
function openTab(tabId, url) {
    resetTabs();
    var tab = document.getElementById(tabId);
    tab.style.display = 'block';
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'block';

    if (tabId === 'tab1') {
        openUpptack();
    } else if (tabId === 'tab2') {
        openKartor();
    } else if (tabId === 'tab3') {
        openJaktbartIdag();
    } else if (tabId === 'tab4') {
        populateTab4();
    } else if (tabId === 'tab5') {
        fetchTab5Content(url);
    }
}

function clearTabPaneContent(tabPane) {
    while (tabPane.firstChild) {
        tabPane.removeChild(tabPane.firstChild);
    }
}

function fetchTab5Content(url) {
    var tab = document.getElementById('tab5');
    fetch(url)
        .then(response => response.text())
        .then(html => {
            tab.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching tab content:', error);
        });
}

document.addEventListener('click', function(event) {
    var tabContent = document.getElementById('tab-content');
    if (!tabContent.contains(event.target) && !event.target.matches('.panel-button img')) {
        resetTabs();
    }
});

function closeTabContent() {
    var tabContent = document.getElementById('tab-content');
    tabContent.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    displaySavedUserPosition(); // Visa sparade positionen när sidan laddas
});
