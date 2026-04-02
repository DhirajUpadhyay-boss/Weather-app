import { Bar, BarChart, Brush, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { DAILY_CHART_POINT_WIDTH } from '../../shared/constants/api'
import { toISTMinutes } from '../../shared/utils/formatters'
import { ChartCard } from '../../shared/components/charts/ChartCard'
import { ScrollableChart } from '../../shared/components/charts/ScrollableChart'

const inputBase =
  'rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-blue-500'

export const HistoricalPage = ({ rangeStart, rangeEnd, onStartChange, onEndChange, historicalData, isLoading }) => {
  const maxHistWindow = Math.max(10, Math.floor(historicalData.length / 4))

  return (
    <>
      <section className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-sm">
            Start date:
            <input className={inputBase} type="date" value={rangeStart} onChange={(e) => onStartChange(e.target.value)} />
          </label>
          <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-sm">
            End date:
            <input className={inputBase} type="date" value={rangeEnd} onChange={(e) => onEndChange(e.target.value)} />
          </label>
          <p className="text-sm text-slate-400">Maximum range: 2 years</p>
        </div>
      </section>
      {isLoading && <p className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm">Loading historical data for selected range...</p>}

      <ChartCard title="Temperature Mean / Max / Min (Daily)">
        <ScrollableChart
          data={historicalData}
          minWidth={Math.max(900, historicalData.length * DAILY_CHART_POINT_WIDTH)}
        >
          {(chartData) => (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="tempMean" stroke="#ff7300" dot={false} />
              <Line dataKey="tempMax" stroke="#ff0000" dot={false} />
              <Line dataKey="tempMin" stroke="#0088fe" dot={false} />
              <Brush dataKey="date" height={24} travellerWidth={8} />
            </LineChart>
          )}
        </ScrollableChart>
      </ChartCard>

      <ChartCard title="Sunrise & Sunset (IST)">
        <ScrollableChart
          data={historicalData}
          minWidth={Math.max(900, historicalData.length * DAILY_CHART_POINT_WIDTH)}
        >
          {(chartData) => (
            <LineChart
              data={chartData.map((item) => ({
                ...item,
                sunriseMinutes: toISTMinutes(item.sunrise),
                sunsetMinutes: toISTMinutes(item.sunset),
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="sunriseMinutes" stroke="#f4b400" name="Sunrise (mins)" dot={false} />
              <Line dataKey="sunsetMinutes" stroke="#e8710a" name="Sunset (mins)" dot={false} />
              <Brush dataKey="date" height={24} travellerWidth={8} />
            </LineChart>
          )}
        </ScrollableChart>
      </ChartCard>

      <ChartCard title="Precipitation (Daily Total)">
        <ScrollableChart
          data={historicalData}
          minWidth={Math.max(900, historicalData.length * DAILY_CHART_POINT_WIDTH)}
        >
          {(chartData) => (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="precipitation" fill="#3b82f6" />
              <Brush dataKey="date" height={24} travellerWidth={8} startIndex={0} endIndex={maxHistWindow} />
            </BarChart>
          )}
        </ScrollableChart>
      </ChartCard>

      <ChartCard title="Wind Max Speed & Dominant Direction">
        <ScrollableChart
          data={historicalData}
          minWidth={Math.max(900, historicalData.length * DAILY_CHART_POINT_WIDTH)}
        >
          {(chartData) => (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="windMax" stroke="#00c49f" dot={false} />
              <Line dataKey="windDirection" stroke="#a855f7" dot={false} />
              <Brush dataKey="date" height={24} travellerWidth={8} />
            </LineChart>
          )}
        </ScrollableChart>
      </ChartCard>

      <ChartCard title="PM10 & PM2.5 (Daily Trend)">
        <ScrollableChart
          data={historicalData}
          minWidth={Math.max(900, historicalData.length * DAILY_CHART_POINT_WIDTH)}
        >
          {(chartData) => (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="pm10" stroke="#ff8042" dot={false} />
              <Line dataKey="pm25" stroke="#a54ee8" dot={false} />
              <Brush dataKey="date" height={24} travellerWidth={8} />
            </LineChart>
          )}
        </ScrollableChart>
      </ChartCard>
    </>
  )
}
