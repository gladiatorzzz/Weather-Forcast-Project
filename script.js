/// script.js

document.getElementById('search-btn').addEventListener('click', getWeather);

function getWeather() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    const apiKey = 'a521599b57ca93e7ce15965bf01ec9ef'; // Replace with your actual OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(apiKey)}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.cod !== 200) {
                throw new Error(`Error: ${data.message}`);
            }
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            document.getElementById('weather-info').innerHTML = `<p>${error.message}</p>`;
        });
}

function displayWeather(data) {
    const { name, main, weather, wind, sys, clouds } = data;
    let weatherIconUrl;

    // Determine day or night based on sunrise and sunset times
    const sunrise = sys.sunrise * 1000; // Convert to milliseconds
    const sunset = sys.sunset * 1000; // Convert to milliseconds
    const currentTime = new Date().getTime();

    // Check if current time is between sunrise and sunset
    const isDay = currentTime > sunrise && currentTime < sunset;

    // Map weather conditions to day and night icons
    switch (weather[0].main.toLowerCase()) {
        case 'clear':
            weatherIconUrl = isDay ? 'sunny_day.png' : 'clear_night.png'; // Replace with your sunny day and clear night icon URLs
            break;
        case 'clouds':
            weatherIconUrl = isDay ? 'cloudy_day.png' : 'cloudy_night.png'; // Replace with your cloudy day and cloudy night icon URLs
            break;
        case 'rain':
        case 'drizzle':
            weatherIconUrl = 'rainy.png'; // Replace with your rainy icon URL
            break;
        case 'thunderstorm':
            weatherIconUrl = isDay ? 'thunderstorm_day.png' :'thunderstorm_night.png'; // Replace with your thunderstorm icon URL
            break;
        case 'mist':
            weatherIconUrl = 'mist.png'; // Replace with your rainy icon URL
            break; 
        case 'haze':
            weatherIconUrl = 'haze.png'; // Replace with your rainy icon URL
            break;     
               
        default:
            weatherIconUrl = ''; // Default to no icon or handle other conditions
            break;
    }

    document.getElementById('weather-info').innerHTML = `
        <h2>Weather in ${name}, ${sys.country}</h2>
        <p><strong>Temperature:</strong> ${main.temp}°C</p>
        <p><strong>Feels Like:</strong> ${main.feels_like}°C</p>
        <p><strong>Min Temperature:</strong> ${main.temp_min}°C</p>
        <p><strong>Max Temperature:</strong> ${main.temp_max}°C</p>
        <p><strong>Humidity:</strong> ${main.humidity}%</p>
        <p><strong>Pressure:</strong> ${main.pressure} hPa</p>
        <img src="${weatherIconUrl}" alt="Weather Icon" style="width: 100px;"> <!-- Adjust size as needed -->
        <p><strong>Weather:</strong> ${weather[0].main} (${weather[0].description})</p>
        <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
        <p><strong>Cloudiness:</strong> ${clouds.all}%</p>
    `;
}
