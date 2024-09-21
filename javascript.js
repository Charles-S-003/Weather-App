
const timeE1 = document.getElementById('time');
const dateE1 = document.getElementById('date');
const currentWeatherItemsE1 = document.getElementById('current-weather-items');
const timezone = document.getElementById('timezone');
const countryE1 = document.getElementById('country');
const weatherForecastE1 = document.getElementById('weather-forecast');
const currentTempE1 = document.getElementById('current-temp');

const days = ['SunDay', 'MonDay', 'TuesDay', 'WednesDay', 'ThursDay', 'FriDay', 'SaturDay'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; // Padding single digit minutes
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeE1.innerHTML = hoursIn12HrFormat + ':' + formattedMinutes + ' ' + `<span id="am-pm">${ampm}</span>`;
    dateE1.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}, 1000);

window.onload = getWeatherData;
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;

        // Fetch current weather and daily forecast, including sunrise and sunset
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`)
            .then(res => res.json())
            .then(data => {
                console.log(data);  // Debugging
                showWeatherData(data.current_weather, data.daily);
                showForecast(data.daily);
            });
    });
}

function showWeatherData(currentWeather, dailyData) {
    let { temperature, windspeed } = currentWeather;

    // Format sunrise and sunset times
    const sunrise = new Date(dailyData.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(dailyData.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    currentWeatherItemsE1.innerHTML = `
        <div class="weather-item">
            <div>Temperature</div>
            <div>${temperature}&#176; C</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${windspeed} m/s</div>
        </div>
        <div class="weather-item">
            <div>Sunrise</div>
            <div>${sunrise}</div>
        </div>
        <div class="weather-item">
            <div>Sunset</div>
            <div>${sunset}</div>
        </div>`;
}

function showForecast(data) {
    let otherDayForecast = '';

    data.time.forEach((day, idx) => {
        if (idx === 0) {
            // Skip current day
        } else {
            otherDayForecast += `
                <div class="weather-forecast-item">
                    <div class="day">${new Date(day).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                    <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather icon">
                    <div class="temp">Night - ${data.temperature_2m_min[idx]}&#176; C</div>
                    <div class="temp">Day - ${data.temperature_2m_max[idx]}&#176; C</div>
                </div>`;
        }
    });

    weatherForecastE1.innerHTML = otherDayForecast;
}
