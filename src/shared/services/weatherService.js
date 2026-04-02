import dayjs from 'dayjs'
import { AIR_BASE_URL, WEATHER_BASE_URL } from '../constants/api'
import { fetchJsonCached } from './apiClient'
import { pickAtIndex } from '../utils/formatters'

const getLocationQuery = (latitude, longitude) => `latitude=${latitude}&longitude=${longitude}`

export const fetchSingleDateWeather = async ({ latitude, longitude, date }) => {
  const query = getLocationQuery(latitude, longitude)

  const weatherUrl =
    `${WEATHER_BASE_URL}?${query}&timezone=auto&start_date=${date}&end_date=${date}` +
    '&current=temperature_2m,relative_humidity_2m,precipitation,uv_index,wind_speed_10m' +
    '&daily=temperature_2m_min,temperature_2m_max,sunrise,sunset,wind_speed_10m_max,precipitation_probability_max,precipitation_sum' +
    '&hourly=temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m'

  const airUrl =
    `${AIR_BASE_URL}?${query}&timezone=auto&start_date=${date}&end_date=${date}` +
    '&hourly=us_aqi,pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide'

  const [weather, air] = await Promise.all([fetchJsonCached(weatherUrl), fetchJsonCached(airUrl)])

  const mergedHourly = (weather.hourly?.time || []).map((time, index) => ({
    time,
    hour: dayjs(time).format('HH:mm'),
    temperature: pickAtIndex(weather.hourly.temperature_2m, index),
    relativeHumidity: pickAtIndex(weather.hourly.relative_humidity_2m, index),
    precipitation: pickAtIndex(weather.hourly.precipitation, index),
    visibility: pickAtIndex(weather.hourly.visibility, index),
    windSpeed10m: pickAtIndex(weather.hourly.wind_speed_10m, index),
    pm10: pickAtIndex(air.hourly?.pm10, index),
    pm25: pickAtIndex(air.hourly?.pm2_5, index),
  }))

  return { weather, air, mergedHourly }
}

export const fetchHistoricalWeather = async ({ latitude, longitude, rangeStart, rangeEnd }) => {
  const query = getLocationQuery(latitude, longitude)

  const weatherUrl =
    `${WEATHER_BASE_URL}?${query}&timezone=auto&start_date=${rangeStart}&end_date=${rangeEnd}` +
    '&daily=temperature_2m_mean,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant'

  const airUrl =
    `${AIR_BASE_URL}?${query}&timezone=auto&start_date=${rangeStart}&end_date=${rangeEnd}` +
    '&daily=pm10_mean,pm2_5_mean'

  const [weather, air] = await Promise.all([fetchJsonCached(weatherUrl), fetchJsonCached(airUrl)])

  return (weather.daily?.time || []).map((date, index) => ({
    date,
    tempMean: pickAtIndex(weather.daily.temperature_2m_mean, index),
    tempMax: pickAtIndex(weather.daily.temperature_2m_max, index),
    tempMin: pickAtIndex(weather.daily.temperature_2m_min, index),
    sunrise: pickAtIndex(weather.daily.sunrise, index),
    sunset: pickAtIndex(weather.daily.sunset, index),
    precipitation: pickAtIndex(weather.daily.precipitation_sum, index),
    windMax: pickAtIndex(weather.daily.wind_speed_10m_max, index),
    windDirection: pickAtIndex(weather.daily.wind_direction_10m_dominant, index),
    pm10: pickAtIndex(air.daily?.pm10_mean, index),
    pm25: pickAtIndex(air.daily?.pm2_5_mean, index),
  }))
}
