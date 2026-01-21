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

export const Weather = () => {


    const inputRef = useRef(null);
    const [weatherData, setWeatherData] = useState(false);

    const allIcons = {
        "01d": sun_icon,
        "01n": sun_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": rain_icon,
        "04n": rain_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon
    }

    function isZipCode(input) {
        return /^\d{5}(-\d{4})?$/.test(input.trim());
    }
    const search = async (city, state, zip) => {

        let query = ""
        if (city & state === '' & zip === '') {
            alert("Enter City, State or zip Code");
            return;
        }

        else if (zip) {
            query = `${zip}, USA`;

        }

        else {
            query = `{city}, ${state}, USA`;

        }



        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
        )}`;


        const res = await fetch(url, {
            headers: {
                "User-Agent": "your-app-name (your-email@example.com)"
            }
        });


        const data = await res.json();

        if (!data.length) {
            throw new Error("Location not found");
        }
        return {
            lat: data[0].lat,
            lon: data[0].lon
        };






        




    }

    // useEffect(() => {
    //     search("London");

    // }, [])

    return (
        <div className="app">

            <div className="fox-title" >
                <img className="fox-weather" src={fox} alt="Description of the image" />

            </div>
            <h1 className="title">NATIONAL WEATHER APP</h1>

            <div className="weather-card">


                <div className="search-bar">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search a city"
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

                {weatherData && (
                    <>
                        <img src={weatherData.icon} alt="" className="weather-icon" />
                        <p className="temperature">{weatherData.temperature}°F</p>
                        <p className="location">{weatherData.location}</p>

                        <div className="weather-data">
                            <div className="col">
                                <img src={sun2_icon} alt="" />
                                <div>
                                    <p>{weatherData.humidity}%</p>
                                    <span>Humidity</span>
                                </div>
                            </div>

                            <div className="col">
                                <img src={wind_icon} alt="" />
                                <div>
                                    <p>{weatherData.windSpeed} km/h</p>
                                    <span>Wind Speed</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

}

export default Weather
