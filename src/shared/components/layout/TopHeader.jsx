export const TopHeader = ({ hasPosition }) => (
  <header className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
    <h1 className="mb-1 text-xl font-bold sm:text-2xl">Open-Meteo Weather Dashboard</h1>
    <p className="text-sm text-slate-300 sm:text-base">
      Auto GPS weather + air quality insights ({hasPosition ? 'Location detected' : 'Detecting location...'})
    </p>
  </header>
)
