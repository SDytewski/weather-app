import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import cloud_icon from '../assets/cloud.png'
import cloudy_icon from '../assets/cloudy.png'
import rain_icon from '../assets/rainy-day.png'
import snow_icon from '../assets/snowflake.png'
import sun_icon from '../assets/sun.png'
import thunder_icon from '../assets/thunderstorm.png'
import sun2_icon from '../assets/sun2.png'
import wind_icon from '../assets/wind.png'
import fox from '../assets/fox.jpg'
import humidity_icon from '../assets/humidity.png'




// 


export const Weather = () => {




    const inputRef = useRef(null);
    const [weatherData, setWeatherData] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    let content;
    // const search = async (input) => {

    //     console.log(input);

    //     const headers = {
    //         "User-Agent": "Weather-app (sdytewski+test@gmail.com)",
    //         "Accept": "application/geo+json"
    //     };

    //     async function fetchJSON(url, customHeaders = headers) {
    //         const res = await fetch(url, { headers: customHeaders });
    //         if (!res.ok) throw new Error("Request failed");
    //         return res.json();
    //     }

    //     const trimmed = input.trim();
    //     const isZip = /^\d{5}(-\d{4})?$/.test(trimmed);

    //     const query = isZip
    //         ? `${trimmed}, USA`
    //         : `${trimmed.split(",")[0]}, ${trimmed.split(",")[1]}, USA`;

    //     const geoData = await fetchJSON(
    //         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
    //         { "User-Agent": headers["User-Agent"] }
    //     );

    //     const { lat, lon } = geoData[0];

    //     const points = await fetchJSON(
    //         `https://api.weather.gov/points/${lat},${lon}`
    //     );

    //     const forecast = await fetchJSON(points.properties.forecast);
    //     return forecast.properties.periods;

    //         setWeatherData({
    //   temperature: period.temperature,
    //   windSpeed: period.windSpeed,
    //   icon: period.icon,
    //   description: period.shortForecast,
    //   location: trimmed,
    //   humidity
    // });


    // }


    const search = async (input) => {

        setLoading(true);

        console.log(weatherData)
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

            const trimmed = input.trim();
            // setLoading(true)
            if (!trimmed) return;

            const isZip = /^\d{5}(-\d{4})?$/.test(trimmed);

            const query = isZip
                ? `${trimmed}, USA`
                : `${trimmed.split(",")[0]}, ${trimmed.split(",")[1]}, USA`;

            const geoData = await fetchJSON(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
                { "User-Agent": headers["User-Agent"] }
            );

            if (!geoData.length) { 
                setMessage('Location not found');
                setWeatherData(false);
                return
            };


            const { lat, lon } = geoData[0];

            const points = await fetchJSON(
                `https://api.weather.gov/points/${lat},${lon}`
            );

            const forecast = await fetchJSON(points.properties.forecast);
            const period = forecast.properties.periods[0];

            // OPTIONAL: grid data for humidity
            const gridData = await fetchJSON(
                points.properties.forecastGridData
            );

            const humidity =
                gridData.properties.relativeHumidity.values[0]?.value;

            setWeatherData({
                temperature: period.temperature,
                windSpeed: period.windSpeed,
                icon: period.icon,
                description: period.shortForecast,
                location: trimmed,
                humidity
            });
            setMessage('');

        } catch (err) {
            console.error(err);
            setWeatherData(false);
        }
    };





    useEffect(() => {
        setMessage("Search a place to see the weather");

    }, [])

    return (
        <div className="app">

            <div className="fox-title" >
                <img className="fox-weather" src={fox} alt="Description of the image" />

            </div>
            <h1 className="title">NATIONAL WEATHER APP</h1>

            <div className="weather-card">
                <div className="error-message"></div>


                <div className="search-bar">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search city, st or zip"
                        enterKeyHint="search" // shows "Search" on mobile keyboard
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                search(inputRef.current.value);
                                inputRef.current.value = ""; // optional: clear input after search
                            }
                        }}
                    />
                    <img
                        src={search_icon}
                        className="my-icon"
                        onClick={() => {
                            search(inputRef.current.value);
                            inputRef.current.value = ""; // optional: clear input after click
                        }}
                        alt="Search"
                    />
                </div>
                <div className="items">

                    {
                        message === "Search a place to see the weather" ? (
                            <h1>{message}</h1>

                        )
                            :

                            message === "Location not found" ? (<div className="error">COULD NOT FIND LOCATION </div>)

                                : weatherData ?
                                (

                                    <>
                                        <img src={weatherData.icon} alt="" className="weather-icon" />
                                        <p className="temperature">{weatherData.temperature}°F</p>
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
                                ) : null
                    }
                </div>
            </div>
        </div>
    );

}

export default Weather
