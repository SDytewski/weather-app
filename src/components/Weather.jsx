import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import fox from '../assets/fox.jpg'
import humidity_icon from '../assets/humidity.png'
import wind_icon from '../assets/wind.png'

export const Weather = () => {
    const inputRef = useRef(null)
    const [weatherData, setWeatherData] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

const search = async (input) => {
    setLoading(true);

    try {
        const headers = {
            "User-Agent": "Weather-app (sdytewski+test@gmail.com)",
            "Accept": "application/geo+json"
        };

        async function fetchJSON(url, customHeaders = headers) {
            const res = await fetch(url, { headers: customHeaders });
            if (!res.ok) throw new Error("Request failed");
            return res.json();
        }

        // trimming input
        const trimmed = input.trim();
        if (!trimmed) return;

        const parts = trimmed.replace(",", " ").split(" ").filter(Boolean);
        let city, state;

        if (parts.length === 1) {
            city = parts[0];
            state = "";
        } else {
            state = parts[parts.length - 1];
            city = parts.slice(0, parts.length - 1).join(" ");
        }

        const query = state ? `${city}, ${state}, USA` : `${city}, USA`;

        // Get coordinates
        const geoData = await fetchJSON(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
            { "User-Agent": headers["User-Agent"] }
        );

        if (!geoData.length) {
            setMessage("Location not found");
            setWeatherData(false);
            return;
        }

        const { lat, lon } = geoData[0];

  
        const stationsData = await fetchJSON(
            `https://api.weather.gov/points/${lat},${lon}/stations`
        );

        if (!stationsData.features.length) {
            setMessage("No nearby stations found");
            setWeatherData(false);
            return;
        }


        let latestObs = null;
        for (const station of stationsData.features) {
            try {
                const obs = await fetchJSON(`${station.id}/observations/latest`);
                if (obs.properties.temperature.value !== null) {
                    latestObs = obs;
                    break;
                }
            } catch (err) {
                continue;
            }
        }

        if (!latestObs) {
            setMessage("No current weather data available");
            setWeatherData(false);
            return;
        }

        const tempC = latestObs.properties.temperature.value;
        const tempF = Math.round((tempC * 9 / 5) + 32);

        const windMps = latestObs.properties.windSpeed.value;
        const windMph = windMps !== null ? Math.floor(windMps * 2.237) : null; // floor to match NWS

        const humidity = latestObs.properties.relativeHumidity.value !== null
            ? Math.round(latestObs.properties.relativeHumidity.value)
            : null;


        const points = await fetchJSON(`https://api.weather.gov/points/${lat},${lon}`);
        const forecast = await fetchJSON(points.properties.forecast);
        const period = forecast.properties.periods[0];

        setWeatherData({
            temperature: tempF,
            windSpeed: windMph,
            icon: period.icon,  // keeps your previous icons
            description: period.shortForecast,
            location: trimmed.toUpperCase(),
            humidity
        });

        setMessage("");

    } catch (err) {
        console.error(err);
        setWeatherData(false);
        setMessage("Error fetching weather");
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
        setMessage("Search a place to see the weather")
    }, [])

    return (
        <div className="app">
            {loading && (
                <div className="loader-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            <div className="fox-title">
                <img className="fox-weather" src={fox} alt="Fox" />
            </div>
            <h1 className="title">NATIONAL WEATHER APP</h1>

            <div className="weather-card">
                <div className="error-message"></div>

                <div className="search-bar">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="City, state code or zip"
                        enterKeyHint="search"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                search(inputRef.current.value)
                                inputRef.current.value = ""
                            }
                        }}
                    />
                    <img
                        src={search_icon}
                        className="my-icon"
                        onClick={() => {
                            search(inputRef.current.value)
                            inputRef.current.value = ""
                        }}
                        alt="Search"
                    />
                </div>

                <div className="items">
                    {message === "Search a place to see the weather" ? (
                        <h4>{message}</h4>
                    ) : message === "Location not found" ? (
                        <div className="error">COULD NOT FIND LOCATION</div>
                    ) : weatherData ? (
                        <>
                            <img src={weatherData.icon} alt="" className="weather-icon" />
                            <p className="temperature">{weatherData.temperature}°F</p>
                            <p className="description">"{weatherData.description}"</p>
                            <p className="location">{weatherData.location}</p>

                            <div className="weather-data">
                                <div className="col">
                                    <img src={humidity_icon} alt="" />
                                    <div>
                                        <p>{weatherData.humidity}%</p>
                                        <span>Humidity</span>
                                    </div>
                                </div>

                                <div className="col">
                                    <img src={wind_icon} alt="" />
                                    <div>
                                        <p>{weatherData.windSpeed}</p>
                                        <span>Wind Speed</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default Weather
