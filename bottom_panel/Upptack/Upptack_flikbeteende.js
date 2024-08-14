function openUpptack() {
    const tabPane = document.getElementById('tab1');
    if (!tabPane) {
        console.error('Tab pane for Kommande händelser not found.');
        return;
    }

    tabPane.innerHTML = '';

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
            padding: 15px 0px 5px 0px;
            box-sizing: border-box;
        }
        .tab-content {
            display: none;
        }
        .geojson-container {
            margin-bottom: 10px;
        }
        .geojson-feature-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .geojson-feature {
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 1px solid #ddd;
            border-radius: 5px;
            flex-grow: 1;
            position: relative; /* Viktigt: Relativ position för att ikonen ska placeras korrekt */
        }
        .geojson-feature h3 {
            margin: 0;
            padding: 5px 0;
        }
        .geojson-feature p {
            margin: 0;
            padding: 3px 0;
        }
        .geojson-feature img {
            width: 90%;
            display: block;
            margin: 0 auto 5px auto;
        }
        
        .icon-text-container {
            position: absolute;
            bottom: 0px; /* Justera för att minska marginalen nedtill */
            left: 8px;
            display: flex;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.8); /* Vit bakgrund med transparens */
            padding: 0px 10px 0px 15px; /* Minskat padding nedtill */
            border-radius: 0px 10px 0 0; /* Rundning av endast de övre hörnen */
            z-index: 100;
        }

        .icon-overlay {
            width: 40px !important;  /* Fast bredd */
            height: 40px !important;  /* Fast höjd */
            object-fit: contain;  /* Se till att bilden behåller proportionerna */
            margin-right: 5px; /* Liten marginal mellan ikon och text */
        }
        .nav-button {
            background-color: #326E58;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            text-align: center;
            text-decoration: none;
            font-size: 20px;
            cursor: pointer;
            border-radius: 50%;
            transition: background-color 0.3s, box-shadow 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .nav-button:hover {
            background-color: #274E44;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .nav-button:active {
            background-color: #19362E;
        }
        .button-container {
            margin-top: 10px;
        }
        .link-button {
            display: inline-flex;
            align-items: center;
            background-color: rgb(50, 94, 88);
            color: white;
            border: none;
            padding: 10px 5px;
            text-align: center;
            text-decoration: none;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 5px;
            white-space: nowrap;
            justify-content: center;
        }
        .link-button img {
            height: 20px;
            width: auto;
            margin-left: 5px;
            border-radius: 0 !important;
        }
        .link-button .custom-image {
            border-radius: 0 !important;
        }
    `;
    document.head.appendChild(style);

    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs';

    const tabContentContainer = document.createElement('div');
    tabContentContainer.className = 'tab-content-container';

    const tabButtons = [
        { id: 'upptackTab', text: 'Kommande händelser', contentId: 'upptackContent' },
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

    const tabContents = [
        { id: 'upptackContent', content: createUpptackContent },
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

        if (contentId === 'upptackContent') {
            deactivateAllLayersKartor();
            runShowAllFunctions();
        }
    }

    function deactivateAllLayersKartor() {
        if (typeof Kartor_geojsonHandler !== 'undefined') {
            console.log('Deactivating all layers in Kartor');
            Kartor_geojsonHandler.deactivateAllLayersKartor();
        } else {
            console.error("Kartor_geojsonHandler är inte definierad.");
        }
    }

    function runShowAllFunctions() {
        if (typeof Upptack_geojsonHandler !== 'undefined') {
            console.log('Activating all layers in Upptack');
            Upptack_geojsonHandler.activateAllLayers();
        } else {
            console.error("Upptack_geojsonHandler är inte definierad.");
        }
    }

    function createUpptackContent(contentDiv) {
        fetch('bottom_panel/Upptack/geojsonfiler/Massor.geojson')
            .then(response => response.json())
            .then(data => {
                const today = new Date();
                let currentIndex = 0;
                const features = data.features.filter(feature => new Date(feature.properties.DATUM_TILL) >= today);

                features.sort((a, b) => new Date(a.properties.DATUM_FRAN) - new Date(b.properties.DATUM_FRAN));

                const container = document.createElement('div');
                container.className = 'geojson-container';
                contentDiv.appendChild(container);

                const navButtonsContainer = document.createElement('div');
                navButtonsContainer.className = 'geojson-feature-container';

                const prevButton = document.createElement('button');
                prevButton.className = 'nav-button';
                prevButton.textContent = '<';
                prevButton.onclick = () => {
                    if (currentIndex > 0) {
                        currentIndex--;
                        updateFeatureDisplay();
                    }
                };

                const nextButton = document.createElement('button');
                nextButton.className = 'nav-button';
                nextButton.textContent = '>';
                nextButton.onclick = () => {
                    if (currentIndex < features.length - 1) {
                        currentIndex++;
                        updateFeatureDisplay();
                    }
                };

                navButtonsContainer.appendChild(prevButton);

                const featureContainer = document.createElement('div');
                featureContainer.className = 'geojson-feature';

                navButtonsContainer.appendChild(featureContainer);
                navButtonsContainer.appendChild(nextButton);
                container.appendChild(navButtonsContainer);

                function updateFeatureDisplay() {
                    featureContainer.innerHTML = '';

                    const feature = features[currentIndex];
                    const featureDiv = document.createElement('div');
                    featureDiv.className = 'geojson-feature';

                    const imgContainer = document.createElement('div');
                    imgContainer.style.position = 'relative'; // Gör det möjligt för ikonen att positioneras relativt till detta
                    featureDiv.appendChild(imgContainer);

                    const img = document.createElement('img');
                    img.src = feature.properties.Bild_massor;
                    img.alt = feature.properties.NAMN;
                    imgContainer.appendChild(img);

                    // Lägg till en container för ikonen och texten
                    const iconTextContainer = document.createElement('div');
                    iconTextContainer.className = 'icon-text-container';

                    // Lägg till ikonen över bilden
                    const iconOverlay = document.createElement('img');
                    iconOverlay.src = 'bilder/upptack/ikoner/ikon_massor.png';
                    iconOverlay.className = 'icon-overlay';
                    iconTextContainer.appendChild(iconOverlay);

                    // Lägg till texten "Mässa"
                    const textOverlay = document.createElement('span');
                    textOverlay.textContent = 'Mässa';
                    iconTextContainer.appendChild(textOverlay);

                    imgContainer.appendChild(iconTextContainer);

                    const name = document.createElement('h3');
                    name.textContent = feature.properties.NAMN;
                    featureDiv.appendChild(name);

                    const dates = document.createElement('p');
                    dates.textContent = `Datum: ${feature.properties.DATUM_FRAN} - ${feature.properties.DATUM_TILL}`;
                    featureDiv.appendChild(dates);

                    const info = document.createElement('p');
                    info.textContent = `Info: ${feature.properties.INFO}`;
                    featureDiv.appendChild(info);

                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.style.display = 'flex';
                    buttonsContainer.style.justifyContent = 'space-between';

                    const linkButton = document.createElement('button');
                    linkButton.className = 'link-button';
                    linkButton.onclick = () => {
                        window.open(feature.properties.LINK, '_blank');
                    };
                    linkButton.textContent = 'Mer info';
                    const linkImg = document.createElement('img');
                    linkImg.src = 'bilder/indexbilder/extern_link.png';
                    linkImg.alt = 'Extern länk';
                    linkImg.className = 'custom-image';
                    linkButton.appendChild(linkImg);
                    buttonsContainer.appendChild(linkButton);

                    const zoomButton = document.createElement('button');
                    zoomButton.className = 'link-button';
                    zoomButton.textContent = 'Zooma till';
                    zoomButton.onclick = () => {
                        zoomToCoordinates(feature.geometry.coordinates);
                    };
                    buttonsContainer.appendChild(zoomButton);

                    featureDiv.appendChild(buttonsContainer);
                    featureContainer.appendChild(featureDiv);
                }

                function zoomToCoordinates(coordinates) {
                    if (typeof map !== 'undefined') {
                        const zoomLevel = 13;
                        const latLng = L.latLng(coordinates[1], coordinates[0]);

                        map.setView(latLng, zoomLevel);

                        const offset = [0, 100];

                        const point = map.latLngToContainerPoint(latLng);
                        const newPoint = L.point(point.x + offset[0], point.y + offset[1]);
                        const newLatLng = map.containerPointToLatLng(newPoint);

                        map.setView(newLatLng, zoomLevel);
                    } else {
                        console.error("Kartan är inte definierad.");
                    }
                }

                updateFeatureDisplay();
            })
            .catch(error => {
                console.error('Error loading GeoJSON:', error);
            });
    }

    function createRekommendationerContent(contentDiv) {
        const container = document.createElement('div');
        container.className = 'button-container';

        const rekommendationerContent = document.createElement('p');
        rekommendationerContent.textContent = 'Här kommer det finnas rekommendationer på kurser och annat, välkommen åter.';
        container.appendChild(rekommendationerContent);

        contentDiv.appendChild(container);
    }
}
