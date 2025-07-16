const apiKey = "d0c4ca15d60cf10ce5aba49a301b109c"; // Replace with your OpenWeatherMap API key

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const themeToggle = document.getElementById("themeToggle");

const cityName = document.getElementById("cityName");
const description = document.getElementById("description");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");
const weatherCard = document.getElementById("weatherCard");

const icons = {
  clear: "clear.png",
  clouds: "clouds.png",
  rain: "rain.png",
  drizzle: "drizzle.png",
  mist: "mist.png",
  haze: "mist.png",
  fog: "mist.png",
  snow: "snow.png",
  smoke: "mist.png",
  thunderstorm: "rain.png"
};

// 🌙 Toggle Dark Mode
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀" : "🌙";
});

// 🔍 Search City Weather
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherByCity(city);
  }
});

// 📍 Get Weather on Load via GPS or Default to Chennai
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        getWeatherByCoords(latitude, longitude);
      },
      () => {
        getWeatherByCity("Chennai");
      }
    );
  } else {
    getWeatherByCity("Chennai");
  }
});

// 🌆 Get Weather by City
function getWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then((data) => updateUI(data))
    .catch((err) => {
      alert(err.message);
      weatherCard.classList.remove("show");
      weatherCard.classList.add("hidden");
    });
}

// 📍 Get Weather by GPS Coordinates
function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Location not found");
      return res.json();
    })
    .then((data) => updateUI(data))
    .catch((err) => console.error("GPS error:", err));
}

// 🔁 Update UI
function updateUI(data) {
  console.log("Weather data received:", data); // For debugging

  if (!data.weather || !data.weather[0]) {
    console.error("Invalid weather data", data);
    return;
  }

  const main = data.weather[0].main.toLowerCase();
  const iconFile = icons[main] || "clear.png";

  weatherIcon.src = `images/${iconFile}`;
  weatherIcon.alt = main;

  cityName.textContent = data.name;
  description.textContent = `Condition: ${data.weather[0].description}`;
  temp.textContent = `Temperature: ${data.main.temp}°C`;

  humidity.innerHTML = `<img src="images/humidity.png" width="20" height="20" alt="Humidity"> Humidity: ${data.main.humidity}%`;
  wind.innerHTML = `<img src="images/wind.png" width="20" height="20" alt="Wind"> Wind: ${data.wind.speed} m/s`;

  weatherCard.classList.remove("hidden");
  weatherCard.classList.add("show");
}
