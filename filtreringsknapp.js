document.addEventListener("DOMContentLoaded", function() {
    console.log("filtreringsknapp.js is loaded and running.");

    function initializeFilterButton() {
        const filterKnappContainer = document.createElement('div');
        Object.assign(filterKnappContainer.style, {
            position: 'fixed',
            top: '70%',
            right: '7px',
            transform: 'translateY(-40%)',
            zIndex: '400',
            display: 'none',
        });

        const filterKnapp = document.createElement('button');
        Object.assign(filterKnapp.style, {
            border: '1px solid rgb(50, 94, 88)',
            width: '55px',
            height: '55px',
            textAlign: 'center',
            textDecoration: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            transition: 'background-color 0.3s, box-shadow 0.3s',
        });

        // Lägger till bild i knappen
        const filterImg = document.createElement('img');
        Object.assign(filterImg.style, {
            maxWidth: '70%',
            maxHeight: '70%',
        });
        filterImg.src = 'bilder/indexbilder/filtrera_bild.svg'; // Ändra till korrekt bildsökväg
        filterImg.alt = 'Filtrera';

        filterKnapp.appendChild(filterImg);
        filterKnappContainer.appendChild(filterKnapp);
        document.body.appendChild(filterKnappContainer);

        console.log('Filterknapp skapad och tillagd i DOM');

        function updateButtonVisibility() {
            if (typeof Upptack_geojsonHandler !== 'undefined' && Upptack_geojsonHandler.layerIsActive) {
                const anyLayerActive = Object.values(Upptack_geojsonHandler.layerIsActive).some(isActive => isActive);
                filterKnappContainer.style.display = anyLayerActive ? 'block' : 'none';
                console.log('Button visibility updated:', anyLayerActive ? 'Visible' : 'Hidden');
            } else {
                console.log('Upptack_geojsonHandler or layerIsActive not defined.');
            }
        }

        // Event Listener för att uppdatera knappens synlighet från andra delar av sidan
        document.addEventListener('layerStatusChanged', updateButtonVisibility);

        filterKnapp.addEventListener('click', function() {
            // Toggle logik för att visa eller dölja filtermenyn
            if (filterContainer.style.display === 'none' || filterContainer.style.transform === 'translateX(100%) translateY(-50%)') {
                showFilterMenu();
            } else {
                hideFilterMenu();
            }
        });

        document.addEventListener('click', function(event) {
            if (!filterKnappContainer.contains(event.target) && !filterContainer.contains(event.target)) {
                hideFilterMenu();
            }
        });

        const filterContainer = document.createElement('div');
        Object.assign(filterContainer.style, {
            position: 'fixed',
            top: '50%', // Starta från mitten av skärmen
            right: '0',
            width: '250px',
            maxHeight: 'calc(100% - 20px)', // Maximal höjd är nästan hela skärmen
            backgroundColor: '#fff',
            boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.2)',
            padding: '10px',
            transform: 'translateX(100%) translateY(-50%)', // Positionera mitt i skärmen
            transition: 'transform 0.3s ease-in-out',
            display: 'none',
            borderTopLeftRadius: '10px', // Rundade hörn uppe vänster
            borderBottomLeftRadius: '10px', // Rundade hörn nere vänster
            overflowY: 'auto', // Lägg till skroll om innehållet överstiger maximal höjd
            zIndex: '401',
        });

        document.body.appendChild(filterContainer);

        // Lägger till rubriken "Filtrera"
        const header = document.createElement('h2');
        header.textContent = 'Filtrera innehåll:';
        header.style.marginTop = '0'; // Ta bort toppmarginal
        header.style.marginBottom = '15px'; // Lägg till lite utrymme under rubriken
        filterContainer.appendChild(header);

        function showFilterMenu() {
            filterContainer.style.display = 'block';
            setTimeout(() => {
                filterContainer.style.transform = 'translateX(0px) translateY(-50%)';
            }, 10);
        }

        function hideFilterMenu() {
            filterContainer.style.transform = 'translateX(100%) translateY(-50%)';
            setTimeout(() => {
                filterContainer.style.display = 'none';
            }, 300);
        }

        // Skapa innehåll i filtermenyn
        createFilterContent(filterContainer);

        function createFilterContent(contentDiv) {
            const container = document.createElement('div');
            container.style.marginTop = '10px';

            const filterList = document.createElement('ul');
            Object.assign(filterList.style, {
                listStyleType: 'none',
                padding: '0',
            });

            // Manuellt ordnade knappar
            const filters = [
                {
                    id: 'visaAlltButton',
                    text: 'Visa allt',
                    imgSrc: 'bilder/upptack/ikoner/ikon_visa_allt.png',
                    onChange: function() {
                        if (typeof Upptack_geojsonHandler !== 'undefined') {
                            console.log('Activating all layers');
                            Upptack_geojsonHandler.activateAllLayers();
                            notifyLayerStatusChanged(); // Uppdatera knappens synlighet
                        } else {
                            console.error("Upptack_geojsonHandler är inte definierad.");
                        }
                        hideFilterMenu(); // Stäng menyn efter att valet gjorts
                    }
                },
                {
                    id: 'jaktkortCheckbox',
                    text: 'Jaktkort',
                    imgSrc: 'bilder/upptack/ikoner/ikon_jaktkort.png',
                    onChange: function() {
                        if (typeof Upptack_geojsonHandler !== 'undefined') {
                            console.log('Filtering to Jaktkort layer');
                            Upptack_geojsonHandler.filterLayer('Jaktkort');
                            notifyLayerStatusChanged(); // Uppdatera knappens synlighet
                        } else {
                            console.error("Upptack_geojsonHandler är inte definierad.");
                        }
                        hideFilterMenu(); // Stäng menyn efter att valet gjorts
                    }
                },
                {
                    id: 'jaktskyttebanorCheckbox',
                    text: 'Jaktskyttebanor',
                    imgSrc: 'bilder/upptack/ikoner/ikon_jaktskyttebanor.png',
                    onChange: function() {
                        if (typeof Upptack_geojsonHandler !== 'undefined') {
                            console.log('Filtering to Jaktskyttebanor layer');
                            Upptack_geojsonHandler.filterLayer('Jaktskyttebanor');
                            notifyLayerStatusChanged(); // Uppdatera knappens synlighet
                        } else {
                            console.error("Upptack_geojsonHandler är inte definierad.");
                        }
                        hideFilterMenu(); // Stäng menyn efter att valet gjorts
                    }
                },
                {
                    id: 'kurserCheckbox',
                    text: 'Kurser (kommer snart)',
                    imgSrc: 'bilder/upptack/ikoner/ikon_kurser.png',
                    onChange: function() {
                        alert('Kurser kommer snart!');
                        hideFilterMenu(); // Stäng menyn efter att valet gjorts
                    }
                },
                {
                    id: 'massorCheckbox',
                    text: 'Mässor',
                    imgSrc: 'bilder/upptack/ikoner/ikon_massor.png',
                    onChange: function() {
                        if (typeof Upptack_geojsonHandler !== 'undefined') {
                            console.log('Filtering to Mässor layer');
                            Upptack_geojsonHandler.filterLayer('Mässor');
                            notifyLayerStatusChanged(); // Uppdatera knappens synlighet
                        } else {
                            console.error("Upptack_geojsonHandler är inte definierad.");
                        }
                        hideFilterMenu(); // Stäng menyn efter att valet gjorts
                    }
                }
            ];

            // Skapa knapparna baserat på den manuellt ordnade listan
            filters.forEach(filter => {
                const listItem = document.createElement('li');
                listItem.style.display = 'flex';
                listItem.style.alignItems = 'center';
                listItem.style.marginBottom = '10px'; // Lägg till lite utrymme mellan knapparna

                const button = document.createElement('button');
                button.style.display = 'flex';
                button.style.alignItems = 'center';
                button.style.width = '100%'; // Gör att knappen täcker hela bredden
                button.style.padding = '10px';
                button.style.border = '1px solid rgb(50, 94, 88)';
                button.style.borderRadius = '5px';
                button.style.backgroundColor = '#fff';
                button.style.cursor = 'pointer';
                button.style.transition = 'background-color 0.3s';
                button.onmouseover = function() {
                    button.style.backgroundColor = '#f0f0f0';
                };
                button.onmouseout = function() {
                    button.style.backgroundColor = '#fff';
                };

                const img = document.createElement('img');
                Object.assign(img.style, {
                    width: '30px',
                    height: 'auto',
                    marginRight: '10px',
                });
                img.src = filter.imgSrc;
                img.alt = filter.text;

                const span = document.createElement('span');
                span.textContent = filter.text;

                button.appendChild(img);
                button.appendChild(span);
                button.onclick = filter.onChange;

                listItem.appendChild(button);
                filterList.appendChild(listItem);
            });

            container.appendChild(filterList);
            contentDiv.appendChild(container);
        }

        // Försök att uppdatera knappens synlighet efter initialiseringen
        updateButtonVisibility();
    }

    // Fördröj initialiseringen tills Upptack_geojsonHandler är definierad
    function waitForUpptackHandler() {
        if (typeof Upptack_geojsonHandler !== 'undefined') {
            initializeFilterButton();
        } else {
            console.log('Waiting for Upptack_geojsonHandler to be defined...');
            setTimeout(waitForUpptackHandler, 100);
        }
    }

    waitForUpptackHandler();
});

// Anropa denna funktion varje gång du ändrar lagerstatus någon annanstans på sidan
function notifyLayerStatusChanged() {
    const event = new Event('layerStatusChanged');
    document.dispatchEvent(event);
}
