document.addEventListener('DOMContentLoaded', function() {
    // Funktion för att visa modalen och ladda innehåll
    function showModal(layerName) {
        var modalId = getModalId(layerName);
        var modal = document.getElementById(modalId);
        if (modal) {
            var modalPath = getModalPath(layerName);

            fetch(modalPath)
                .then(response => response.text())
                .then(html => {
                    var modalContent = modal;
                    if (modalContent) {
                        modalContent.innerHTML = html;
                        modal.style.display = 'block';
                        
                        // Lägg till klickhändelser för att stänga modalen
                        var closeBtn = modal.querySelector('.close');
                        if (closeBtn) {
                            closeBtn.addEventListener('click', function() {
                                closeModal(modalId);
                            });
                        }
                    }
                })
                .catch(error => console.error('Error loading modal content:', error));
        } else {
            console.error('Modal not found:', modalId);
        }
    }

    // Funktion för att stänga modalen
    function closeModal(modalId) {
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        } else {
            console.error('Modal not found:', modalId);
        }
    }

    // Hjälpfunktion för att få modalens ID baserat på lagrets namn
    function getModalId(layerName) {
        switch(layerName) {
            case 'Allmän jakt: Däggdjur':
                return 'modal-daggdjur';
            case 'Allmän jakt: Fågel':
                return 'modal-fagel';
            case 'Älgjaktskartan':
                return 'modal-alg';
            case 'Älgjaktsområden':
                return 'modal-alg-omraden'; // För startmodalen
            case 'Upptäck':
                return 'modal-upptack'; // För Upptäck-lagret
            case 'Startmodal':
                return 'modal-startruta'; // För startmodalen
            default:
                return ''; // Om inget matchar
        }
    }

// Hjälpfunktion för att få rätt sökväg till modalfilen baserat på lagrets namn
function getModalPath(layerName) {
    switch(layerName) {
        case 'Allmän jakt: Däggdjur':
            return 'modaler/modal-daggdjur.html';
        case 'Allmän jakt: Fågel':
            return 'modaler/modal-fagel.html';
        case 'Älgjaktskartan':
            return 'modaler/modal-alg.html';
        case 'Älgjaktsområden':
            return 'modaler/modal-alg-omraden.html';
        case 'Upptäck':
            return 'modaler/modal-upptack.html';
        case 'Startmodal':
            return 'modaler/modal-startruta.html'; // Sökväg till startmodalen
        default:
            return ''; // Om inget matchar
    }
}


    // Lägg till klickhändelser för att visa modaler
    document.getElementById('fab-daggdjur')?.addEventListener('click', function() {
        showModal('Allmän jakt: Däggdjur');
    });
    document.getElementById('fab-fagel')?.addEventListener('click', function() {
        showModal('Allmän jakt: Fågel');
    });
    document.getElementById('fab-alg')?.addEventListener('click', function() {
        showModal('Älgjaktskartan');
    });
    document.getElementById('fab-alg-omraden')?.addEventListener('click', function() {
        showModal('Älgjaktsområden');
    });
    document.getElementById('fab-upptack')?.addEventListener('click', function() {
        showModal('Upptäck');
    });

    // Lägg till klickhändelse för att stänga modal när man klickar utanför modalen
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            const modals = ['modal-daggdjur', 'modal-fagel', 'modal-alg', 'modal-upptack', 'modal-startruta', 'modal-alg-omraden'];
            modals.forEach(id => closeModal(id));
        }
    });

    // Visa startmodalen när sidan initieras
    showModal('Startmodal');
});
