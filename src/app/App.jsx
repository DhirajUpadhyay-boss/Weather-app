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
  // default to today so the single-date view loads something useful immediately
  const today = dayjs().format(DATE_FORMAT)

  const [activePage, setActivePage] = useState('single')
  const [unit, setUnit] = useState('c') // 'c' or 'f' — toggled from the header
  const [selectedDate, setSelectedDate] = useState(today)

  // history range — default to last 30 days, feels like a reasonable window
  const [rangeStart, setRangeStart] = useState(dayjs().subtract(30, 'day').format(DATE_FORMAT))
  const [rangeEnd, setRangeEnd] = useState(today)

  // separate loading flags so the two pages don't step on each other
  const [singleLoading, setSingleLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)

  const [error, setError] = useState('')
  const [singleData, setSingleData] = useState(null)
  const [historyData, setHistoryData] = useState(null)

  // grab the browser's geolocation — null until the user grants permission
  const position = useGeoLocation()

  // re-fetch whenever the user picks a new date or we finally get their coords
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

  // only load history when the user actually switches to that tab — no point
  // hammering the API for a page they might never visit
  useEffect(() => {
    const loadHistoricalData = async () => {
      if (!position || activePage !== 'history') return

      const start = dayjs(rangeStart)
      const end = dayjs(rangeEnd)

      // basic sanity checks before we even bother hitting the network
      if (end.isBefore(start)) {
        setError('End date must be on or after start date.')
        return
      }

      // API caps out at MAX_RANGE_DAYS, so catch this early with a friendlier message
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

  // show the loading banner only on first load — once we have data we let the
  // page handle its own skeleton/spinner so things don't jump around
  const isInitialLoading = singleLoading && !singleData && activePage === 'single'

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-3 sm:p-4">
      <TopHeader hasPosition={Boolean(position)} />
      <PageTabs activePage={activePage} onChange={setActivePage} />

      {/* global error banner — both pages share this */}
      {error && (
        <p className="rounded-lg border border-red-400 bg-red-900/50 px-3 py-2 text-sm">{error}</p>
      )}

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
          historicalData={historyData || []} // fallback to [] so the table doesn't blow up
          isLoading={historyLoading}
        />
      )}
    </main>
  )
}

export default App
