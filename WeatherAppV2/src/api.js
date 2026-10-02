const API_KEY = "716aaa19bbe548488ba1bf6466833cf8";
const API_URL = "https://api.weatherbit.io/v2.0/current";


async function fetchWeatherFromAPI(city) {
    const url = new URL(API_URL);
    url.searchParams.set("key", API_KEY);
    url.searchParams.set("city", city);
    url.searchParams.set("units", "I");

    const response = await fetch(url);
    if (!response.ok) { throw new Error(`Weather API returned ${response.status}`); }
    const json = await response.json();

    if (!json.data || json.data.length === 0) { throw new Error("No weather data found."); }
    return json.data[0];
}