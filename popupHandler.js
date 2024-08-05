// CSS för popup-panelen och knappen
var styleTag = document.createElement('style');
styleTag.type = 'text/css';
styleTag.innerHTML = `
    #popup-panel {
        position: fixed;
        bottom: 0px;
        width: 95%;
        max-height: 40%;
        background-color: #fff;
        border-top: 5px solid #fff;
        border-left: 5px solid #fff;
        border-right: 5px solid #fff;
        padding: 0px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        z-index: 1000;
        overflow-y: auto;
        word-wrap: break-word;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        font-family: 'Roboto', sans-serif;
        color: rgb(50, 94, 88);
        transform: translateY(100%);
        transition: transform 0.5s ease-in-out;
    }

    #popup-panel-content {
        margin: 0;
        padding: 0;
    }

    #popup-panel p {
        margin: 0 0 2px 0; /* Marginal endast nedåt */
    }

    #close-button {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: transparent;
        border: none;
        font-size: 20px;
        cursor: pointer;
        z-index: 1001;
    }

    @keyframes slideIn {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }

    @keyframes slideOut {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(100%);
        }
    }

    .show {
        animation: slideIn 0.5s forwards;
    }

    .hide {
        animation: slideOut 0.5s forwards;
    }

    #popup-panel img {
        max-width: 100%;
        border-radius: 10px; /* Rundade hörn för bilder */
    }

    .link-button {
        display: inline-flex;
        align-items: center;
        background-color: rgb(50, 94, 88); /* Färg på knappen */
        color: white;
        border: none;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 5px;
        max-height: 50px; /* Begränsar höjden */
        overflow: hidden;
    }

    .link-button img {
        max-height: 20px; /* Ändrar storlek på bilden */
        margin-left: 10px;
        border-radius: 0 !important; /* Tar bort rundade hörn med !important */
    }

    .link-button .custom-image {
        border-radius: 0 !important; /* Tar bort rundade hörn specifikt för denna bild */
    }

    .bold-center {
        font-weight: bold;
        font-size: 1.2em; /* Ändrar textstorleken */
    }

    /* Anpassa bredden på popup-panelen för större skärmar */
    @media (min-width: 768px) {
        #popup-panel {
            width: 50%;
        }
    }

    @media (min-width: 1024px) {
        #popup-panel {
            width: 30%;
        }
    }
`;

// Lägg till style-taggen till <head>
document.head.appendChild(styleTag);

var popupPanel = document.getElementById('popup-panel');
var popupPanelVisible = false;

// Skapa och lägg till stäng-knappen
var closeButton = document.createElement('button');
closeButton.id = 'close-button';
closeButton.innerHTML = '&times;';
closeButton.addEventListener('click', function(event) {
    event.stopPropagation(); // Förhindra att klicket bubblar upp till panelen
    hidePopupPanel();
});
popupPanel.appendChild(closeButton);

function isImageUrl(url) {
    return typeof url === 'string' && url.match(/\.(jpeg|jpg|png|webp|gif)$/i);
}

function translateKey(key) {
    return translationTable[key] || key;
}

// Tabell som matchar "Förvaltandelän" med motsvarande URL
var länURLTabell = {
    'Länsstyrelsen i Blekinge län': 'https://www.lansstyrelsen.se/blekinge/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen  Dalarnas län': 'https://www.lansstyrelsen.se/dalarna/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Gävleborgs län': 'https://www.lansstyrelsen.se/gavleborg/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Hallands län': 'https://www.lansstyrelsen.se/halland/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Jämtlands län': 'https://www.lansstyrelsen.se/jamtland/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Jönköpings län': 'https://www.lansstyrelsen.se/jonkoping/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Kalmar län': 'https://www.lansstyrelsen.se/kalmar/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Kronobergs län': 'https://www.lansstyrelsen.se/kronoberg/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Norrbottens Län': 'https://www.lansstyrelsen.se/norrbotten/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Skåne län': 'https://www.lansstyrelsen.se/skane/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Stockholm': 'https://www.lansstyrelsen.se/stockholm/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen Södermanland': 'https://www.lansstyrelsen.se/sodermanland/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Uppsala län': 'https://www.lansstyrelsen.se/uppsala/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Värmlands län': 'https://www.lansstyrelsen.se/varmland/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Västerbottens län': 'https://www.lansstyrelsen.se/vasterbotten/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen Västra Götalands län': 'https://www.lansstyrelsen.se/vastragotaland/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Västernorrlands län': 'https://www.lansstyrelsen.se/vasternorrland/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Västmanlands län': 'https://www.lansstyrelsen.se/vastmanland/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen i Örebro län': 'https://www.lansstyrelsen.se/orebro/djur/jakt-och-vilt/algjakt.html',
    'Länsstyrelsen Östergötland': 'https://www.lansstyrelsen.se/ostergotland/djur/jakt-och-vilt/algjakt.html'
};

function generatePopupContent(properties) {
    var content = '';
    var förvaltandelän = null;

    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];

            if (hideProperties.includes(key) || value == null || value === '') {
                continue;
            }

            if (hideNameOnlyProperties.includes(key)) {
                if (value) {
                    if (key === 'NAMN' || key === 'Rubrik' || key === 'GRÄNSÄLVSOMR' || key === 'LÄN' || key === 'lan_namn') {
                        content += '<p class="bold-center">' + value + '</p>';
                    } else {
                        content += '<p>' + value + '</p>';
                    }
                }
                continue;
            }

            if (isImageUrl(value)) {
                content += '<p><img src="' + value + '" alt="Bild"></p>';
            } else if (key.toLowerCase() === 'link' && value) {
                content += `
                    <p>
                        <button class="link-button" onclick="window.open('${value}', '_blank')">
                            Besök sidan
                            <img src="bilder/extern_link.png" alt="Extern länk" class="custom-image">
                        </button>
                    </p>`;
            } else {
                var translatedKey = translateKey(key);
                content += '<p><strong>' + translatedKey + ':</strong> ' + (value ? value : '') + '</p>';
            }

            // Hämta länkar för Förvaltandelän
            if (key === 'Förvaltandelän' && value) {
                förvaltandelän = value;
            }
        }
    }

    if (förvaltandelän && länURLTabell[förvaltandelän]) {
        content += `
            <p>
                <button class="link-button" onclick="window.open('${länURLTabell[förvaltandelän]}', '_blank')">
                    Jakttid: ${förvaltandelän}
                    <img src="bilder/extern_link.png" alt="Extern länk" class="custom-image">
                </button>
            </p>`;
    }

    return content;
}

function showPopupPanel(properties) {
    updatePopupPanelContent(properties);

    popupPanel.classList.remove('hide');
    popupPanel.classList.add('show');
    popupPanelVisible = true;

    requestAnimationFrame(function() {
        setTimeout(function() {
            var panelContent = document.getElementById('popup-panel-content');
            if (panelContent) {
                panelContent.scrollTop = 0;
            }
        }, 0);
    });
}

function hidePopupPanel() {
    popupPanel.classList.remove('show');
    popupPanel.classList.add('hide');
    popupPanelVisible = false;
}

function updatePopupPanelContent(properties) {
    var panelContent = document.getElementById('popup-panel-content');
    if (!panelContent) {
        console.error("Elementet 'popup-panel-content' hittades inte.");
        return;
    }

    var content = generatePopupContent(properties);

    panelContent.innerHTML = '';
    setTimeout(function() {
        panelContent.innerHTML = content;
        requestAnimationFrame(function() {
            setTimeout(function() {
                panelContent.scrollTop = 0;
            }, 0);
        });
    }, 0);
}

function addClickHandlerToLayer(layer) {
    layer.on('click', function(e) {
        try {
            if (e.originalEvent) {
                e.originalEvent.stopPropagation();
            }

            if (e.target && e.target.feature && e.target.feature.properties) {
                var properties = e.target.feature.properties;

                if (!popupPanelVisible) {
                    showPopupPanel(properties);
                } else {
                    updatePopupPanelContent(properties);
                }
            } else {
                console.error('Ingen geojson-information hittades i klickhändelsen.');
            }
        } catch (error) {
            console.error('Fel vid hantering av klickhändelse:', error);
        }
    });
}

document.addEventListener('click', function(event) {
    if (popupPanelVisible && !popupPanel.contains(event.target)) {
        hidePopupPanel();
    }
});

if (!popupPanel || !document.getElementById('popup-panel-content')) {
    console.error('Popup-panelen eller dess innehåll hittades inte i DOM.');
}
