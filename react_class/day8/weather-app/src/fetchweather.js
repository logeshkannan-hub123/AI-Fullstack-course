import fetchgeolocation from "./fetchgeolocation";

export default async function fetchweather(city) {
  // First get latitude & longitude
  const location = await fetchgeolocation(city);

  // Validation failed
  if (location.error) {
    return location;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    // -------------------------
    // Get Current Weather
    // -------------------------
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`,
      {
        signal: controller.signal,
      },
    );

    if (!weatherResponse.ok) {
      throw new Error(`Weather API Error (${weatherResponse.status})`);
    }

    const weatherData = await weatherResponse.json();

    if (!weatherData.current_weather) {
      throw new Error("Weather data unavailable.");
    }

    clearTimeout(timeout);

    return {
      city: location.city,
      country: location.country,
      state: location.state,
      current_weather: weatherData.current_weather,
    };
  } catch (error) {
    clearTimeout(timeout);

    if (error.name === "AbortError") {
      return {
        error: "Request timed out. Please try again.",
      };
    }

    if (error.message === "Failed to fetch") {
      return {
        error: "No internet connection.",
      };
    }

    console.error(error);

    return {
      error: error.message || "Something went wrong.",
    };
  } finally {
    console.log("fetchweather() completed.");
  }
}
