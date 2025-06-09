const apiKey = "d02e93363e8c608c77e80d27433582f7"; // idc
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const cityName = document.getElementById("cityName");
const localTime = document.getElementById("localTime");
const description = document.getElementById("description");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherIcon = document.getElementById("weatherIcon");

const weatherInfo = document.querySelector(".weather-info");
const errorMessage = document.querySelector(".error-message");
const background = document.getElementById("background");

let timeInterval;

searchButton.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") return;
  getWeather(city);
});

function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((res) => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then((data) => {
      updateWeatherUI(data);
    })
    .catch(() => {
      weatherInfo.classList.add("hidden");
      errorMessage.classList.remove("hidden");
      background.style.backgroundImage = "url('assets/error.gif')";
      clearInterval(timeInterval);
    });
}

function updateWeatherUI(data) {
  const city = data.name;
  const temp = Math.round(data.main.temp);
  const hum = data.main.humidity;
  const wind = data.wind.speed;
  const desc = data.weather[0].description;
  const main = data.weather[0].main.toLowerCase();
  const icon = data.weather[0].icon;
  const timezoneOffset = data.timezone; // seconds offset from UTC

  cityName.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${city}`;
  description.textContent = capitalize(desc);
  temperature.innerHTML = `${temp}°C`;
  humidity.innerHTML = `${hum}% humidity`;
  windSpeed.innerHTML = `${wind} m/s wind`;

  const bgGif = getWeatherGif(main, icon);
  background.style.backgroundImage = `url('${bgGif}')`;

  const iconClass = getWeatherIconClass(main, icon);
  weatherIcon.innerHTML = `<i class="${iconClass}"></i>`;

  // Start updating local time
  updateLocalTime(timezoneOffset);
  if (timeInterval) clearInterval(timeInterval);
  timeInterval = setInterval(() => updateLocalTime(timezoneOffset), 1000);

  weatherInfo.classList.remove("hidden");
  errorMessage.classList.add("hidden");
}

function updateLocalTime(offsetSeconds) {
  const nowUTC = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000);
  const local = new Date(nowUTC.getTime() + offsetSeconds * 1000);
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
    day: "numeric",
    month: "short",
  };
  localTime.textContent = local.toLocaleString("en-US", options);
}

function getWeatherGif(main, icon) {
  const isNight = icon.includes("n");

  if (main.includes("cloud")) return "assets/cloudy.gif";
  if (main.includes("rain")) return isNight ? "assets/rain night.gif" : "assets/rain.gif";
  if (main.includes("snow")) return "assets/snow.gif";
  if (main.includes("thunderstorm")) return "assets/thunderstorm.gif"; 
  if (main.includes("mist") || main.includes("fog")) return "assets/misty.gif";
  if (main.includes("clear")) return isNight ? "assets/clear night.gif" : "assets/sunny.gif";

  return "assets/sunny.gif"; // fallback
}

function getWeatherIconClass(main, icon) {
  const isNight = icon.includes("n");

  if (main.includes("cloud")) return "fas fa-cloud";
  if (main.includes("rain")) return "fas fa-cloud-showers-heavy";
  if (main.includes("snow")) return "fas fa-snowflake";
  if (main.includes("thunderstorm")) return "fas fa-bolt";
  if (main.includes("mist") || main.includes("fog")) return "fas fa-smog";
  if (main.includes("clear")) return isNight ? "fas fa-moon" : "fas fa-sun";

  return "fas fa-sun";
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Default background on page load
window.addEventListener("load", () => {
  background.style.backgroundImage = "url('assets/sunny.gif')";
});

cityInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    searchButton.click();
  }
});
