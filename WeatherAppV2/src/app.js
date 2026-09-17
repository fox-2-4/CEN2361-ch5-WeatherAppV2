const API_KEY = "716aaa19bbe548488ba1bf6466833cf8";
const API_URL = "https://api.weatherbit.io/v2.0/current";


const form = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");

const statusElement = document.querySelector("#status");

const weatherCard = document.querySelector("#weather-card");

const locationElement = document.querySelector("#location");
const temperatureElement = document.querySelector("#temperature");
const descriptionElement = document.querySelector("#description");

const feelsLikeElement = document.querySelector("#feels-like");
const humidityElement = document.querySelector("#humidity");
const windElement = document.querySelector("#wind");
const pressureElement = document.querySelector("#pressure");

const dataSourceElement = document.querySelector("#data-source");


async function fetchWeather(city) {
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


function displayWeather(weather, source) {
    locationElement.textContent = `${weather.city_name}, ${weather.state_code ?? weather.country_code}`;
    temperatureElement.textContent = Math.round(weather.temp);
    descriptionElement.textContent = weather.weather.description;
    feelsLikeElement.textContent = `${Math.round(weather.app_temp)}°F`;
    humidityElement.textContent = `${weather.rh}%`;
    windElement.textContent = `${weather.wind_spd} mph ${weather.wind_cdir}`;
    pressureElement.textContent = `${weather.pres} mb`;
    dataSourceElement.textContent = source;
    weatherCard.classList.remove("hidden");
}


async function loadWeather(city) {
    statusElement.textContent = "Loading...";
    
    try {
        const weather = await fetchWeather(city);
        await saveWeather(city, weather);
        displayWeather(weather, "Live data from Weatherbit");
        statusElement.textContent = "";
    }
    catch (error) {
        console.error(error);
        try {
            const cached = await getWeather(city);
            if (!cached) { throw new Error("No cached weather exists."); }
            displayWeather(cached.data, `Cached data from ${new Date(cached.timestamp).toLocaleString()}`);
            statusElement.textContent = "Could not retrieve live weather. Showing cached data.";
        }
        catch (cacheError) {
            console.error(cacheError);
            weatherCard.classList.add("hidden");
            statusElement.textContent = "Unable to retrieve weather and no cached data is available.";
        }
    }
}


form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim().toLowerCase();
    if (!city) { return; }
    await loadWeather(city);
});


if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("./sw.js")
            .then(() => {
                console.log("Service worker registered.");
            })
            .catch(error => {
                console.error(
                    "Service worker registration failed:",
                    error
                );
            });

    });
}