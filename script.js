// ── Config ────────────────────────────────────────────────
// ⚠️ Replace with your own key: https://openweathermap.org/api
const API_KEY = "5ac81d2c05f079b4ae6e3d717349d220";

let unit        = "metric";
let selectedCity = "";
let leafletMap;
let tempChart;

// ── Utils ─────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const setHTML = (id, html) => { const el = $(id); if(el) el.innerHTML = html; };

function showLoader(show) { $("loader").classList.toggle("hidden", !show); }

function fmt(d) {
  return d.toLocaleString(undefined,{weekday:'short',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
}
function fmtTime(ts) {
  return new Date(ts*1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
}
function fmtHour(dtStr) {
  const h = new Date(dtStr).getHours();
  return h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h-12} PM`;
}

// ── Tab switching ─────────────────────────────────────────
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;

    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));

    btn.classList.add("active");
    $(`tab-${tab}`).classList.add("active");
    $("pageTitle").textContent = btn.querySelector("span")?.textContent || "Dashboard";

    if (tab === "map" && leafletMap) {
      setTimeout(() => leafletMap.invalidateSize(), 120);
    }
  });
});

// ── Units ─────────────────────────────────────────────────
function setUnit(u) {
  unit = u;
  $("btnC").classList.toggle("active", u === "metric");
  $("btnF").classList.toggle("active", u === "imperial");
  if (selectedCity) fetchWeather(selectedCity);
}

// ── Search ────────────────────────────────────────────────
function searchWeather() {
  const inp = $("cityInput");
  const city = inp.value.trim();
  if (!city) return;
  selectedCity = city;
  localStorage.setItem("lastCity", city);
  fetchWeather(city);
  inp.value = "";
}

function getLocationWeather() {
  if (!navigator.geolocation) return alert("Geolocation not supported");
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      fetchWeather(`lat=${lat}&lon=${lon}`, true);
    },
    () => alert("Location access denied")
  );
}

// ── Fetch current weather ─────────────────────────────────
async function fetchWeather(query, isCoords = false) {
  showLoader(true);
  try {
    const base = "https://api.openweathermap.org/data/2.5/weather";
    const url  = isCoords
      ? `${base}?${query}&appid=${API_KEY}&units=${unit}`
      : `${base}?q=${query}&appid=${API_KEY}&units=${unit}`;

    const res  = await fetch(url);
    const data = await res.json();
    if (data.cod !== 200) throw new Error(data.message);

    renderHero(data);
    renderOverview(data);
    fetchForecastData(data.coord.lat, data.coord.lon);
    loadMap(data.coord.lat, data.coord.lon);

  } catch(err) {
    setHTML("heroCard", `<div style="padding:30px;color:#f87171;font-weight:600"><i class="fa fa-triangle-exclamation"></i> ${err.message}</div>`);
    $("heroCard").classList.remove("hidden");
  } finally {
    showLoader(false);
  }
}

// ── Hero ──────────────────────────────────────────────────
function renderHero(d) {
  const tu   = unit === "metric" ? "°C" : "°F";
  const icon = d.weather[0].icon;
  const desc = d.weather[0].description;

  $("heroCity").textContent    = `${d.name}, ${d.sys.country}`;
  $("heroTemp").textContent    = `${Math.round(d.main.temp)}${tu}`;
  $("heroDesc").textContent    = desc;
  $("heroDate").textContent    = fmt(new Date());
  $("heroHigh").textContent    = `${Math.round(d.main.temp_max)}${tu}`;
  $("heroLow").textContent     = `${Math.round(d.main.temp_min)}${tu}`;
  $("heroIcon").src            = `https://openweathermap.org/img/wn/${icon}@4x.png`;
  $("heroIcon").alt            = desc;
  $("heroCard").classList.remove("hidden");
}

// ── Overview ──────────────────────────────────────────────
function renderOverview(d) {
  const tu = unit === "metric" ? "°C" : "°F";
  const ws = unit === "metric" ? " m/s" : " mph";

  $("ovFeels").textContent    = `${Math.round(d.main.feels_like)}${tu}`;
  $("ovHumidity").textContent = `${d.main.humidity}%`;
  $("ovWind").textContent     = `${d.wind.speed}${ws}`;
  $("ovVis").textContent      = `${(d.visibility/1000).toFixed(1)} km`;
  $("ovPressure").textContent = `${d.main.pressure} hPa`;
  $("ovSunrise").textContent  = fmtTime(d.sys.sunrise);
  $("ovSunset").textContent   = fmtTime(d.sys.sunset);

  // Bars
  const pct = (val,max) => Math.min(100,Math.round(val/max*100));
  $("ovFeelsBar").style.width    = pct(Math.abs(d.main.feels_like), 50) + "%";
  $("ovHumidityBar").style.width = d.main.humidity + "%";
  $("ovWindBar").style.width     = pct(d.wind.speed, 30) + "%";
  $("ovVisBar").style.width      = pct(d.visibility/1000, 20) + "%";
  $("ovPressureBar").style.width = pct(d.main.pressure-950, 150) + "%";

  // Sun arc dot position
  const now     = Date.now()/1000;
  const sr      = d.sys.sunrise;
  const ss      = d.sys.sunset;
  const progress= Math.max(0, Math.min(1, (now-sr)/(ss-sr)));

  // Quadratic bezier: P = (1-t)^2*P0 + 2t(1-t)*P1 + t^2*P2
  // P0=(5,50), P1=(50,-10), P2=(95,50)
  const t  = progress;
  const bx = (1-t)*(1-t)*5 + 2*t*(1-t)*50 + t*t*95;
  const by = (1-t)*(1-t)*50 + 2*t*(1-t)*(-10) + t*t*50;
  const dot = $("sunDot");
  if (dot) { dot.setAttribute("cx", bx.toFixed(1)); dot.setAttribute("cy", by.toFixed(1)); }

  $("overviewGrid").classList.remove("hidden");
}

// ── Forecast fetch ────────────────────────────────────────
async function fetchForecastData(lat, lon) {
  const res  = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
  );
  const data = await res.json();

  renderHourly(data);
  renderGraph(data);
  renderForecastTab(data);
}

// ── Hourly ────────────────────────────────────────────────
function renderHourly(data) {
  const tu = unit === "metric" ? "°C" : "°F";
  const now = new Date().getHours();

  const chips = data.list.slice(0,12).map((h, i) => {
    const hHour = new Date(h.dt_txt).getHours();
    const isNow = i === 0;
    const rain  = h.pop > 0 ? `<div class="hour-rain">💧 ${Math.round(h.pop*100)}%</div>` : "";
    return `
      <div class="hour-chip${isNow ? " now" : ""}">
        <div class="hour-time">${isNow ? "Now" : fmtHour(h.dt_txt)}</div>
        <img class="hour-icon" src="https://openweathermap.org/img/wn/${h.weather[0].icon}.png" alt="">
        <div class="hour-temp">${Math.round(h.main.temp)}${tu}</div>
        ${rain}
      </div>`;
  }).join("");

  $("hourlyRow").innerHTML = chips;
  $("hourlyRow").classList.remove("hidden");
}

// ── Temperature Graph ─────────────────────────────────────
function renderGraph(data) {
  const tu = unit === "metric" ? "°C" : "°F";
  const items = data.list.slice(0, 16);

  const labels = items.map(h => fmtHour(h.dt_txt));
  const temps  = items.map(h => Math.round(h.main.temp));
  const feels  = items.map(h => Math.round(h.main.feels_like));

  if (tempChart) tempChart.destroy();

  const ctx = $("tempChart").getContext("2d");

  // Gradient fills
  const grad1 = ctx.createLinearGradient(0, 0, 0, 220);
  grad1.addColorStop(0, "rgba(110,231,247,0.35)");
  grad1.addColorStop(1, "rgba(110,231,247,0)");

  const grad2 = ctx.createLinearGradient(0, 0, 0, 220);
  grad2.addColorStop(0, "rgba(129,140,248,0.25)");
  grad2.addColorStop(1, "rgba(129,140,248,0)");

  tempChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `Temperature (${tu})`,
          data: temps,
          borderColor: "#6ee7f7",
          backgroundColor: grad1,
          borderWidth: 2.5,
          pointBackgroundColor: "#6ee7f7",
          pointRadius: 4,
          pointHoverRadius: 7,
          tension: 0.45,
          fill: true,
        },
        {
          label: `Feels Like (${tu})`,
          data: feels,
          borderColor: "#818cf8",
          backgroundColor: grad2,
          borderWidth: 2,
          pointBackgroundColor: "#818cf8",
          pointRadius: 3,
          pointHoverRadius: 6,
          tension: 0.45,
          fill: true,
          borderDash: [5,4],
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { mode:"index", intersect:false },
      plugins: {
        legend: {
          position:"top",
          labels:{
            color: document.body.classList.contains("light") ? "#1a0f0a" : "#ffffff",
            font:{ family:"Nunito",size:12,weight:"700" },
            usePointStyle:true,
            pointStyleWidth:8,
          }
        },
        tooltip:{
          backgroundColor: document.body.classList.contains("light") ? "rgba(40,15,4,0.92)" : "rgba(5,9,28,0.95)",
          borderColor:     document.body.classList.contains("light") ? "rgba(224,123,57,0.40)" : "rgba(99,210,255,0.35)",
          borderWidth:1,
          titleColor:      document.body.classList.contains("light") ? "#e07b39" : "#63d2ff",
          bodyColor:       document.body.classList.contains("light") ? "rgba(255,230,200,0.90)" : "rgba(255,255,255,0.85)",
          padding:12,
          titleFont:{ family:"Raleway",size:13,weight:"800" },
          bodyFont:{ family:"Nunito",size:12 },
        }
      },
      scales:{
        x:{
          grid:{ color: document.body.classList.contains("light") ? "rgba(80,30,5,0.07)" : "rgba(255,255,255,0.04)" },
          ticks:{ color: document.body.classList.contains("light") ? "rgba(50,20,5,0.60)" : "rgba(255,255,255,0.55)", font:{family:"Nunito",size:11},maxRotation:0 }
        },
        y:{
          grid:{ color: document.body.classList.contains("light") ? "rgba(80,30,5,0.07)" : "rgba(255,255,255,0.06)" },
          ticks:{ color: document.body.classList.contains("light") ? "rgba(50,20,5,0.60)" : "rgba(255,255,255,0.55)", font:{family:"Nunito",size:11}, callback: v => `${v}${tu}` }
        }
      }
    }
  });

  $("graphCard").classList.remove("hidden");
}

// ── 5-Day Forecast Tab ────────────────────────────────────
function renderForecastTab(data) {
  const tu = unit === "metric" ? "°C" : "°F";
  const daily = data.list.filter(i => i.dt_txt.includes("12:00:00")).slice(0,5);

  const rows = daily.map(d => {
    const date = new Date(d.dt_txt);
    const dayName = date.toLocaleDateString(undefined,{weekday:'long'});
    const dateStr = date.toLocaleDateString(undefined,{month:'short',day:'numeric'});
    const humPct  = d.main.humidity;

    return `
      <div class="fc-row">
        <div class="fc-day">${dayName}<div class="fc-date">${dateStr}</div></div>
        <img class="fc-icon" src="https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png" alt="">
        <div class="fc-desc">${d.weather[0].description}</div>
        <div>
          <div class="fc-temp">${Math.round(d.main.temp)}${tu}</div>
          <div class="fc-feel">Feels ${Math.round(d.main.feels_like)}${tu}</div>
        </div>
        <div class="fc-humidity"><i class="fa fa-droplet"></i>${humPct}%</div>
        <div class="fc-bar-wrap">
          <div style="font-size:10px;color:var(--text-3)">Humidity</div>
          <div class="fc-bar"><div class="fc-bar-fill" style="width:${humPct}%"></div></div>
        </div>
      </div>`;
  }).join("");

  $("forecastCards").innerHTML = rows || `<p style="color:var(--text-2);padding:20px">No forecast data.</p>`;
}

// ── Date filter ───────────────────────────────────────────
function filterForecastByDate() {
  const date = $("datePicker").value;
  if (!date || !selectedCity) return;

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${API_KEY}&units=${unit}`)
    .then(r => r.json())
    .then(data => {
      const tu = unit === "metric" ? "°C" : "°F";
      const filtered = data.list.filter(i => i.dt_txt.startsWith(date));

      if (!filtered.length) {
        $("forecastCards").innerHTML = `<div class="fc-row" style="color:var(--text-2)">No data available for ${date}.</div>`;
        return;
      }

      const rows = filtered.map(i => `
        <div class="fc-row">
          <div class="fc-day">${i.dt_txt.split(" ")[1].slice(0,5)}<div class="fc-date">${date}</div></div>
          <img class="fc-icon" src="https://openweathermap.org/img/wn/${i.weather[0].icon}@2x.png" alt="">
          <div class="fc-desc">${i.weather[0].description}</div>
          <div>
            <div class="fc-temp">${Math.round(i.main.temp)}${tu}</div>
            <div class="fc-feel">Feels ${Math.round(i.main.feels_like)}${tu}</div>
          </div>
          <div class="fc-humidity"><i class="fa fa-droplet"></i>${i.main.humidity}%</div>
        </div>`).join("");

      $("forecastCards").innerHTML = rows;
    });
}

// ── Leaflet map ───────────────────────────────────────────
function loadMap(lat, lon) {
  if (leafletMap) leafletMap.remove();

  leafletMap = L.map("map").setView([lat, lon], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(leafletMap);

  const icon = L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:#6ee7f7;
           border:3px solid #fff;box-shadow:0 0 14px rgba(110,231,247,0.9)"></div>`,
    className:"", iconSize:[14,14], iconAnchor:[7,7]
  });

  L.marker([lat,lon],{icon})
    .addTo(leafletMap)
    .bindPopup(`<b style="font-family:Nunito">📍 ${selectedCity || "Selected Location"}</b>`)
    .openPopup();
}

// ── Save city ─────────────────────────────────────────────
function saveCity() {
  const cityEl = $("heroCity");
  if (!cityEl || !cityEl.textContent || cityEl.textContent === "—") return alert("Search a city first");

  const city = cityEl.textContent;
  let favs = JSON.parse(localStorage.getItem("favCities")||"[]");

  if (!favs.includes(city)) {
    favs.push(city);
    localStorage.setItem("favCities", JSON.stringify(favs));
  }
  renderFavList();
  alert(`⭐ ${city} saved!`);
}

function renderFavList() {
  const favs = JSON.parse(localStorage.getItem("favCities")||"[]");
  const list = $("favList");
  if (!favs.length) { list.innerHTML = `<div class="fav-empty">No saved cities yet</div>`; return; }

  list.innerHTML = favs.map(c => `
    <button class="fav-city-btn" onclick="loadFavCity('${c}')">
      <i class="fa fa-star"></i>${c}
    </button>`).join("");
}

function loadFavCity(city) {
  selectedCity = city;
  $("cityInput").value = "";
  fetchWeather(city);
}

// ── Theme ─────────────────────────────────────────────────
$("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  $("themeToggle").innerHTML = isLight
    ? `<i class="fa fa-sun"></i><span> Light Mode</span>`
    : `<i class="fa fa-moon"></i><span> Dark Mode</span>`;
  localStorage.setItem("theme", isLight ? "light" : "dark");

  // Redraw chart with new colours if visible
  if (tempChart) {
    const isL = document.body.classList.contains("light");
    tempChart.options.plugins.legend.labels.color       = isL ? "#1a0f0a"              : "#ffffff";
    tempChart.options.plugins.tooltip.backgroundColor   = isL ? "rgba(40,15,4,0.92)"   : "rgba(5,9,28,0.95)";
    tempChart.options.plugins.tooltip.titleColor        = isL ? "#e07b39"              : "#63d2ff";
    tempChart.options.plugins.tooltip.bodyColor         = isL ? "rgba(255,230,200,.9)" : "rgba(255,255,255,.85)";
    tempChart.options.scales.x.ticks.color = isL ? "rgba(50,20,5,0.60)"  : "rgba(255,255,255,0.55)";
    tempChart.options.scales.x.grid.color  = isL ? "rgba(80,30,5,0.07)"  : "rgba(255,255,255,0.04)";
    tempChart.options.scales.y.ticks.color = isL ? "rgba(50,20,5,0.60)"  : "rgba(255,255,255,0.55)";
    tempChart.options.scales.y.grid.color  = isL ? "rgba(80,30,5,0.07)"  : "rgba(255,255,255,0.06)";
    tempChart.update();
  }
});

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  $("themeToggle").innerHTML = `<i class="fa fa-sun"></i><span> Light Mode</span>`;
}

// ── Keyboard ──────────────────────────────────────────────
$("cityInput").addEventListener("keypress", e => { if(e.key==="Enter") searchWeather(); });

// ── Init ──────────────────────────────────────────────────
window.onload = () => {
  renderFavList();
  const last = localStorage.getItem("lastCity");
  if (last) { selectedCity = last; fetchWeather(last); }
};
