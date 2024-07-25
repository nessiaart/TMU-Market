import React, { useState, useEffect } from "react";
import axios from "axios";
import {CloudRain, CloudLightning, Cloud, CloudFog, Sun, Waves, Thermometer, Snowflake, Umbrella} from "phosphor-react";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const apiKey = "da6e4ffbabf9896654a00d670a672972";
  const city = "Toronto";
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response =
          await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        setWeather(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeather();
  }, [city]);

  if (!weather) return <div>Loading...</div>;

  // determine which icon to display based on weather condition
  const getWeatherIcon = (weatherCondition) => {
    switch (weatherCondition) {
      case "Thunderstorm":
        return <CloudLightning size={48} />;
      case "Drizzle":
        return <Umbrella size={48} />;
      case "Rain":
        return <CloudRain size={48} />;
      case "Snow":
        return <Snowflake size={48} />;
      case "Clear":
        return <Sun size={48} />;
      case "Mist":
        return <Waves size={48} />;
        case "Fog":
        return <CloudFog size={48} />;
      case "Clouds":
        return <Cloud size={48} />;
      default:
        return <Thermometer size={48} />;
    }
  };

  return (
    <div style={{ fontSize: "20px", textAlign: "right", display: "flex", justifyContent: "flex-end" }}>
      <div style={{ marginRight: "10px" }}>
        {getWeatherIcon(weather.weather[0].main)}
      </div>
      <div>
        {Math.round(weather.main.temp)}°C, {weather.weather[0].main}
      </div>
    </div>
  );
  };
export default Weather;
