const cityForm = document.querySelector("#city-form");
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


function displayWeather(data, source) {
    locationElement.textContent = `${data.city_name}, ${data.state_code ?? data.country_code}`;
    temperatureElement.textContent = Math.round(data.temp);
    descriptionElement.textContent = data.weather.description;
    feelsLikeElement.textContent = `${Math.round(data.app_temp)}°F`;
    humidityElement.textContent = `${data.rh}%`;
    windElement.textContent = `${data.wind_spd} mph ${data.wind_cdir}`;
    pressureElement.textContent = `${data.pres} mb`;
    dataSourceElement.textContent = source;
    weatherCard.classList.remove("hidden");
}


async function loadWeather(city) {
    statusElement.textContent = "Loading...";
    
    try {
        const data = await fetchWeatherFromAPI(city);
        await storeWeatherToDB(city, data);
        displayWeather(data, "Live data from Weatherbit.io");
        statusElement.textContent = "";
    }
    catch (error) {
        console.error(error);
        statusElement.textContent = "Fetching from cache...";
        try {
            const cached = await getWeatherFromDB(city);
            if (!cached) { throw new Error("No cached weather exists."); }
            displayWeather(cached.data, `Cached data from ${new Date(cached.timestamp).toLocaleString()}`);
            statusElement.textContent = "Could not retrieve live data. Displaying cached.";
        }
        catch (cacheError) {
            console.error(cacheError);
            weatherCard.classList.add("hidden");
            statusElement.textContent = "Could not retrieve live data and cached not available.";
        }
    }
}


cityForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim().toLowerCase();
    if (!city) { return; }
    await loadWeather(city);
});


if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(() => { console.log("Service worker registered."); })
            .catch(error => { console.error("Service worker registration failed:", error); });
    });
}