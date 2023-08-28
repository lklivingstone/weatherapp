const axios = require('axios');
const router= require("express").Router()

const WEATHERBIT_API_KEY = '6388b4bbaaf04c83b1ddea6609fd0974';
const WEATHERBIT_BASE_URL = 'http://api.weatherbit.io/v2.0/current';

// GET WEATHER
router.post("/getWeather", async (req, res)=> {
    try {
        const { cities } = req.body;
        if (!cities || !Array.isArray(cities) || cities.length === 0) {
            return res.status(400).json({ 
                error: 'Invalid input. Please provide city name(s).'
            });
        }
    
        // Create an object to store weather data for each city
        const weatherData = {};
    
        // Make requests to Weatherbit API for each city
        for (const city of cities) {
            const response = await axios.get(`${WEATHERBIT_BASE_URL}?key=${WEATHERBIT_API_KEY}&city=${city}`);
            const { data } = response;
        
            if (data && data.data && data.data[0] && data.data[0].temp) {
                weatherData[data.data[0].city_name] = `${data.data[0].temp}C`;
            } else {
                weatherData[city] = 'N/A'; // Weather data not available for this city
            }
        }
    
        return res.json({ weather: weatherData });
      } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
})

module.exports= router