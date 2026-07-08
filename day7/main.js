import fetchgeolocation from "./api.js";

const form = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city");
const weatherDetails = document.querySelector("#weather");
const button = form.querySelector("button");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();
  const cityRegex = /^[A-Za-z\s]+$/;

  if (!city || !cityRegex.test(city)) {
    weatherDetails.innerHTML = `<p class="status status--warn">Please enter a city name.</p>`;
    return;
  }


  weatherDetails.innerHTML = `
    <div class="status status--loading">
      <span class="spinner"></span>
      Loading weather...
    </div>
  `;

  button.disabled = true;
  button.textContent = "Loading...";

  try {
    const weather = await fetchgeolocation(city);

    if (weather.error) {
      weatherDetails.innerHTML = `<p class="status status--error">${weather.error}</p>`;
      return;
    }

    const current = weather.current_weather;
    const units = weather.current_weather_units;

    weatherDetails.innerHTML = `
      <div class="weather-card">
        <div class="weather-card__header">
          <div>
            <h2>${weather.city}, ${weather.country}</h2>
            <p class="coords">${weather.latitude}°, ${weather.longitude}°</p>
          </div>
          <div class="weather-icon">${current.is_day ? "🌞" : "🌙"}</div>
        </div>

        <div class="weather-temp">
          ${current.temperature}<span>${units.temperature}</span>
        </div>
        <p class="updated">Updated ${new Date(current.time).toLocaleString()} · ${current.is_day ? "Day" : "Night"}</p>

        <div class="weather-stats">
          <div class="stat">
            <span class="stat-label">Wind Speed</span>
            <span class="stat-value">${current.windspeed} ${units.windspeed}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Wind Direction</span>
            <span class="stat-value">${current.winddirection}${units.winddirection}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Weather Code</span>
            <span class="stat-value">${current.weathercode}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Interval</span>
            <span class="stat-value">${current.interval} ${units.interval}</span>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    weatherDetails.innerHTML = `
      <p class="status status--error">Something went wrong. Please try again.</p>
    `;

    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = "See Weather";
  }
});
