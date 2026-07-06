import { useState, useEffect } from 'react'

const LAST_CITY_KEY = 'weather-app:last-city'

// Turns Open-Meteo's numeric weather codes into a simple emoji
function weatherEmoji(code) {
  if (code === 0) return '☀️'
  if (code <= 2) return '🌤️'
  if (code === 3) return '☁️'
  if (code <= 48) return '🌫️'
  if (code <= 57) return '🌦️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '🌨️'
  if (code <= 82) return '🌧️'
  if (code <= 86) return '🌨️'
  return '⛈️'
}

function dayLabel(dateStr, index) {
  if (index === 0) return 'Today'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

function celsiusToFahrenheit(c) {
  return Math.round((c * 9) / 5 + 32)
}

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [unit, setUnit] = useState('C') // 'C' or 'F'

  async function fetchWeather(cityName) {
    setLoading(true)
    setError(null)
    setWeather(null)
    setForecast(null)

    try {
      // Step 1: turn the city name into coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`
      )
      if (!geoRes.ok) throw new Error('Network error, please try again.')
      const geoData = await geoRes.json()

      if (!geoData.results || geoData.results.length === 0) {
        setError(`Couldn't find "${cityName}". Check the spelling and try again.`)
        setLoading(false)
        return
      }

      const { latitude, longitude, name, country } = geoData.results[0]

      // Step 2: get current weather + the next 5 days' forecast in one call
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current_weather=true` +
        `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
        `&timezone=auto&forecast_days=5`
      )
      if (!weatherRes.ok) throw new Error('Network error, please try again.')
      const weatherData = await weatherRes.json()

      setWeather({
        city: name,
        country,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        weathercode: weatherData.current_weather.weathercode,
      })

      const daily = weatherData.daily
      const days = daily.time.map((date, i) => ({
        date,
        label: dayLabel(date, i),
        max: Math.round(daily.temperature_2m_max[i]),
        min: Math.round(daily.temperature_2m_min[i]),
        code: daily.weathercode[i],
      }))
      setForecast(days)

      // remember this search for next time the app is opened
      localStorage.setItem(LAST_CITY_KEY, name)
    } catch (err) {
      setError('Something went wrong. Check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch() {
    if (!city.trim()) return
    fetchWeather(city)
  }

  // On first load, re-search whatever city was searched last time
  useEffect(() => {
    const lastCity = localStorage.getItem(LAST_CITY_KEY)
    if (lastCity) {
      setCity(lastCity)
      fetchWeather(lastCity)
    }
  }, [])

  function displayTemp(celsius) {
    const value = unit === 'C' ? celsius : celsiusToFahrenheit(celsius)
    return `${Math.round(value)}°${unit}`
  }

  return (
    <div className="app">
      <div className="header-row">
        <h1>Weather App</h1>
        <div className="unit-toggle">
          <button
            className={unit === 'C' ? 'active' : ''}
            onClick={() => setUnit('C')}
          >
            °C
          </button>
          <button
            className={unit === 'F' ? 'active' : ''}
            onClick={() => setUnit('F')}
          >
            °F
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {loading && (
        <div className="status">
          <div className="spinner"></div>
        </div>
      )}

      {error && !loading && (
        <div className="error-card">
          <p>{error}</p>
        </div>
      )}

      {weather && !loading && !error && (
        <div className="weather-card">
          <h2>{weather.city}, {weather.country}</h2>
          <div className="current-icon">{weatherEmoji(weather.weathercode)}</div>
          <p className="temp">{displayTemp(weather.temperature)}</p>
          <p>Wind: {weather.windspeed} km/h</p>
        </div>
      )}

      {forecast && !loading && !error && (
        <div className="forecast-row">
          {forecast.map((day) => (
            <div className="forecast-card" key={day.date}>
              <p className="forecast-day">{day.label}</p>
              <div className="forecast-icon">{weatherEmoji(day.code)}</div>
              <p className="forecast-max">{displayTemp(day.max)}</p>
              <p className="forecast-min">{displayTemp(day.min)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
