const form = document.querySelector('#weather-form');
const cityInput = document.querySelector('#city-input');
const apiKeyInput = document.querySelector('#api-key');
const searchButton = document.querySelector('#search-button');
const statusEl = document.querySelector('#status');
const weatherCard = document.querySelector('#weather-card');

const icons = {
  Thunderstorm: '⛈', Drizzle: '🌦', Rain: '🌧', Snow: '❄',
  Clear: '☀', Clouds: '☁', Mist: '🌫', Smoke: '🌫',
  Haze: '🌫', Dust: '🌫', Fog: '🌫', Sand: '🌫',
  Ash: '🌋', Squall: '💨', Tornado: '🌪'
};

function showStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function makeWeatherTip(main, temp) {
  if (main === 'Rain' || main === 'Drizzle' || main === 'Thunderstorm') {
    return 'Rain may be around. Consider carrying an umbrella before heading out.';
  }
  if (main === 'Snow') return 'It may be snowy or icy. Dress warmly and take care on the roads.';
  if (temp >= 32) return 'It is hot outside. Drink water regularly and seek shade when possible.';
  if (temp <= 8) return 'It is chilly. A warm layer may make your day more comfortable.';
  if (main === 'Clear') return 'Clear skies! Check the UV index from a trusted local forecast before spending long periods outdoors.';
  return 'Conditions can change. Check again before travelling or planning outdoor activities.';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!city) {
    showStatus('Please enter a city name.', 'error');
    cityInput.focus();
    return;
  }
  if (!apiKey) {
    showStatus('Please add your OpenWeatherMap API key in “API key settings” first.', 'error');
    document.querySelector('.api-settings').open = true;
    apiKeyInput.focus();
    return;
  }

  searchButton.disabled = true;
  searchButton.textContent = 'Loading…';
  showStatus(`Getting current weather for ${city}…`);
  weatherCard.classList.add('hidden');

  try {
    const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    url.search = new URLSearchParams({
      q: city,
      appid: apiKey,
      units: 'metric'
    }).toString();

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) throw new Error('City not found. Check the spelling and try again.');
      if (response.status === 401) throw new Error('API key not accepted yet. Check the key; newly created keys can take some time to activate.');
      if (response.status === 429) throw new Error('The API request limit was reached. Please try again later.');
      throw new Error(data.message ? data.message[0].toUpperCase() + data.message.slice(1) : 'Could not retrieve weather right now.');
    }

    const weather = data.weather?.[0] || {};
    const main = weather.main || 'Unknown';
    const temp = Math.round(data.main.temp);
    document.querySelector('#location').textContent = `${data.name}, ${data.sys?.country || ''}`.replace(/,\s*$/, '');
    document.querySelector('#local-date').textContent = new Date().toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric'
    });
    document.querySelector('#weather-symbol').textContent = icons[main] || '🌤';
    document.querySelector('#temperature').textContent = temp;
    document.querySelector('#condition').textContent = weather.description || main;
    document.querySelector('#humidity').textContent = data.main.humidity;
    document.querySelector('#wind').textContent = Number(data.wind?.speed || 0).toFixed(1);
    document.querySelector('#updated').textContent = `Updated at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
    document.querySelector('#weather-tip').textContent = makeWeatherTip(main, temp);

    weatherCard.classList.remove('hidden');
    showStatus('Weather loaded successfully.', 'success');
  } catch (error) {
    showStatus(error.message || 'Network error. Check your connection and try again.', 'error');
  } finally {
    searchButton.disabled = false;
    searchButton.innerHTML = 'Check weather <span aria-hidden="true">→</span>';
  }
});
