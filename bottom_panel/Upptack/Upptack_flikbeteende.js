function openTab(tabName) {
    // Dölj alla flikar
    const tabs = document.getElementsByClassName('tab-content');
    for (let tab of tabs) {
        tab.style.display = 'none';
    }

    // Visa vald flik
    if (tabName === 'upptack') {
        openUpptack();
    } else if (tabName === 'kommandeMassa') {
        openKommandeMassa();
    } else if (tabName === 'rekommendationer') {
        openRekommendationer();
    }
}

function openUpptack() {
    // Hitta tab-pane för upptäck
    const tabPane = document.getElementById('tab1');
    tabPane.style.display = 'flex';

    // Rensa tidigare innehåll
    tabPane.innerHTML = '';

    // Skapa och lägg till en rubrik högst upp
    const header = document.createElement('h1');
    header.textContent = 'Upptäck!';
    header.className = 'tab1-2-header-title';
    tabPane.appendChild(header);

    // Skapa en container div för att centrera innehållet
    const container = document.createElement('div');
    container.className = 'button-container';

    // Skapa "Visa allt"-knappen
    const showAllButton = document.createElement('button');
    showAllButton.className = 'styled-button';
    showAllButton.id = 'show-all-button';
    showAllButton.onclick = function() {
        if (typeof Upptack_geojsonHandler !== 'undefined') {
            console.log('Activating all layers');
            Upptack_geojsonHandler.toggleLayer('Visa_allt');
        } else {
            console.error("Upptack_geojsonHandler är inte definierad.");
        }
    };
    const showAllImg = document.createElement('img');
    showAllImg.src = 'bottom_panel/Upptack/bilder/visa_allt_ikon.png';
    showAllImg.alt = 'Visa allt';
    showAllButton.appendChild(showAllImg);
    const showAllText = document.createElement('div');
    showAllText.className = 'text-content';
    showAllText.textContent = 'Visa allt';
    showAllButton.appendChild(showAllText);
    container.appendChild(showAllButton);

    // Skapa "Filtrera"-knappen
    const filterButton = document.createElement('button');
    filterButton.className = 'styled-button';
    filterButton.textContent = 'Filtrera';
    filterButton.id = 'filter-button';
    filterButton.onclick = function(event) {
        event.stopPropagation();
        showFilterOptions();
    };
    container.appendChild(filterButton);

    // Lägg till knappcontainern till tab-pane
    tabPane.appendChild(container);

    // Skapa en meny för "Filtrera"-knappen
    function showFilterOptions() {
        container.innerHTML = ''; // Rensa knappcontainern

        const filters = [
            {
                className: 'styled-button',
                onclick: function() {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        console.log('Activating Mässor layer');
                        Upptack_geojsonHandler.toggleLayer('Mässor');
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                    restoreOriginalButtons();
                },
                imgSrc: 'bottom_panel/Upptack/bilder/massa_ikon.png',
                imgAlt: 'Mässor',
                text: 'Mässor'
            },
            {
                className: 'styled-button',
                onclick: function() {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        console.log('Activating Jaktkort layer');
                        Upptack_geojsonHandler.toggleLayer('Jaktkort');
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                    restoreOriginalButtons();
                },
                imgSrc: 'bottom_panel/Upptack/bilder/jaktkort_ikon.png',
                imgAlt: 'Jaktkort',
                text: 'Jaktkort'
            },
            {
                className: 'styled-button',
                onclick: function() {
                    if (typeof Upptack_geojsonHandler !== 'undefined') {
                        console.log('Activating Jaktskyttebanor layer');
                        Upptack_geojsonHandler.toggleLayer('Jaktskyttebanor');
                    } else {
                        console.error("Upptack_geojsonHandler är inte definierad.");
                    }
                    restoreOriginalButtons();
                },
                imgSrc: 'bottom_panel/Upptack/bilder/jaktskyttebanor_ikon.png',
                imgAlt: 'Jaktskyttebanor',
                text: 'Jaktskytte-<br>banor' // Exempel på radbrytning
            }
        ];

        filters.forEach(filter => {
            const btn = document.createElement('button');
            btn.className = filter.className;
            btn.onclick = filter.onclick;

            if (filter.imgSrc) {
                const img = document.createElement('img');
                img.src = filter.imgSrc;
                img.alt = filter.imgAlt;
                btn.appendChild(img);
            }

            const textDiv = document.createElement('div');
            textDiv.className = 'text-content';
            textDiv.innerHTML = filter.text; // Använd innerHTML för att tolka <br>
            btn.appendChild(textDiv);

            container.appendChild(btn);
        });
    }

    // Funktion för att återställa de ursprungliga knapparna
    function restoreOriginalButtons() {
        container.innerHTML = '';
        container.appendChild(showAllButton);
        container.appendChild(filterButton);
    }
}

function openKommandeMassa() {
    // Hitta tab-pane för kommande mässa
    const tabPane = document.getElementById('tab2');
    tabPane.style.display = 'flex';

    // Rensa tidigare innehåll
    tabPane.innerHTML = '';

    // Skapa och lägg till en rubrik högst upp
    const header = document.createElement('h1');
    header.textContent = 'Kommande mässa!';
    header.className = 'tab1-2-header-title';
    tabPane.appendChild(header);

    // Skapa en container div för att centrera innehållet
    const container = document.createElement('div');
    container.className = 'button-container';

    // Skapa innehåll för kommande mässa (lägg till lämpliga element)
    const massaContent = document.createElement('p');
    massaContent.textContent = 'Information om kommande mässor kommer här.';
    container.appendChild(massaContent);

    // Lägg till containern till tab-pane
    tabPane.appendChild(container);
}

function openRekommendationer() {
    // Hitta tab-pane för rekommendationer
    const tabPane = document.getElementById('tab3');
    tabPane.style.display = 'flex';

    // Rensa tidigare innehåll
    tabPane.innerHTML = '';

    // Skapa och lägg till en rubrik högst upp
    const header = document.createElement('h1');
    header.textContent = 'Rekommendationer!';
    header.className = 'tab1-2-header-title';
    tabPane.appendChild(header);

    // Skapa en container div för att centrera innehållet
    const container = document.createElement('div');
    container.className = 'button-container';

    // Skapa innehåll för rekommendationer (lägg till lämpliga element)
    const rekommendationerContent = document.createElement('p');
    rekommendationerContent.textContent = 'Här hittar du rekommendationer.';
    container.appendChild(rekommendationerContent);

    // Lägg till containern till tab-pane
    tabPane.appendChild(container);
}

// Skapa flikarna och deras innehåll
document.addEventListener('DOMContentLoaded', function() {
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs';

    const tabButtons = [
        { id: 'upptack', text: 'Upptäck' },
        { id: 'kommandeMassa', text: 'Kommande mässa' },
        { id: 'rekommendationer', text: 'Rekommendationer' }
    ];

    tabButtons.forEach(tab => {
        const button = document.createElement('button');
        button.onclick = function() { openTab(tab.id); };
        button.textContent = tab.text;
        tabsContainer.appendChild(button);
    });

    document.body.insertBefore(tabsContainer, document.body.firstChild);

    // Skapa tab panes
    const tab1 = document.createElement('div');
    tab1.id = 'tab1';
    tab1.className = 'tab-content';
    document.body.appendChild(tab1);

    const tab2 = document.createElement('div');
    tab2.id = 'tab2';
    tab2.className = 'tab-content';
    tab2.style.display = 'none';
    document.body.appendChild(tab2);

    const tab3 = document.createElement('div');
    tab3.id = 'tab3';
    tab3.className = 'tab-content';
    tab3.style.display = 'none';
    document.body.appendChild(tab3);
});
