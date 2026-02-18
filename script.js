const apiKey = "5ac81d2c05f079b4ae6e3d717349d220";
let unit = "metric";

function showLoader(show){
  document.getElementById("loader").classList.toggle("hidden", !show);
}

function setUnit(u){
  unit = u;
  const lastCity = localStorage.getItem("lastCity");
  if(lastCity) fetchWeather(lastCity);
}

function searchWeather(){
  const city = document.getElementById("cityInput").value;
  if(!city) return showError("Enter city name");
  localStorage.setItem("lastCity", city);
  fetchWeather(city);
}

function getLocationWeather(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      fetchWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`, true);
    }, ()=> showError("Location denied"));
  }
}

async function fetchWeather(query, isCoords=false){
  showLoader(true);
  try{
    const url = isCoords
      ? `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=${unit}`
      : `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;

    const res = await fetch(url);
    const data = await res.json();

    if(data.cod !== 200) throw new Error(data.message);

    displayWeather(data);
    fetchForecast(data.coord.lat, data.coord.lon);

  }catch(err){
    showError(err.message);
  }finally{
    showLoader(false);
  }
}

async function fetchForecast(lat,lon){
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
  );
  const data = await res.json();

  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  let html = "<h3>5 Day Forecast</h3>";
  daily.slice(0,5).forEach(day=>{
    html += `
      <div class="forecast-item">
        <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
        <p>${day.main.temp}°</p>
      </div>
    `;
  });

  document.getElementById("forecast").innerHTML = html;
}

function displayWeather(data){
  const tempUnit = unit === "metric" ? "°C" : "°F";
  document.getElementById("weatherResult").innerHTML = `
    <h2>${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    <h3>${data.main.temp}${tempUnit}</h3>
    <p>${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind: ${data.wind.speed}</p>
  `;
}

function showError(msg){
  document.getElementById("weatherResult").innerHTML =
    `<p style="color:red;">${msg}</p>`;
}

document.getElementById("themeToggle")
  .addEventListener("click", ()=> document.body.classList.toggle("dark"));

/* Load last city on refresh */
window.onload = ()=>{
  const lastCity = localStorage.getItem("lastCity");
  if(lastCity) fetchWeather(lastCity);
};
