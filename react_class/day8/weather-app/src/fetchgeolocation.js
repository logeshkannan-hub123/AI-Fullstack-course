export default async function fetchgeolocation(city) {
  // Normalize input
  city = city.trim().replace(/\s+/g, " ");

  // Validation
  if (!city) {
    return {
      error: "Please enter a city name.",
    };
  }

  if (city.length > 50) {
    return {
      error: "City name is too long.",
    };
  }

  if (/^\d+$/.test(city)) {
    return {
      error: "City name cannot contain numbers.",
    };
  }

  // Allows letters, spaces, hyphens and apostrophes
  if (!/^[a-zA-Z\s'-]+$/.test(city)) {
    return {
      error: "Please enter a valid city name.",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    // -------------------------
    // Get Latitude & Longitude
    // -------------------------
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city,
      )}&count=1`,
      {
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error(`Geocoding API Error (${response.status})`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("City not found.");
    }

    const { latitude, longitude, name, country, state } = data.results[0];


    clearTimeout(timeout);

    return {
      city: name,
      country,
      state,
      latitude,
      longitude,
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
    console.log("fetchgeolocation() completed.");
  }
}
