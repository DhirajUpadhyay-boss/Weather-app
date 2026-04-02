import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { DATE_FORMAT, MAX_RANGE_DAYS } from '../shared/constants/api'
import { TopHeader } from '../shared/components/layout/TopHeader'
import { PageTabs } from '../shared/components/layout/PageTabs'
import { useGeoLocation } from '../shared/hooks/useGeoLocation'
import { HistoricalPage } from '../features/history/HistoricalPage'
import { SingleDatePage } from '../features/single-date/SingleDatePage'
import { fetchHistoricalWeather, fetchSingleDateWeather } from '../shared/services/weatherService'

function App() {
  const today = dayjs().format(DATE_FORMAT)
  const [activePage, setActivePage] = useState('single')
  const [unit, setUnit] = useState('c')
  const [selectedDate, setSelectedDate] = useState(today)
  const [rangeStart, setRangeStart] = useState(dayjs().subtract(30, 'day').format(DATE_FORMAT))
  const [rangeEnd, setRangeEnd] = useState(today)
  const [singleLoading, setSingleLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState('')
  const [singleData, setSingleData] = useState(null)
  const [historyData, setHistoryData] = useState(null)
  const position = useGeoLocation()

  useEffect(() => {
    const loadSingleDateData = async () => {
      if (!position) return

      // Keep UX snappy: show feedback while API/cached data resolves.
      setSingleLoading(true)
      setError('')
      try {
        const data = await fetchSingleDateWeather({
          latitude: position.latitude,
          longitude: position.longitude,
          date: selectedDate,
        })
        setSingleData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setSingleLoading(false)
      }
    }

    loadSingleDateData()
  }, [position, selectedDate])

  useEffect(() => {
    const loadHistoricalData = async () => {
      if (!position || activePage !== 'history') return

      const start = dayjs(rangeStart)
      const end = dayjs(rangeEnd)
      if (end.isBefore(start)) {
        setError('End date must be on or after start date.')
        return
      }
      if (end.diff(start, 'day') > MAX_RANGE_DAYS) {
        setError('Please keep date range to 2 years or less.')
        return
      }

      setHistoryLoading(true)
      setError('')
      try {
        const rows = await fetchHistoricalWeather({
          latitude: position.latitude,
          longitude: position.longitude,
          rangeStart,
          rangeEnd,
        })
        setHistoryData(rows)
      } catch (err) {
        setError(err.message)
      } finally {
        setHistoryLoading(false)
      }
    }

    loadHistoricalData()
  }, [position, activePage, rangeStart, rangeEnd])

  const isInitialLoading = singleLoading && !singleData && activePage === 'single'

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-3 sm:p-4">
      <TopHeader hasPosition={Boolean(position)} />
      <PageTabs activePage={activePage} onChange={setActivePage} />

      {error && <p className="rounded-lg border border-red-400 bg-red-900/50 px-3 py-2 text-sm">{error}</p>}
      {isInitialLoading && (
        <p className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm">
          Loading weather data...
        </p>
      )}

      {activePage === 'single' && (
        <SingleDatePage
          selectedDate={selectedDate}
          unit={unit}
          onDateChange={setSelectedDate}
          onUnitChange={setUnit}
          singleData={singleData}
          isLoading={singleLoading}
        />
      )}

      {activePage === 'history' && (
        <HistoricalPage
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onStartChange={setRangeStart}
          onEndChange={setRangeEnd}
          historicalData={historyData || []}
          isLoading={historyLoading}
        />
      )}
    </main>
  )
}

export default App
