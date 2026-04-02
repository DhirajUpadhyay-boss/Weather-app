export const pickAtIndex = (arr, index) => (arr && arr[index] !== undefined ? arr[index] : null)

export const formatNumber = (value, suffix = '') =>
  value === null || value === undefined || Number.isNaN(value) ? 'N/A' : `${Number(value).toFixed(2)}${suffix}`

export const toISTDateTime = (value) => {
  if (!value) return 'N/A'
  return new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
}

export const toISTMinutes = (value) => {
  if (!value) return null
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(value))

  const hour = Number(parts.find((part) => part.type === 'hour')?.value || 0)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value || 0)
  return hour * 60 + minute
}
