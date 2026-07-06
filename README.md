# 🌤️ Weather App

A clean, responsive weather app built with React and Vite. Search any city in the world to see the current conditions and a 5-day forecast, powered by the free [Open-Meteo](https://open-meteo.com/) API — no API key required.

**Live demo:** [weather-app-tan-nu-25.vercel.app](https://weather-app-tan-nu-25.vercel.app)

## Features

- 🔍 **City search** with real-time geocoding (works for cities worldwide)
- 🌡️ **Current weather** — temperature, wind speed, and condition icon
- 📅 **5-day forecast** with daily highs, lows, and condition icons
- 🔄 **°C / °F toggle** to switch units instantly
- 💾 **Remembers your last search** using local storage, so it's ready when you reopen the app
- ⏳ **Loading and error states** — clear feedback while fetching data or when a city isn't found
- 📱 **Responsive design** that works on mobile and desktop

## Tech Stack

- [React](https://react.dev/) — UI library
- [Vite](https://vitejs.dev/) — build tool and dev server
- [Open-Meteo API](https://open-meteo.com/) — geocoding and weather data
- Plain CSS — no framework, custom styling

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)

### Installation

```bash
git clone https://github.com/shirinmohajeri/weather-app.git
cd weather-app
npm install
```

### Run locally

```bash
npm run dev
```

Then open the local URL printed in your terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

## Project Structure

```
weather-app/
├── src/
│   ├── App.jsx      # Main component: search, weather, and forecast logic
│   ├── App.css       # Styling
│   └── main.jsx      # React entry point
├── index.html
├── package.json
└── vite.config.js
```

## How It Works

1. The city name is sent to Open-Meteo's geocoding API to resolve it into latitude/longitude coordinates.
2. Those coordinates are used to fetch current conditions and a 5-day forecast from Open-Meteo's weather API.
3. Results are cached in local storage so the app remembers your last search between visits.

## Future Improvements

- [ ] Search history with multiple saved cities
- [ ] Hourly forecast view
- [ ] Geolocation to auto-detect the user's city
- [ ] Dark mode

## License

This project is open source and available under the [MIT License](LICENSE).
