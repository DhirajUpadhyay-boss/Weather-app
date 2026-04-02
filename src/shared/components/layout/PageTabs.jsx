const buttonBase = 'rounded-lg border px-3 py-2 text-sm font-medium transition-colors cursor-pointer'

export const PageTabs = ({ activePage, onChange }) => (
  <nav className="flex flex-col gap-2 sm:flex-row">
    <button
      className={`${buttonBase} ${
        activePage === 'single'
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700'
      }`}
      onClick={() => onChange('single')}
    >
      Page 1: Single Date
    </button>
    <button
      className={`${buttonBase} ${
        activePage === 'history'
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700'
      }`}
      onClick={() => onChange('history')}
    >
      Page 2: Date Range
    </button>
  </nav>
)
