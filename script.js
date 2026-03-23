// const apiKey = "5ac81d2c05f079b4ae6e3d717349d220";

// let unit = "metric";
// let selectedCity = "";

// function showLoader(show){
// document.getElementById("loader").classList.toggle("hidden", !show);
// }

// function resetUI(){
// document.getElementById("weatherResult").innerHTML="";
// document.getElementById("forecast").innerHTML="";
// document.getElementById("hourly").innerHTML="";
// }

// function setUnit(u){
// unit=u;
// if(selectedCity) fetchWeather(selectedCity);
// }

// function searchWeather(){

// const cityInput=document.getElementById("cityInput");
// const city=cityInput.value.trim();

// if(!city) return alert("Enter city name");

// selectedCity=city;
// localStorage.setItem("lastCity",city);

// resetUI();
// fetchWeather(city);

// cityInput.value="";
// }

// function getLocationWeather(){

// if(navigator.geolocation){

// navigator.geolocation.getCurrentPosition(pos=>{

// const lat=pos.coords.latitude;
// const lon=pos.coords.longitude;

// resetUI();
// fetchWeather(`lat=${lat}&lon=${lon}`,true);

// },()=>alert("Location denied"));

// }

// }

// async function fetchWeather(query,isCoords=false){

// showLoader(true);

// try{

// const url=isCoords
// ?`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=${unit}`
// :`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;

// const res=await fetch(url);
// const data=await res.json();

// if(data.cod!==200) throw new Error(data.message);

// displayWeather(data);

// fetchForecast(data.coord.lat,data.coord.lon);

// fetchAQI(data.coord.lat,data.coord.lon);

// changeBackground(data.weather[0].main);

// }catch(err){

// resetUI();
// showError(err.message);

// }finally{

// showLoader(false);

// }

// }

// async function fetchForecast(lat,lon){

// const res=await fetch(
// `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
// );

// const data=await res.json();

// displayHourlyForecast(data);

// const daily=data.list.filter(item=>item.dt_txt.includes("12:00:00"));

// let html="<h3>5 Day Forecast</h3>";

// daily.slice(0,5).forEach(day=>{

// html+=`
// <div class="forecast-item">
// <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
// <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
// <p>${day.main.temp}°</p>
// </div>
// `;

// });

// document.getElementById("forecast").innerHTML=html;

// }

// function displayHourlyForecast(data){

// let html="<h3>Hourly Forecast</h3>";

// data.list.slice(0,8).forEach(hour=>{

// html+=`
// <div class="forecast-item">
// <p>${new Date(hour.dt_txt).getHours()}:00</p>
// <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png">
// <p>${hour.main.temp}°</p>
// </div>
// `;

// });

// document.getElementById("hourly").innerHTML=html;

// }

// function displayWeather(data){

// const tempUnit=unit==="metric"?"°C":"°F";

// document.getElementById("weatherResult").innerHTML=`

// <h2>${data.name}</h2>

// <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png">

// <h3>${data.main.temp}${tempUnit}</h3>

// <p>${data.weather[0].description}</p>

// <p>Feels Like: ${data.main.feels_like}${tempUnit}</p>

// <p>Humidity: ${data.main.humidity}%</p>

// <p>Pressure: ${data.main.pressure} hPa</p>

// <p>Visibility: ${data.visibility/1000} km</p>

// <p>Wind: ${data.wind.speed}</p>

// <p>Sunrise: ${new Date(data.sys.sunrise*1000).toLocaleTimeString()}</p>

// <p>Sunset: ${new Date(data.sys.sunset*1000).toLocaleTimeString()}</p>

// `;

// }

// async function fetchAQI(lat,lon){

// const res=await fetch(
// `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
// );

// const data=await res.json();

// const aqi=data.list[0].main.aqi;

// document.getElementById("weatherResult").innerHTML+=`<p>AQI: ${aqi}</p>`;

// }

// function changeBackground(weather){

// if(weather==="Rain")
// document.body.style.backgroundImage="url('images/rain.jpg')";

// else if(weather==="Clouds")
// document.body.style.backgroundImage="url('images/cloud.jpg')";

// else if(weather==="Clear")
// document.body.style.backgroundImage="url('images/sunny.jpg')";

// }

// function saveCity(){

// const city=document.querySelector("#weatherResult h2")?.innerText;

// if(!city) return;

// let cities=JSON.parse(localStorage.getItem("favCities"))||[];

// if(!cities.includes(city)){

// cities.push(city);

// localStorage.setItem("favCities",JSON.stringify(cities));

// alert("City saved");

// }

// }

// function filterForecastByDate(){

// const selectedDate=document.getElementById("datePicker").value;

// if(!selectedDate||!selectedCity) return;

// fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${apiKey}&units=${unit}`)
// .then(res=>res.json())
// .then(data=>{

// const filtered=data.list.filter(item=>item.dt_txt.startsWith(selectedDate));

// let html=`<h3>Weather for ${selectedDate}</h3>`;

// filtered.forEach(item=>{

// html+=`
// <div class="forecast-item">
// <p>${item.dt_txt.split(" ")[1]}</p>
// <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
// <p>${item.main.temp}°</p>
// </div>
// `;

// });

// document.getElementById("forecast").innerHTML=html;

// });

// }

// function showError(msg){

// document.getElementById("weatherResult").innerHTML=`<p style="color:red;">${msg}</p>`;

// }

// document.getElementById("themeToggle")
// .addEventListener("click",()=>document.body.classList.toggle("dark"));

// document.getElementById("cityInput")
// .addEventListener("keypress",function(e){

// if(e.key==="Enter") searchWeather();

// });

// window.onload=()=>{

// const lastCity=localStorage.getItem("lastCity");

// if(lastCity){

// selectedCity=lastCity;

// fetchWeather(lastCity);

// }

// };
const apiKey = "5ac81d2c05f079b4ae6e3d717349d220";

let unit = "metric";
let selectedCity = "";
let map;

function showLoader(show){
 document.getElementById("loader").classList.toggle("hidden", !show);
}

function resetUI(){
 document.getElementById("weatherResult").innerHTML="";
 document.getElementById("forecast").innerHTML="";
 document.getElementById("hourly").innerHTML="";
}

function setUnit(u){
 unit=u;
 if(selectedCity) fetchWeather(selectedCity);
}

function searchWeather(){

 const cityInput=document.getElementById("cityInput");
 const city=cityInput.value.trim();

 if(!city) return alert("Enter city name");

 selectedCity=city;

 resetUI();
 fetchWeather(city);

 cityInput.value="";
}

function getLocationWeather(){

 if(navigator.geolocation){

 navigator.geolocation.getCurrentPosition(pos=>{

 const lat=pos.coords.latitude;
 const lon=pos.coords.longitude;

 resetUI();
 fetchWeather(`lat=${lat}&lon=${lon}`,true);

 });

 }
}

async function fetchWeather(query,isCoords=false){

 showLoader(true);

 try{

 const url=isCoords
 ?`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=${unit}`
 :`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;

 const res=await fetch(url);
 const data=await res.json();

 if(data.cod!==200) throw new Error(data.message);

 displayWeather(data);

 fetchForecast(data.coord.lat,data.coord.lon);

 loadWeatherMap(data.coord.lat,data.coord.lon);

 }catch(err){

 resetUI();
 showError(err.message);

 }finally{

 showLoader(false);

 }

}

async function fetchForecast(lat,lon){

 const res=await fetch(
 `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
 );

 const data=await res.json();

 displayHourlyForecast(data);

 const daily=data.list.filter(item=>item.dt_txt.includes("12:00:00"));

 let html="<h3>5 Day Forecast</h3>";

 daily.slice(0,5).forEach(day=>{

 html+=`
 <div class="forecast-item">
 <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
 <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
 <p>${day.main.temp}°</p>
 </div>
 `;

 });

 document.getElementById("forecast").innerHTML=html;

}

function displayHourlyForecast(data){

 let html="<h3>Hourly Forecast</h3>";

 data.list.slice(0,8).forEach(hour=>{

 html+=`
 <div class="forecast-item">
 <p>${new Date(hour.dt_txt).getHours()}:00</p>
 <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png">
 <p>${hour.main.temp}°</p>
 </div>
 `;

 });

 document.getElementById("hourly").innerHTML=html;

}

function displayWeather(data){

 const tempUnit=unit==="metric"?"°C":"°F";

 document.getElementById("weatherResult").innerHTML=`

 <h2>${data.name}</h2>

 <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png">

 <h3>${data.main.temp}${tempUnit}</h3>

 <p>${data.weather[0].description}</p>

 <p>Feels Like: ${data.main.feels_like}${tempUnit}</p>

 <p>Humidity: ${data.main.humidity}%</p>

 <p>Wind: ${data.wind.speed}</p>

 `;

}

function loadWeatherMap(lat,lon){

 if(map) map.remove();

 map = L.map('map').setView([lat, lon], 6);

 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
 maxZoom:19
 }).addTo(map);

 L.marker([lat,lon]).addTo(map)
 .bindPopup("Selected Location")
 .openPopup();

}

function saveCity(){

 const city=document.querySelector("#weatherResult h2")?.innerText;

 if(!city) return;

 alert(city + " saved as favorite");

}

function filterForecastByDate(){

 const selectedDate=document.getElementById("datePicker").value;

 if(!selectedDate||!selectedCity) return;

 fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${apiKey}&units=${unit}`)
 .then(res=>res.json())
 .then(data=>{

 const filtered=data.list.filter(item=>item.dt_txt.startsWith(selectedDate));

 let html=`<h3>Weather for ${selectedDate}</h3>`;

 filtered.forEach(item=>{

 html+=`
 <div class="forecast-item">
 <p>${item.dt_txt.split(" ")[1]}</p>
 <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
 <p>${item.main.temp}°</p>
 </div>
 `;

 });

 document.getElementById("forecast").innerHTML=html;

 });

}

function showError(msg){
 document.getElementById("weatherResult").innerHTML=`<p style="color:red;">${msg}</p>`;
}

document.getElementById("themeToggle")
.addEventListener("click",()=>document.body.classList.toggle("dark"));