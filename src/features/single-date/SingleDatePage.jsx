import { useMemo } from 'react'
import { Area, AreaChart, Bar, BarChart, Brush, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { HOURLY_CHART_POINT_WIDTH } from '../../shared/constants/api'
import { formatNumber, toISTDateTime } from '../../shared/utils/formatters'
import { ChartCard } from '../../shared/components/charts/ChartCard'
import { ScrollableChart } from '../../shared/components/charts/ScrollableChart'

const inputBase =
  'rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-blue-500'

export const SingleDatePage = ({ selectedDate, unit, onDateChange, onUnitChange, singleData, isLoading }) => {
  const currentWeatherCards = useMemo(() => {
    if (!singleData) return []
    const d = singleData.weather.daily
    const c = singleData.weather.current
    const a = singleData.air.hourly || {}

    return [
      { label: 'Temperature Min', value: formatNumber(d.temperature_2m_min?.[0], ' C') },
      { label: 'Temperature Max', value: formatNumber(d.temperature_2m_max?.[0], ' C') },
      { label: 'Temperature Current', value: formatNumber(c.temperature_2m, ' C') },
      { label: 'Precipitation', value: formatNumber(d.precipitation_sum?.[0], ' mm') },
      { label: 'Sunrise', value: toISTDateTime(d.sunrise?.[0]) },
      { label: 'Sunset', value: toISTDateTime(d.sunset?.[0]) },
      { label: 'Maximum Wind Speed', value: formatNumber(d.wind_speed_10m_max?.[0], ' km/h') },
      { label: 'Relative Humidity', value: formatNumber(c.relative_humidity_2m, ' %') },
      { label: 'UV Index', value: formatNumber(c.uv_index) },
      { label: 'Precipitation Probability Max', value: formatNumber(d.precipitation_probability_max?.[0], ' %') },
      { label: 'Air Quality Index', value: formatNumber(a.us_aqi?.[0]) },
      { label: 'PM10', value: formatNumber(a.pm10?.[0], ' ug/m3') },
      { label: 'PM2.5', value: formatNumber(a.pm2_5?.[0], ' ug/m3') },
      { label: 'Carbon Monoxide CO', value: formatNumber(a.carbon_monoxide?.[0], ' ug/m3') },
      { label: 'Carbon Dioxide CO2', value: formatNumber(a.carbon_dioxide?.[0], ' ppm') },
      { label: 'Nitrogen Dioxide NO2', value: formatNumber(a.nitrogen_dioxide?.[0], ' ug/m3') },
      { label: 'Sulphur Dioxide SO2', value: formatNumber(a.sulphur_dioxide?.[0], ' ug/m3') },
    ]
  }, [singleData])

  const singleHourly = useMemo(() => singleData?.mergedHourly || [], [singleData])
  const hourlyTemperature = useMemo(() => {
    if (unit === 'c') return singleHourly
    return singleHourly.map((entry) => ({
      ...entry,
      temperature:
        entry.temperature === null || entry.temperature === undefined
          ? null
          : entry.temperature * 1.8 + 32,
    }))
  }, [singleHourly, unit])

  return (
    <>
      <section className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-sm">
            Date:
            <input className={inputBase} type="date" value={selectedDate} onChange={(e) => onDateChange(e.target.value)} />
          </label>
          <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-sm">
            Temperature Unit:
            <select className={inputBase} value={unit} onChange={(e) => onUnitChange(e.target.value)}>
              <option value="c">Celsius</option>
              <option value="f">Fahrenheit</option>
            </select>
          </label>
        </div>
      </section>
      {isLoading && <p className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm">Refreshing selected date data...</p>}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {currentWeatherCards.map((item) => (
          <article
            className="rounded-xl border border-slate-700 bg-gradient-to-br from-blue-950 to-slate-900 p-3"
            key={item.label}
          >
            <h4 className="mb-1 text-sm font-semibold text-blue-200">{item.label}</h4>
            <p className="text-sm font-medium text-slate-100">{item.value}</p>
          </article>
        ))}
      </section>

      <ChartCard title="Temperature (Hourly)">
        <ScrollableChart data={singleHourly} minWidth={Math.max(900, singleHourly.length * HOURLY_CHART_POINT_WIDTH)}>
          {() => (
            <LineChart data={hourlyTemperature}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#ff7300" name={unit === 'c' ? 'Temp (C)' : 'Temp (F)'} dot={false} />
              <Brush dataKey="hour" height={24} />
            </LineChart>
          )}
        </ScrollableChart>
      </ChartCard>

      <ChartCard title="Relative Humidity (Hourly)">
        <ScrollableChart data={singleHourly} minWidth={Math.max(900, singleHourly.length * HOURLY_CHART_POINT_WIDTH)}>
          {(chartData) => (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="relativeHumidity" stroke="#82ca9d" fill="#82ca9d" />
              <Brush dataKey="hour" height={24} />
            </AreaChart>
          )}
        </ScrollableChart>
      </ChartCard>

      <ChartCard title="Precipitation (Hourly)">
        <ScrollableChart data={singleHourly} minWidth={Math.max(900, singleHourly.length * HOURLY_CHART_POINT_WIDTH)}>
          {(chartData) => (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="precipitation" fill="#8884d8" />
              <Brush dataKey="hour" height={24} />
            </BarChart>
          )}
        </ScrollableChart>
      </ChartCard>

      <ChartCard title="Visibility (Hourly)">
        <ScrollableChart data={singleHourly} minWidth={Math.max(900, singleHourly.length * HOURLY_CHART_POINT_WIDTH)}>
          {(chartData) => (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="visibility" stroke="#0088fe" dot={false} />
              <Brush dataKey="hour" height={24} />
            </LineChart>
          )}
        </ScrollableChart>
      </ChartCard>

      <ChartCard title="Wind Speed 10m (Hourly)">
        <ScrollableChart data={singleHourly} minWidth={Math.max(900, singleHourly.length * HOURLY_CHART_POINT_WIDTH)}>
          {(chartData) => (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="windSpeed10m" stroke="#00c49f" dot={false} />
              <Brush dataKey="hour" height={24} />
            </LineChart>
          )}
        </ScrollableChart>
      </ChartCard>

      <ChartCard title="PM10 & PM2.5 (Hourly)">
        <ScrollableChart data={singleHourly} minWidth={Math.max(900, singleHourly.length * HOURLY_CHART_POINT_WIDTH)}>
          {(chartData) => (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pm10" stroke="#ff8042" dot={false} />
              <Line type="monotone" dataKey="pm25" stroke="#a54ee8" dot={false} />
              <Brush dataKey="hour" height={24} />
            </LineChart>
          )}
        </ScrollableChart>
      </ChartCard>
    </>
  )
}
