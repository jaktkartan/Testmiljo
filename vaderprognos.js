// Funktion för att toggle väderpanelen
function togglePanel() {
    console.log("Toggling weather panel...");
    var weatherInfo = document.getElementById('weather-info');
    if (weatherInfo.style.display === 'none') {
        console.log("Showing weather panel...");
        weatherInfo.style.display = 'block';
        getUserPosition(function(lat, lon) {
            console.log("Current position:", lat, lon);
            getWeatherForecast(lat, lon);
        }, function(error) {
            console.error("Error getting position:", error);
        });
    } else {
        console.log("Hiding weather panel...");
        weatherInfo.style.display = 'none';
    }
}


// Funktion som översätter vädersymbolkoder till förståeliga strängar på svenska.
const translateWeatherSymbol = (symbolCode) => {
    switch(symbolCode) {
        case 'clearsky_day':
            return 'klart väder';
        case 'clearsky_night':
            return 'klart väder';
        case 'partlycloudy_day':
            return 'delvis molnigt';
        case 'partlycloudy_night':
            return 'delvis molnigt';
        case 'cloudy':
            return 'molnigt';
        case 'fair_day':
            return 'växlande molnighet';
        case 'fair_night':
            return 'växlande molnighet';
        case 'rain':
            return 'regn';
        case 'lightrain':
            return 'lätt regn';
        case 'lightrain_showers_day':
            return 'lätt regnskurar';
        case 'lightrain_showers_night':
            return 'lätt regnskurar';
        case 'rain_showers_day':
            return 'regnskurar';
        case 'rain_showers_night':
            return 'regnskurar';
        case 'heavyrain':
            return 'kraftigt regn';
        case 'thunderstorm':
            return 'åska';
        case 'lightrainandthunder':
            return 'lätt regn och åska';
        case 'rainandthunder':
            return 'regn och åska';
        case 'sleet':
            return 'snöblandat regn';
        case 'snow':
            return 'snö';
        case 'sleet_showers_day':
            return 'snöblandade regnskurar';
        case 'sleet_showers_night':
            return 'snöblandade regnskurar';
        case 'snow_showers_day':
            return 'snöskurar';
        case 'snow_showers_night':
            return 'snöskurar';
        case 'fog':
            return 'dimma';
        case 'rainshowers_day':
            return 'regnskurar';
        case 'heavyrainandthunder':
            return 'kraftigt regn och åska';
        default:
            return symbolCode ? `okänt väder (${symbolCode})` : 'okänt väder';
    }
}


// Funktion för att hämta väderprognosen från en väder-API baserat på givna latitud- och longitudvärden.
const getWeatherForecast = (latitude, longitude) => {
    console.log('Hämtar väderprognos för lat:', latitude, 'lon:', longitude);
    const forecastAPIURL = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`;
    document.getElementById('weather-text').innerHTML = 'Laddar väderprognos...'; // Laddningsindikator

    fetch(forecastAPIURL)
        .then(response => {
            console.log('Svar mottagen från API');
            return response.json();
        })
        .then(data => {
            console.log('Data parsad');
            const timeseries = data.properties.timeseries;
            console.log('Timeseries:', timeseries);
            if (!timeseries || timeseries.length === 0) {
                throw new Error('Ingen väderprognos tillgänglig.');
            }
            let currentWeather = null;
            let weatherIntervalStart = null;
            let weatherIntervalEnd = null;
            let weatherForecast = '';
            const now = new Date();
            const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 timmar senare
            timeseries.forEach((forecast, index) => {
                // Kontrollera om 'forecast' är definierat och har 'time' egenskapen
                if (!forecast || !forecast.time) {
                    return; // Hoppa över denna iteration om 'forecast' saknar 'time'
                }
                const forecastTime = new Date(forecast.time);
                if (forecastTime <= twentyFourHoursLater) {
                    const weather = translateWeatherSymbol(forecast.data.next_1_hours?.summary?.symbol_code);
                    if (weather !== currentWeather) {
                        if (currentWeather !== null) {
                            // Slutet av föregående väderintervall
                            weatherForecast += `${weatherIntervalStart.toLocaleTimeString([], { hour: '2-digit' })}-${weatherIntervalEnd.toLocaleTimeString([], { hour: '2-digit' })}: ${currentWeather}<br>`;
                        }
                        // Början av nytt väderintervall
                        currentWeather = weather;
                        weatherIntervalStart = forecastTime;
                        weatherIntervalEnd = forecastTime;
                    } else {
                        // Fortsättning av samma väderintervall
                        weatherIntervalEnd = forecastTime;
                    }
                }
            });
            // Lägg till sista väderintervallet
            if (currentWeather !== null) {
                weatherForecast += `${weatherIntervalStart.toLocaleTimeString([], { hour: '2-digit' })}-${weatherIntervalEnd.toLocaleTimeString([], { hour: '2-digit' })}: ${currentWeather}<br>`;
            }
            document.getElementById('weather-text').innerHTML = weatherForecast;
        })
        .catch(error => {
            console.error('Fel vid hämtning av väderprognos:', error);
            document.getElementById('weather-text').innerHTML = 'Misslyckades att hämta väderprognos.';
        });
};

// Funktion för att hämta och visa väderprognosen baserat på användarens position
const showWeatherForecast = () => {
    if (navigator.geolocation) {
        const geoOptions = {
            enableHighAccuracy: false, // Använd mindre exakt men snabbare positionshämtning
            timeout: 10000, // Vänta högst 10 sekunder på att få en position
            maximumAge: 30000 // Använd en cachelagrad position som är upp till 30 sekunder gammal
        };
        const geoSuccess = (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeatherForecast(latitude, longitude);
        };
        const geoError = (error) => {
            console.error('Fel vid hämtning av position:', error);
            document.getElementById('weather-text').innerHTML = 'Misslyckades att hämta position.';
        };
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    } else {
        console.error('Geolocation är inte tillgängligt.');
        document.getElementById('weather-text').innerHTML = 'Geolocation är inte tillgängligt.';
    }
};

// Kör funktionen för att hämta väderprognosen när sidan laddas
window.onload = showWeatherForecast;
