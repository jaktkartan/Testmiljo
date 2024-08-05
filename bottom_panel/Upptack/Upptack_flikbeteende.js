function openUpptack() {
    // Hitta tab-pane för upptäck
    const tabPane = document.getElementById('tab1');
    if (!tabPane) {
        console.error('Tab pane for upptäck not found.');
        return;
    }

    // Rensa tidigare innehåll
    tabPane.innerHTML = '';

    // Definiera CSS
    const style = document.createElement('style');
    style.textContent = `
        .tabs {
            display: flex;
            width: 100%;
            justify-content: space-around;
            background-color: #f1f1f1;
        }
        .tab-button {
            flex: 1;
            padding: 10px;
            cursor: pointer;
            text-align: center;
            background-color: #ddd;
            border: none;
            outline: none;
            transition: background-color 0.3s;
        }
        .tab-button.active {
            background-color: #bbb;
        }
        .tab-content-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
        }
        .tab-content {
            display: none;
        }
    `;
    document.head.appendChild(style);

    // Skapa en container för flikarna
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs';

    const tabContentContainer = document.createElement('div');
    tabContentContainer.className = 'tab-content-container';

    // Skapa flikarna
    const tabButtons = [
        { id: 'upptackTab', text: 'Upptäck', contentId: 'upptackContent' },
        { id: 'kommandeMassaTab', text: 'Kommande mässa', contentId: 'kommandeMassaContent' },
        { id: 'rekommendationerTab', text: 'Rekommendationer', contentId: 'rekommendationerContent' }
    ];

    tabButtons.forEach(tab => {
        const button = document.createElement('button');
        button.id = tab.id;
        button.className = 'tab-button';
        button.textContent = tab.text;
        button.onclick = function() {
            openTabContent(tab.contentId, tab.id);
        };
        tabsContainer.appendChild(button);
    });

    tabPane.appendChild(tabsContainer);
    tabPane.appendChild(tabContentContainer);

    // Skapa innehåll för varje flik
    const tabContents = [
        { id: 'upptackContent', content: createUpptackContent },
        { id: 'kommandeMassaContent', content: createKommandeMassaContent },
        { id: 'rekommendationerContent', content: createRekommendationerContent }
    ];

    tabContents.forEach(tab => {
        const contentDiv = document.createElement('div');
        contentDiv.id = tab.id;
        contentDiv.className = 'tab-content';
        contentDiv.style.display = 'none';
        tabContentContainer.appendChild(contentDiv);
        tab.content(contentDiv);
    });

    // Visa första fliken som standard
    openTabContent('upptackContent', 'upptackTab');

    function openTabContent(contentId, tabId) {
        const contents = document.getElementsByClassName('tab-content');
        for (let content of contents) {
            content.style.display = 'none';
        }
        document.getElementById(contentId).style.display = 'block';

        const buttons = document.getElementsByClassName('tab-button');
        for (let button of buttons) {
            button.classList.remove('active');
        }
        document.getElementById(tabId).classList.add('active');
    }

    function createUpptackContent(contentDiv) {
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

        // Lägg till knappcontainern till content-div
        contentDiv.appendChild(container);

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

    function createKommandeMassaContent(contentDiv) {
        // Skapa en container div för att centrera innehållet
        const container = document.createElement('div');
        container.className = 'button-container';

        // Skapa innehåll för kommande mässa (lägg till lämpliga element)
        const massaContent = document.createElement('p');
        massaContent.textContent = 'Information om kommande mässor kommer här.';
        container.appendChild(massaContent);

        // Lägg till containern till content-div
        contentDiv.appendChild(container);
    }

    function createRekommendationerContent(contentDiv) {
        // Skapa en container div för att centrera innehållet
        const container = document.createElement('div');
        container.className = 'button-container';

        // Skapa innehåll för rekommendationer (lägg till lämpliga element)
        const rekommendationerContent = document.createElement('p');
        rekommendationerContent.textContent = 'Här hittar du rekommendationer.';
        container.appendChild(rekommendationerContent);

        // Lägg till containern till content-div
        contentDiv.appendChild(container);
    }
}
