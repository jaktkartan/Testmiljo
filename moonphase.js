// Importera Moon och LunarPhase från lunarphase-js ESM-modul från Skypack CDN
import { Moon, LunarPhase, Hemisphere } from 'https://cdn.skypack.dev/lunarphase-js@2.0.2';

// Funktion för att lägga till CSS-stilar dynamiskt
function addStyles(styles) {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

// Lägg till CSS-stilar
addStyles(`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

    body, button, span, div {
        font-family: 'Roboto', sans-serif !important;
        color: rgb(50, 94, 88); /* Textfärg */
    }

    #moon-phase-container {
        position: fixed;
        top: 3px;
        right: 4px;
        z-index: 9999;
        text-align: center; /* Centrera text och bild */
    }
    #moon-phase {
        display: block;
    }
    #moon-image {
        width: 45px;
        height: auto;
        cursor: pointer; /* Visa att bilden är klickbar */
    }
    #moon-phase-label {
        font-size: 12px; /* Ställ in textstorlek */
        margin-top: -6px; /* Använd mindre negativ marginal för att flytta texten närmare bilden */
    }
    #moon-phase-info {
        position: absolute;
        top: 50px; /* Justera positionen som behövs */
        right: 0;
        background-color: white;
        border: 1px solid rgb(50, 94, 88); /* Ramfärg */
        padding: 5px; /* Minska padding */
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .moon-phase-item {
        margin-bottom: 5px; /* Minska marginalen mellan ramarna */
        text-align: center;
        border: 1px solid rgb(50, 94, 88); /* Ramfärg */
        padding: 2px; /* Minska padding i varje ram */
        border-radius: 5px;
        display: inline-block; /* Förhindra radbrytning */
        white-space: nowrap; /* Förhindra radbrytning av datum */
    }
    .moon-phase-item img {
        width: 45px;
        height: auto;
    }
`);

// Funktion för att få bildkälla baserat på månfas
function getMoonPhaseImageSrc(phase) {
    switch(phase) {
        case LunarPhase.NEW:
            return 'bilder/indexbilder/moonface/moonface-new-moon.png';
        case LunarPhase.WAXING_CRESCENT:
            return 'bilder/indexbilder/moonface/moonface-waxing-crescent-moon.png';
        case LunarPhase.FIRST_QUARTER:
            return 'bilder/indexbilder/moonface/moonface-first-quarter-moon.png';
        case LunarPhase.WAXING_GIBBOUS:
            return 'bilder/indexbilder/moonface/moonface-waxing-gibbous-moon.png';
        case LunarPhase.FULL:
            return 'bilder/indexbilder/moonface/moonface-full-moon.png';
        case LunarPhase.WANING_GIBBOUS:
            return 'bilder/indexbilder/moonface/moonface-waning-gibbous-moon.png';
        case LunarPhase.LAST_QUARTER:
            return 'bilder/indexbilder/moonface/moonface-last-quarter-moon.png';
        case LunarPhase.WANING_CRESCENT:
            return 'bilder/indexbilder/moonface/moonface-waning-crescent-moon.png';
        default:
            return 'bilder/indexbilder/moonface/default-moon.png';
    }
}

// Funktion för att beräkna kommande månfaser
function getUpcomingMoonPhases(hemisphere, startDate) {
    const phases = [];
    const currentDate = new Date(startDate);
    const currentPhase = Moon.lunarPhase(currentDate, { hemisphere });

    // Hoppa till nästa dag
    currentDate.setDate(currentDate.getDate() + 1);

    // Begränsa antalet iterationer för att förhindra oändlig loop
    let iterations = 0;
    const maxIterations = 365; // ett år

    while (phases.length < 8 && iterations < maxIterations) {
        const phase = Moon.lunarPhase(currentDate, { hemisphere });

        // Lägg bara till fasen om den är annorlunda än den nuvarande
        if (phase !== currentPhase && !phases.find(p => p.phase === phase)) {
            phases.push({ phase, date: new Date(currentDate) });
        }

        currentDate.setDate(currentDate.getDate() + 1);
        iterations++;
    }

    return phases;
}

// Vänta tills dokumentet är laddat
document.addEventListener('DOMContentLoaded', () => {
    console.log("Document fully loaded and parsed");

    // Hämta dagens datum
    const today = new Date();

    // Beräkna månens fas för norra halvklotet
    const moonPhase = Moon.lunarPhase(today, { hemisphere: Hemisphere.NORTHERN });
    console.log(`Today's moon phase: ${moonPhase}`); // Lägg till loggning för månfasen

    const moonPhaseContainer = document.getElementById('moon-phase-container');
    const moonImageElement = document.getElementById('moon-image');
    const moonPhaseInfo = document.getElementById('moon-phase-info');

    if (moonPhaseContainer && moonImageElement) {
        // Bestäm bild baserat på månens fas
        let moonImageSrc = getMoonPhaseImageSrc(moonPhase);

        // Sätt bildens källa
        console.log(`Setting moon image source to: ${moonImageSrc}`); // Lägg till loggning för bildkällan
        moonImageElement.src = moonImageSrc;
        moonImageElement.onerror = function() {
            console.error(`Failed to load image: ${moonImageSrc}`);
        };

        // Lägg till texten "Månfas" under bilden
        let moonPhaseLabel = document.getElementById('moon-phase-label');
        if (!moonPhaseLabel) {
            moonPhaseLabel = document.createElement('div');
            moonPhaseLabel.id = 'moon-phase-label';
            moonPhaseLabel.innerText = 'Månfas';
            moonPhaseContainer.appendChild(moonPhaseLabel);
        }

        // Hantera klickhändelsen för månfasbilden
        moonImageElement.addEventListener('click', () => {
            const upcomingPhases = getUpcomingMoonPhases(Hemisphere.NORTHERN, today);
            moonPhaseInfo.innerHTML = '<strong>Kommande månfaser:</strong><br>';
            upcomingPhases.forEach(phase => {
                const phaseItem = document.createElement('div');
                phaseItem.className = 'moon-phase-item';
                phaseItem.innerHTML = `
                    <img src="${getMoonPhaseImageSrc(phase.phase)}" alt="${phase.phase}" />
                    <div>${phase.date.toLocaleDateString()}</div>
                `;
                moonPhaseInfo.appendChild(phaseItem);
            });
            moonPhaseInfo.style.display = 'block';
        });

        // Stäng informationen när användaren klickar utanför den
        document.addEventListener('click', (event) => {
            if (!moonPhaseContainer.contains(event.target)) {
                moonPhaseInfo.style.display = 'none';
                moonPhaseInfo.innerHTML = ''; // Töm innehållet när popup stängs
            }
        });
    } else {
        console.error("Moon phase container or moon image element not found");
    }
});
