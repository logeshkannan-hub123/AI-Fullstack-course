export default async function fetchgeolocation(city) {
  city = city.trim();

  if (!city) {
    throw new Error("Please enter a city name.");
  }

  try {
    // Get latitude & longitude
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`,
    );

    if (!response.ok) {
      throw new Error(`Geocoding API Error (${response.status})`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("City not found.");
    }

    const { latitude, longitude, name, country } = data.results[0];

    // Get weather
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
    );

    if (!weatherResponse.ok) {
      throw new Error(`Weather API Error (${weatherResponse.status})`);
    }

    const weatherData = await weatherResponse.json();

    if (!weatherData.current_weather) {
      throw new Error("Weather data unavailable.");
    }

    return {
      city: name,
      country,
      latitude,
      longitude,
      ...weatherData,
    };
  } catch (error) {
    console.error(error);
    return {
      error: error.message,
    };
  } finally {
    console.log("fetchgeolocation() completed.");
  }
}
