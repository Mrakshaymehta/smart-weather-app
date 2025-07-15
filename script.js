const locationText = document.getElementById("location");
const weatherText = document.getElementById("weather");
const networkText = document.getElementById("network");
const canvas = document.getElementById("weatherCanvas");
const ctx = canvas.getContext("2d");

// 📶 Check Network Status
if ('connection' in navigator) {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const effectiveType = connection.effectiveType;
  networkText.textContent = `Network: ${effectiveType}`;
  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    alert("⚠️ You are on a slow connection. Switching to low-data mode.");
  }
} else {
  networkText.textContent = "Network API not supported.";
}

// 📍 Get Location and Fetch Weather
function getWeather(lat, lon) {
  const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  fetch(apiURL)
    .then(res => res.json())
    .then(data => {
      const temp = data.current_weather.temperature;
      weatherText.textContent = `🌡 Temperature: ${temp}°C`;

      // 🎨 Draw on Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00bfff";
      ctx.fillRect(50, canvas.height - temp * 2, 50, temp * 2); // bar graph
      ctx.fillStyle = "#000";
      ctx.fillText(`Temp: ${temp}°C`, 50, canvas.height - temp * 2 - 10);
    })
    .catch(err => {
      weatherText.textContent = "Error fetching weather.";
      console.error(err);
    });
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(4);
      const lon = position.coords.longitude.toFixed(4);
      locationText.textContent = `Your Location: ${lat}, ${lon}`;
      getWeather(lat, lon);
    },
    (error) => {
      locationText.textContent = "Location access denied.";
      console.error(error);
    }
  );
} else {
  locationText.textContent = "Geolocation not supported.";
}