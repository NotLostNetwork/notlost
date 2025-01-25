export const calculateRelativePosition = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371000
  const toRadians = (angle: number) => (angle * Math.PI) / 180

  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const x = dLon * R * Math.cos(toRadians(lat1)) // East-west distance
  const y = dLat * R // North-south distance

  return { x, y } // Relative position in meters
}
