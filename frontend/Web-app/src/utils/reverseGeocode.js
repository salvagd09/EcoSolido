export async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'EcoSolidoApp/1.0' } });
    if (!response.ok) throw new Error('Geocoding service error');
    const data = await response.json();
    // Prefer display_name, fallback to road + city
    return data.display_name || `${data.address?.road || ''} ${data.address?.city || ''}`.trim();
  } catch (e) {
    console.error('Reverse geocode failed:', e);
    return '';
  }
}
