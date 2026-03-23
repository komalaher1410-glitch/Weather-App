# 🌦 Weather App

A beautiful, real-time weather dashboard built with HTML, CSS, and JavaScript. Features a stunning aurora night sky background, frosted glass UI, interactive temperature graph, hourly & 5-day forecasts, and a live map.

---

## 🔗 Live Demo

[https://komalaher1410-glitch.github.io/Weather-App/](https://komalaher1410-glitch.github.io/Weather-App/)

---

## ✨ Features

- 🔍 **City Search** — Search any city worldwide with Enter key support
- 📍 **Live Location** — Detect current location using browser Geolocation API
- 🌡️ **Current Weather** — Temperature, feels like, humidity, wind, pressure, visibility, sunrise & sunset
- 📊 **Temperature Graph** — 24-hour temperature & feels-like trend using Chart.js
- 🕐 **Hourly Forecast** — Next 12 hours with rain probability
- 📅 **5-Day Forecast** — Daily summary with humidity bars
- 🗓️ **Date Filter** — Check weather for a specific date
- 🗺️ **Live Map** — Interactive Leaflet.js map with location pin
- ⭐ **Saved Cities** — Save favourite cities to sidebar (persists via localStorage)
- 🌙 **Dark / Light Mode** — Toggle with theme saved across sessions
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling, glassmorphism, animations |
| JavaScript (ES6+) | Logic, DOM manipulation, API calls |
| [OpenWeatherMap API](https://openweathermap.org/api) | Live weather data |
| [Chart.js](https://www.chartjs.org/) | Temperature trend graph |
| [Leaflet.js](https://leafletjs.com/) | Interactive map |
| [Font Awesome](https://fontawesome.com/) | Icons |
| Google Fonts (Raleway + Nunito) | Typography |

---

## 📁 Project Structure

```
Weather-App/
├── index.html       # Main HTML structure
├── style.css        # Full design system & animations
├── script.js        # All app logic & API calls
└── images/
    ├── background1.jpg
    └── background2.jpg
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/komalaher1410-glitch/Weather-App.git
cd Weather-App
```

### 2. Get a free API key

1. Sign up at [openweathermap.org](https://openweathermap.org)
2. Go to **API Keys** in your account dashboard
3. Copy your key (takes up to 2 hours to activate)

### 3. Add your API key

Open `script.js` and replace line 3:


const API_KEY = "your_api_key_here";


### 4. Run the app

Just open `index.html` in your browser — no build step needed.

```bash
# Or use VS Code Live Server for best experience
```

---

## 🌐 Deploying to GitHub Pages

1. Push your code to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to `main` branch → `/ (root)`
4. Your app will be live at `https://your-username.github.io/Weather-App/`

---

## 📸 Screenshots

| Dark Mode | Light Mode |
|-----------|------------|
| Aurora night sky background | Pinterest sky background |
| Cyan/purple glass cards | Warm ivory glass cards |

---

## 🔑 API Reference

This app uses the free tier of [OpenWeatherMap](https://openweathermap.org/api):

| Endpoint | Used For |
|----------|----------|
| `/data/2.5/weather` | Current weather by city or coordinates |
| `/data/2.5/forecast` | 5-day / 3-hour forecast data |

Free tier allows **60 calls/minute** — more than enough for personal use.

---

## ⚠️ Known Limitations

- OpenWeatherMap free tier does not provide historical weather data
- New API keys can take up to **2 hours** to activate
- Geolocation requires HTTPS or localhost (won't work on plain `http://`)

---

## 👩‍💻 Author

**Komal Gorakhnath Aher**  
Frontend Developer  
📧 komalaher1410@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/komal-aher-35262a383)  
🐙 [GitHub](https://github.com/komalaher1410-glitch)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
