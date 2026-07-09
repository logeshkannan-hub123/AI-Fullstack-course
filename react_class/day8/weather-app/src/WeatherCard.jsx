import "./WeatherCard.css";

const WEATHER_CODES = {
  0: { icon: "☀️", label: "Clear sky" },
  1: { icon: "🌤️", label: "Mainly clear" },
  2: { icon: "⛅", label: "Partly cloudy" },
  3: { icon: "☁️", label: "Overcast" },
  45: { icon: "🌫️", label: "Fog" },
  48: { icon: "🌫️", label: "Fog" },
  51: { icon: "🌦️", label: "Light drizzle" },
  53: { icon: "🌦️", label: "Drizzle" },
  55: { icon: "🌦️", label: "Dense drizzle" },
  61: { icon: "🌧️", label: "Light rain" },
  63: { icon: "🌧️", label: "Rain" },
  65: { icon: "🌧️", label: "Heavy rain" },
  71: { icon: "❄️", label: "Light snow" },
  73: { icon: "❄️", label: "Snow" },
  75: { icon: "❄️", label: "Heavy snow" },
  80: { icon: "🌦️", label: "Rain showers" },
  95: { icon: "⛈️", label: "Thunderstorm" },
};

function getWeatherInfo(code) {
  return WEATHER_CODES[Number(code)] ?? { icon: "🌡️", label: "Weather" };
}

function formatTime(time) {
  if (!time) return "";

  const date = new Date(time);

  if (Number.isNaN(date.getTime())) return time;

  return date.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function WeatherCard(props) {
  const { icon, label } = getWeatherInfo(props.WeatherCode);

  return (
    <div className="card">
      <div className="card-top">
        <div>
          <p className="card-eyebrow">Current Weather</p>
          <h2 className="card-city">{props.city}</h2>
          <span>{props.country}</span>
          <br />
          <span>{props.state}</span>
          <p className="card-time">
            <span className="card-time-icon" aria-hidden="true">
              🕒
            </span>
            {formatTime(props.time)}
          </p>
        </div>
        <div className="card-icon" title={label} aria-hidden="true">
          {icon}
        </div>
      </div>

      <div className="card-temp-row">
        <p className="card-temp">
          {props.temp}
          <span>°C</span>
        </p>
        <span className="card-condition">{label}</span>
      </div>

      <div className="card-stats">
        <div className="stat">
          <span className="stat-icon" aria-hidden="true">
            💨
          </span>
          <span className="stat-label">Wind Speed</span>
          <span className="stat-value">{props.WindSpeed}</span>
        </div>
        <div className="stat">
          <span className="stat-icon" aria-hidden="true">
            🧭
          </span>
          <span className="stat-label">Wind Direction</span>
          <span className="stat-value">{props.WindDirection}</span>
        </div>
        <div className="stat">
          <span className="stat-icon" aria-hidden="true">
            🔢
          </span>
          <span className="stat-label">Weather Code</span>
          <span className="stat-value">{props.WeatherCode}</span>
        </div>
        <div className="stat">
          <span className="stat-icon" aria-hidden="true">
            ⏱️
          </span>
          <span className="stat-label">Interval</span>
          <span className="stat-value">{props.Interval}</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
