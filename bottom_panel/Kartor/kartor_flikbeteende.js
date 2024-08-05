function openKartor() {
    // Dölj andra flikar
    document.getElementById('tab1').style.display = 'none';

    // Hitta tab-pane för kartor
    const tabPane = document.getElementById('tab2');
    if (!tabPane) {
        console.error('Tab pane for kartor not found.');
        return;
    }

    // Visa tab2
    tabPane.style.display = 'flex';

    // Rensa tidigare innehåll
    tabPane.innerHTML = '';

    // Skapa och lägg till en rubrik högst upp
    const header = document.createElement('h1');
    header.textContent = 'Kartor - Allmän jakt';
    header.className = 'tab1-2-header-title';
    tabPane.appendChild(header);

    // Skapa en container div för att centrera innehållet
    const container = document.createElement('div');
    container.className = 'button-container'; // Använd samma klass för stilsättning

    // Skapa knapp-container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container'; // Använd samma klass för stilsättning

    // Definiera knapparna med deras respektive egenskaper
    const buttons = [
        {
            className: 'styled-button', // Använd samma klass för stilsättning
            onclick: function() {
                Kartor_geojsonHandler.toggleLayer('Allmän jakt: Däggdjur', [
                    'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_daggdjur/geojsonfiler/Rvjaktilvdalenskommun_1.geojson', 
                    'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_daggdjur/geojsonfiler/Allman_jakt_daggdjur_2.geojson'
                ]);
            },
            imgSrc: 'bottom_panel/Kartor/bilder/daggdjurikon.png',
            imgAlt: 'Allmän jakt: Däggdjur'
        },
        {
            className: 'styled-button', // Använd samma klass för stilsättning
            onclick: function() {
                Kartor_geojsonHandler.toggleLayer('Allmän jakt: Fågel', [
                    'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/OvanfrLapplandsgrnsen_4.geojson', 
                    'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/NedanfrLappmarksgrnsen_3.geojson', 
                    'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Grnsfrripjaktilvdalenskommun_2.geojson', 
                    'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/Lnsindelning_1.geojson', 
                    'https://raw.githubusercontent.com/jaktkartan/jaktkartan/main/bottom_panel/Kartor/Allman_jakt_Fagel/geojsonfiler/GrnslvsomrdetillFinland_5.geojson'
                ]);
            },
            imgSrc: 'bottom_panel/Kartor/bilder/fagelikon.png',
            imgAlt: 'Allmän jakt: Fågel'
        },
        {
            className: 'styled-button', // Använd samma klass för stilsättning
            id: 'huvudknapp-älgjakt-button', // Ändrad id
            imgSrc: 'bottom_panel/Kartor/bilder/algikon.png',
            imgAlt: 'Huvudknapp-Älgjakt' // Ändrad imgAlt
        }
    ];

    // Skapa knappar och lägg till dem i knapp-container
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = button.className;
        btn.id = button.id || '';

        if (button.onclick) {
            btn.onclick = button.onclick;
        }

        const img = document.createElement('img');
        img.src = button.imgSrc;
        img.alt = button.imgAlt;
        btn.appendChild(img);

        buttonContainer.appendChild(btn);
    });

    // Lägg till knapp-container till tab-pane
    tabPane.appendChild(buttonContainer);

    // Lägg till tab-pane till container
    container.appendChild(tabPane);

    // Lägg till container till body
    document.body.appendChild(container);

    // Skapa en meny för huvudknappen Älgjakt
    const huvudknappAlgjaktButton = document.getElementById('huvudknapp-älgjakt-button');

    // Hantera klick på huvudknappen
    huvudknappAlgjaktButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Förhindra att klick utanför menyn stänger den
        showElkMapOptions();
    });

    // Funktion för att visa alternativ för Algforvaltningsomrade
    function showElkMapOptions() {
        buttonContainer.innerHTML = ''; // Rensa knappcontainern

        const elkJaktsomradenButton = document.createElement('button');
        elkJaktsomradenButton.className = 'styled-button';
        elkJaktsomradenButton.textContent = 'Älgjaktsområden'; // Lägg till texten direkt
        elkJaktsomradenButton.onclick = function() {
            // Ladda WMS-lager för Älgjaktsområden
            Kartor_geojsonHandler.toggleLayer('Älgjaktsområden');
        };

        const elkAlternativButton = document.createElement('button');
        elkAlternativButton.className = 'styled-button';
        elkAlternativButton.textContent = 'Älgförvaltningsområden & Jakttider'; // Lägg till texten direkt
        elkAlternativButton.onclick = function() {
            // Ladda WMS-lager för Algforvaltningsomrade
            Kartor_geojsonHandler.toggleLayer('Algforvaltningsomrade');
            restoreOriginalButtons();
        };

        buttonContainer.appendChild(elkJaktsomradenButton);
        buttonContainer.appendChild(elkAlternativButton);
    }

    // Funktion för att återställa de ursprungliga knapparna
    function restoreOriginalButtons() {
        buttonContainer.innerHTML = '';

        // Skapa och lägg till ursprungliga knappar
        buttons.forEach(button => {
            if (button.id !== 'huvudknapp-älgjakt-button') {
                const btn = document.createElement('button');
                btn.className = button.className;
                if (button.onclick) {
                    btn.onclick = button.onclick;
                }

                const img = document.createElement('img');
                img.src = button.imgSrc;
                img.alt = button.imgAlt;

                btn.appendChild(img);
                buttonContainer.appendChild(btn);
            }
        });

        // Lägg till knappen för Huvudknapp Älgjakt igen
        buttonContainer.appendChild(huvudknappAlgjaktButton);
    }

    // Debugging
    console.log('Kartor tab created and added to body');
}
