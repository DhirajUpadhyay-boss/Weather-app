import { useEffect, useState } from 'react'

const fallbackLocation = { latitude: 28.6139, longitude: 77.209 }

export const useGeoLocation = () => {
  const [position, setPosition] = useState(
    typeof navigator !== 'undefined' && !navigator.geolocation ? fallbackLocation : null,
  )

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (geo) => setPosition({ latitude: geo.coords.latitude, longitude: geo.coords.longitude }),
      () => setPosition(fallbackLocation),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    )
  }, [])

  return position
}
