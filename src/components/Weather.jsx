import React, {useEffect} from 'react'
import {useState} from 'react'
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

export const Weather = () => {

    const [weatherData, setWeatherData] = useState(false);


    const search = async (city) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${import.meta.env.VITE_APP_ID}`

            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            setWeatherData({
                humidity: data.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp)



            



        })
        } catch (error) {

        }

    }

    useEffect(()=>{ 
        search("London");

    }, [])

    return (
        <div className="weather">
            <div className="search-bar">
                <input type="text" placeholder='Search' />
                <img src={search_icon} className="my-icon" alt="" />
            </div>
            <img src={sun_icon} alt="" className="weather-icon" />
            <p className="temperature">16°F</p>
            <p className='location'>London</p>
            <div className="weather-data">
                <div className="col">
                    <img className="humidity" src={sun2_icon} alt="" />

                    <div>
                        <p>91 %</p>
                        <span>Humidity</span>
                    </div>
                    <div className="col">
                        <img className="wind" src={wind_icon} alt="" />

                        <div>
                            <p>3.6 km/h</p>
                            <span>Wind Speed</span>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Weather
