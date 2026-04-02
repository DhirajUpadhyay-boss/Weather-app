import { useMemo, useState } from 'react'
import { ResponsiveContainer } from 'recharts'

export const ScrollableChart = ({ data, minWidth, children }) => {
  const [zoom, setZoom] = useState(1)
  const canZoomOut = zoom > 1
  const canZoomIn = zoom < 4

  // A tiny zoom utility without extra charting dependencies.
  const computedWidth = useMemo(() => Math.round(minWidth * zoom), [minWidth, zoom])

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => canZoomOut && setZoom((z) => Math.max(1, Number((z - 0.5).toFixed(2))))}
          disabled={!canZoomOut}
          className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-100 disabled:opacity-40"
        >
          Zoom -
        </button>
        <button
          type="button"
          onClick={() => canZoomIn && setZoom((z) => Math.min(4, Number((z + 0.5).toFixed(2))))}
          disabled={!canZoomIn}
          className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-100 disabled:opacity-40"
        >
          Zoom +
        </button>
      </div>
      <div className="overflow-x-auto">
        <div style={{ minWidth: computedWidth }}>
          <ResponsiveContainer width="100%" height={290}>
            {children(data)}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
