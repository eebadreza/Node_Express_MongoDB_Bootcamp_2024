export const displayMap = (locations) => {
  const map = L.map('map', {
    attributionControl: false,
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    zoomSnap: 0.3, // important for perfect fit of the bounds
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const bounds = L.latLngBounds();
  const icon = L.icon({
    iconUrl: '/../img/pin.png',
    iconSize: [20, 25],
    iconAnchor: [10, 25],
    popupAnchor: [0, -25],
  });
  const latLngs = [];
  locations.forEach((loc) => {
    const coord = loc.coordinates.reverse();
    latLngs.push(coord);
    bounds.extend(coord);
    L.marker(coord, { icon })
      .bindPopup(`<p>Day: ${loc.day}</p><p>${loc.description}</p>`)
      .addTo(map);
  });

  L.polyline(latLngs, { color: 'white' }).addTo(map);
  map.fitBounds(bounds.pad(0.6));
};

// New Code Here -----------------------------------------------------------------------------
