// CSS för popup-panelen
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
        padding: 10px;
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
`;

// Lägg till style-taggen till <head>
document.head.appendChild(styleTag);

var popupPanel = document.getElementById('popup-panel');
var popupPanelVisible = false;

function isImageUrl(url) {
    return typeof url === 'string' && (url.match(/\.(jpeg|jpg|png|webp|gif)$/i) || (url.includes('github.com') && url.includes('?raw=true')));
}

function translateKey(key) {
    return translationTable[key] || key;
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
                console.log('Scroll position återställd till toppen när panelen visades');
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

    console.log('Egenskaper som skickas till popup-panelen:', properties);

    var content = '';

    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var value = properties[key];

            if (hideProperties.includes(key) || (hideNameOnlyProperties.includes(key) && !value)) {
                continue;
            }

            if (isImageUrl(value)) {
                content += '<p><img src="' + value + '" alt="Bild"></p>';
                console.log('Bild URL:', value);
            } else {
                var translatedKey = translateKey(key);
                content += '<p><strong>' + translatedKey + ':</strong> ' + (value ? value : '') + '</p>';
            }
        }
    }

    panelContent.innerHTML = '';
    setTimeout(function() {
        panelContent.innerHTML = content;
        requestAnimationFrame(function() {
            setTimeout(function() {
                panelContent.scrollTop = 0;
                console.log('Scroll position återställd till toppen efter att innehållet uppdaterats');
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
                console.log('Klickade på ett geojson-objekt med egenskaper:', properties);

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
