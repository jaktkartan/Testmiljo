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
    }

    #moon-phase-container {
        position: fixed;
        top: 4px;
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
    }
    #moon-phase-label {
        font-size: 12px; /* Ställ in textstorlek */
        margin-top: -10px; /* Använd negativ marginal för att flytta texten närmare bilden */
    }
`);

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

    if (moonPhaseContainer && moonImageElement) {
        // Bestäm bild baserat på månens fas
        let moonImageSrc;
        switch(moonPhase) {
            case LunarPhase.NEW:
                moonImageSrc = 'bilder/moonface/moonface-new-moon.png';
                break;
            case LunarPhase.WAXING_CRESCENT:
                moonImageSrc = 'bilder/moonface/moonface-waxing-crescent-moon.png';
                break;
            case LunarPhase.FIRST_QUARTER:
                moonImageSrc = 'bilder/moonface/moonface-first-quarter-moon.png';
                break;
            case LunarPhase.WAXING_GIBBOUS:
                moonImageSrc = 'bilder/moonface/moonface-waxing-gibbous-moon.png';
                break;
            case LunarPhase.FULL:
                moonImageSrc = 'bilder/moonface/moonface-full-moon.png';
                break;
            case LunarPhase.WANING_GIBBOUS:
                moonImageSrc = 'bilder/moonface/moonface-waning-gibbous-moon.png';
                break;
            case LunarPhase.LAST_QUARTER:
                moonImageSrc = 'bilder/moonface/moonface-last-quarter-moon.png';
                break;
            case LunarPhase.WANING_CRESCENT:
                moonImageSrc = 'bilder/moonface/moonface-waning-crescent-moon.png';
                break;
            default:
                console.log(`Unhandled moon phase: ${moonPhase}`);
                moonImageSrc = 'bilder/moonface/default-moon.png';
                break;
        }

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
    } else {
        console.error("Moon phase container or moon image element not found");
    }
});
