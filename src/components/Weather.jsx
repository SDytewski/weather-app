import React from 'react'
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
    return (
        <div className="weather">
            <div className="search-bar">
                <input type="text" placeholder='Search' />
                <img src={search_icon} className="my-icon"  alt="" />
            </div>
        </div>
    )
}

export default Weather
