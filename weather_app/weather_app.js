const openWeatherAPIKEY = "d47d645453b88f0a64f28c420fe6a5c5";
let isCelsius = true;

function showWeather() {
    const city = document.getElementById("city").value;
    if (!city) {
        alert("Please enter a city");
        return;
    }

    const currentWeatherAPIurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherAPIKEY}`;
    const forecastAPIurl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openWeatherAPIKEY}`;

    // Fetch current weather data
    fetch(currentWeatherAPIurl)
        .then((response) => response.json())
        .then((data) => {
            displayWeather(data);
            getUVIndexAndAirQuality(data.coord.lat, data.coord.lon);
        })
        .catch((error) => {
            console.error("Error fetching current weather data:", error);
            alert("Error fetching current weather data. Please try again.");
        });

    // Fetch 5-day forecast data
    fetch(forecastAPIurl)
        .then((response) => response.json())
        .then((data) => {
            displayForecast(data);
        })
        .catch((error) => {
            console.error("Error fetching forecast data:", error);
            alert("Error fetching forecast data. Please try again.");
        });
}

function displayWeather(data) {
    const currentTempInfo = document.getElementById("currentTemp");
    const currentWeatherDescriptionInfo = document.getElementById(
        "currentWeatherDescription"
    );
    const currentWeatherIconInfo =
        document.getElementById("currentWeatherIcon");
    const currentLocationInfo = document.getElementById("currentLocation");
    const windSpeedInfo = document.getElementById("windSpeed");
    const humidityInfo = document.getElementById("humidityPercent");
    const visibilityInfo = document.getElementById("visibilityDistance");
    const sunriseInfo = document.getElementById("sunriseTime");
    const sunsetInfo = document.getElementById("sunsetTime");

    if (data.cod === "404") {
        currentWeatherDescriptionInfo.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const tempInCelsius = data.main.temp - 273.15;
        const temperature = isCelsius
            ? Math.round(tempInCelsius)
            : Math.round((tempInCelsius * 9) / 5 + 32);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;
        const visibility = (data.visibility / 1000).toFixed(1); // Convert to km
        const sunriseTime = new Date(
            data.sys.sunrise * 1000
        ).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit" }
        );

        currentTempInfo.innerHTML = `<p>${temperature}°${
            isCelsius ? "C" : "F"
        }</p>`;
        currentWeatherDescriptionInfo.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
        currentLocationInfo.innerHTML = `${cityName}, ${data.sys.country}`;
        currentWeatherIconInfo.innerHTML = `<img src="${iconUrl}" alt="${description} icon">`;

        windSpeedInfo.innerHTML = `${windSpeed} km/h`;
        humidityInfo.innerHTML = `${humidity}%`;
        visibilityInfo.innerHTML = `${visibility} km`;
        sunriseInfo.innerHTML = sunriseTime;
        sunsetInfo.innerHTML = sunsetTime;
    }
}

// Toggle temperature unit
function toggleTemperatureUnit() {
    isCelsius = !isCelsius;
    const tempToggleButton = document.getElementById("tempToggleButton");
    tempToggleButton.innerText = isCelsius ? "Switch to °F" : "Switch to °C";
    showWeather(); // Refresh data to apply new unit
}

// Function to display the forecast with the appropriate temperature unit
function displayForecast(data) {
    const forecastData = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
    ); // Filter to get data at noon each day

    forecastData.forEach((day, index) => {
        if (index < 5) {
            // Display only the next 5 days
            const date = new Date(day.dt * 1000);
            const dayOfWeek = date.toLocaleDateString("en-US", {
                weekday: "short",
            });
            const highTempInCelsius = day.main.temp_max - 273.15;
            const lowTempInCelsius = day.main.temp_min - 273.15;
            const highTemp = isCelsius
                ? Math.round(highTempInCelsius)
                : Math.round((highTempInCelsius * 9) / 5 + 32);
            const lowTemp = isCelsius
                ? Math.round(lowTempInCelsius)
                : Math.round((lowTempInCelsius * 9) / 5 + 32);
            const description = day.weather[0].description;
            const iconCode = day.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            document.getElementById(`forcast__${index + 1}`).innerText =
                dayOfWeek;
            document.getElementById(
                `forecast__${index + 1}__icon`
            ).innerHTML = `<img src="${iconUrl}" alt="${description} icon">`;
            document.getElementById(
                `forecast__${index + 1}__highTemp`
            ).innerText = `${highTemp}°${isCelsius ? "C" : "F"}`;
            document.getElementById(
                `forecast__${index + 1}__lowTemp`
            ).innerText = `${lowTemp}°${isCelsius ? "C" : "F"}`;
        }
    });
}

// Function to fetch UV index and air quality
function getUVIndexAndAirQuality(lat, lon) {
    const uvIndexAPIurl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKEY}`;
    const airQualityAPIurl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKEY}`;

    // Fetch UV index
    fetch(uvIndexAPIurl)
        .then((response) => response.json())
        .then((data) => {
            const uvIndexInfo = document.getElementById("uvIndex");
            uvIndexInfo.innerHTML = data.value;
        })
        .catch((error) => {
            console.error("Error fetching UV index:", error);
        });

    // Fetch air quality
    fetch(airQualityAPIurl)
        .then((response) => response.json())
        .then((data) => {
            const aqi = data.list[0].main.aqi;
            const airQualityInfo = document.getElementById("airQualityIndex");
            const airQualityDescriptionInfo = document.getElementById(
                "airQualityDescription"
            );
            airQualityInfo.innerHTML = aqi;
            airQualityDescriptionInfo.innerHTML = getAQIDescription(aqi);
        })
        .catch((error) => {
            console.error("Error fetching air quality data:", error);
        });
}

function getAQIDescription(aqi) {
    const descriptions = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    return descriptions[aqi - 1] || "Unknown";
}
document.addEventListener("DOMContentLoaded", () => {
    // Try to get weather by location when the page loads
    getWeatherByLocation();
});

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoords(lat, lon);
            },
            () => {
                alert("Geolocation not enabled. Please enter a city manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function getWeatherByCoords(lat, lon) {
    const currentWeatherAPIurl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKEY}`;
    const forecastAPIurl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKEY}`;

    // Fetch current weather data
    fetch(currentWeatherAPIurl)
        .then((response) => response.json())
        .then((data) => {
            displayWeather(data);
            getUVIndexAndAirQuality(data.coord.lat, data.coord.lon);
        })
        .catch((error) => {
            console.error("Error fetching current weather data:", error);
            alert("Error fetching current weather data. Please try again.");
        });

    // Fetch 5-day forecast data
    fetch(forecastAPIurl)
        .then((response) => response.json())
        .then((data) => {
            displayForecast(data);
        })
        .catch((error) => {
            console.error("Error fetching forecast data:", error);
            alert("Error fetching forecast data. Please try again.");
        });
}
