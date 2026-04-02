# Open-Meteo Weather Dashboard
A responsive React weather dashboard that auto-detects user GPS on landing and visualizes current + historical weather and air-quality trends using Open-Meteo APIs.

## App Preview
![Weather Dashboard Screenshot](https://cdn.phototourl.com/free/2026-04-02-b31beaaf-13ed-4a8f-860e-339cdc269a65.png)

## Key Highlights
- Automatic location detection from browser geolocation (with safe fallback).
- Two dashboards:
  - Single Date Weather Insights
  - Historical Date Range Analysis (up to 2 years)
- Rich charting with:
  - Horizontal scroll
  - Zoom in / zoom out
  - Brush-based timeframe selection
- Mobile-first responsive UI.
- Fast data handling using parallel API calls and caching.

## Feature Checklist
### Page 1: Current Weather + Hourly Forecast
- Weather cards for selected date:
  - Temperature (Min / Max / Current)
  - Precipitation
  - Sunrise / Sunset
  - Maximum wind speed
  - Relative humidity
  - UV index
  - Precipitation probability max
  - Air quality metrics: AQI, PM10, PM2.5, CO, CO2, NO2, SO2
- Hourly charts:
  - Temperature (Celsius/Fahrenheit toggle)
  - Relative humidity
  - Precipitation
  - Visibility
  - Wind speed (10m)
  - PM10 + PM2.5 (combined)

### Page 2: Historical Range Dashboard
- Date-range selection (max 2 years).
- Trend charts for:
  - Mean / Max / Min temperature
  - Sunrise / Sunset (IST)
  - Precipitation totals
  - Max wind speed + dominant wind direction
  - PM10 + PM2.5

## Tech Stack
- React + Vite
- Tailwind CSS
- Recharts
- Day.js

## Clean File Structure
- `src/app` - app shell + entry
- `src/features/single-date` - single-date weather module
- `src/features/history` - historical weather module
- `src/shared/components` - reusable UI/chart/layout components
- `src/shared/services` - API and data-fetching services
- `src/shared/hooks` - reusable hooks
- `src/shared/constants` - constants and limits
- `src/shared/utils` - utility formatters/helpers
- `src/shared/styles` - global styles

## Run Locally
1. Install dependencies:
   - `npm install`
2. Start development server:
   - `npm run dev`
3. Build production bundle:
   - `npm run build`
4. Preview production build:
   - `npm run preview`

## API Endpoints
- Forecast: `https://api.open-meteo.com/v1/forecast`
- Air Quality: `https://air-quality-api.open-meteo.com/v1/air-quality`

## Performance Notes
- Uses parallel requests for weather and air-quality payloads.
- Includes in-memory + sessionStorage caching.
- Adds request timeout handling for better UX reliability.
