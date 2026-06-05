const presetLocations = {
  dartmoor: { name: "Dartmoor, UK", latitude: 50.57, longitude: -3.92, timezone: "Europe/London" },
  sedona: { name: "Sedona, Arizona", latitude: 34.8697, longitude: -111.761, timezone: "America/Phoenix" },
  lofoten: { name: "Lofoten, Norway", latitude: 68.154, longitude: 13.611, timezone: "Europe/Oslo" }
};

const objectCatalog = [
  { name: "Polaris", type: "Star", ra: 2.53, dec: 89.26, mag: 2.0, note: "The north star stays close to true north and helps with rough polar alignment." },
  { name: "Vega", type: "Star", ra: 18.615, dec: 38.78, mag: 0.0, note: "Bright summer star and one corner of the Summer Triangle." },
  { name: "Deneb", type: "Star", ra: 20.69, dec: 45.28, mag: 1.25, note: "High northern star anchoring Cygnus and the Summer Triangle." },
  { name: "Altair", type: "Star", ra: 19.85, dec: 8.87, mag: 0.76, note: "Fast-rising bright star in Aquila and part of the Summer Triangle." },
  { name: "Betelgeuse", type: "Star", ra: 5.92, dec: 7.41, mag: 0.5, note: "Red supergiant marking Orion’s shoulder." },
  { name: "Rigel", type: "Star", ra: 5.24, dec: -8.2, mag: 0.15, note: "Blue-white beacon at Orion’s foot." },
  { name: "Sirius", type: "Star", ra: 6.75, dec: -16.72, mag: -1.46, note: "The brightest night-sky star, strikingly low in many northern sites." },
  { name: "Arcturus", type: "Star", ra: 14.26, dec: 19.18, mag: -0.05, note: "Warm orange giant, easy to find by following the Big Dipper’s handle." },
  { name: "Andromeda Galaxy", type: "Galaxy", ra: 0.712, dec: 41.269, mag: 3.4, note: "Large nearby galaxy and a classic binocular or wide-field target." },
  { name: "Triangulum Galaxy", type: "Galaxy", ra: 1.564, dec: 30.66, mag: 5.7, note: "Diffuse face-on galaxy that rewards darker skies." },
  { name: "Pleiades", type: "Open cluster", ra: 3.79, dec: 24.117, mag: 1.6, note: "Compact bright cluster, excellent in binoculars or short focal lengths." },
  { name: "Orion Nebula", type: "Nebula", ra: 5.588, dec: -5.45, mag: 4.0, note: "One of the showpiece nebulae for visual observing and imaging." },
  { name: "Lagoon Nebula", type: "Nebula", ra: 18.05, dec: -24.383, mag: 6.0, note: "Rich southern Milky Way emission nebula with strong photo appeal." },
  { name: "North America Nebula", type: "Nebula", ra: 20.967, dec: 44.53, mag: 4.0, note: "Large nebula that benefits from dark skies and wide-field framing." },
  { name: "Ring Nebula", type: "Planetary nebula", ra: 18.884, dec: 33.03, mag: 8.8, note: "Small but rewarding target for higher magnification when seeing is steady." },
  { name: "Omega Centauri", type: "Globular cluster", ra: 13.447, dec: -47.479, mag: 3.7, note: "Spectacular southern globular cluster, best from lower latitudes." }
];

const seasonalPacks = {
  spring: {
    title: "Spring sky pack",
    note: "Lean into galaxies, globulars, and bright guide stars that hold altitude well through the middle of the night.",
    objects: ["Arcturus", "Omega Centauri", "Polaris", "Ring Nebula", "Vega"]
  },
  summer: {
    title: "Summer sky pack",
    note: "This is the Milky Way season, with bright triangle stars and rich nebulae peaking after twilight clears.",
    objects: ["Vega", "Deneb", "Altair", "Lagoon Nebula", "North America Nebula", "Ring Nebula"]
  },
  autumn: {
    title: "Autumn sky pack",
    note: "Autumn rewards patient dark-sky observing with wide galaxies and clusters that benefit from lower moonlight.",
    objects: ["Andromeda Galaxy", "Triangulum Galaxy", "Pleiades", "Altair", "Deneb"]
  },
  winter: {
    title: "Winter sky pack",
    note: "Winter brings bright showpiece stars and nebulae that work well even when the seeing is only fair.",
    objects: ["Orion Nebula", "Betelgeuse", "Rigel", "Sirius", "Pleiades", "Aldebaran"]
  }
};

const moonSensitivityByType = {
  Star: 2,
  Galaxy: 18,
  Nebula: 16,
  "Planetary nebula": 11,
  "Globular cluster": 9,
  "Open cluster": 7
};

const objectPhotos = {
  "Andromeda Galaxy": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20Andromeda%20Galaxy.jpg",
    title: "Andromeda Galaxy photo",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:The_Andromeda_Galaxy.jpg"
  },
  "Orion Nebula": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20Orion%20Nebula%20%28M42%29%20%28eso0421a%29.jpg",
    title: "Orion Nebula photo",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:The_Orion_Nebula_(M42)_(eso0421a).jpg"
  },
  "Pleiades": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pleiades%20large.jpg",
    title: "Pleiades photo",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Pleiades_large.jpg"
  },
  "Ring Nebula": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ring%20Nebula%20-%20GPN-2000-000964.jpg",
    title: "Ring Nebula photo",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Ring_Nebula_-_GPN-2000-000964.jpg"
  },
  "Lagoon Nebula": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lagoon%20Nebula.jpg",
    title: "Lagoon Nebula photo",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Lagoon_Nebula.jpg"
  },
  "Omega Centauri": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Omega%20Centauri%20%28b09%29.jpg",
    title: "Omega Centauri photo",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Omega_Centauri_(b09).jpg"
  },
  "Triangulum Galaxy": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20Triangulum%20Galaxy%20%28b13%29.jpg",
    title: "Triangulum Galaxy photo",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:The_Triangulum_Galaxy_(b13).jpg"
  }
};

const brightStars = [
  { name: "Dubhe", ra: 11.06, dec: 61.75, mag: 1.79 },
  { name: "Merak", ra: 11.03, dec: 56.38, mag: 2.34 },
  { name: "Phecda", ra: 11.9, dec: 53.69, mag: 2.41 },
  { name: "Megrez", ra: 12.26, dec: 57.03, mag: 3.3 },
  { name: "Alioth", ra: 12.9, dec: 55.96, mag: 1.76 },
  { name: "Mizar", ra: 13.4, dec: 54.93, mag: 2.06 },
  { name: "Alkaid", ra: 13.79, dec: 49.31, mag: 1.86 },
  { name: "Capella", ra: 5.28, dec: 46.0, mag: 0.08 },
  { name: "Aldebaran", ra: 4.6, dec: 16.51, mag: 0.86 },
  { name: "Procyon", ra: 7.65, dec: 5.22, mag: 0.38 }
];

const constellationLines = [
  ["Betelgeuse", "Rigel"],
  ["Vega", "Deneb"],
  ["Deneb", "Altair"],
  ["Dubhe", "Merak"],
  ["Merak", "Phecda"],
  ["Phecda", "Megrez"],
  ["Megrez", "Alioth"],
  ["Alioth", "Mizar"],
  ["Mizar", "Alkaid"]
];

const state = {
  activeLocation: presetLocations.dartmoor,
  hoursOffset: 0,
  selectedName: "",
  showLabels: true,
  showConstellations: true,
  showAtmosphere: true,
  noteDraft: ""
};

const els = {
  location: document.querySelector("#explorer-location"),
  locationSearchButton: document.querySelector("#location-search-button"),
  deviceLocationButton: document.querySelector("#device-location-button"),
  locationStatus: document.querySelector("#location-status"),
  objectSelect: document.querySelector("#object-select"),
  slider: document.querySelector("#time-slider"),
  resetTime: document.querySelector("#reset-time"),
  toggles: document.querySelectorAll("[data-toggle]"),
  stageTitle: document.querySelector("#stage-title"),
  stageTime: document.querySelector("#stage-time"),
  stageCoords: document.querySelector("#stage-coords"),
  canvas: document.querySelector("#sky-canvas"),
  canvasFooter: document.querySelector("#canvas-footer"),
  tonightGrid: document.querySelector("#tonight-grid"),
  tonightNote: document.querySelector("#tonight-note"),
  objectTitle: document.querySelector("#object-title"),
  objectPhotoWrap: document.querySelector("#object-photo-wrap"),
  objectInfo: document.querySelector("#object-info"),
  objectNote: document.querySelector("#object-note"),
  targetTimeline: document.querySelector("#target-timeline"),
  timelineAxis: document.querySelector("#timeline-axis"),
  timelineNote: document.querySelector("#timeline-note"),
  astronomyGrid: document.querySelector("#astronomy-grid"),
  astronomyNote: document.querySelector("#astronomy-note"),
  seasonalList: document.querySelector("#seasonal-list"),
  seasonalNote: document.querySelector("#seasonal-note"),
  routeList: document.querySelector("#route-list"),
  routeNote: document.querySelector("#route-note"),
  alertsList: document.querySelector("#alerts-list"),
  alertsNote: document.querySelector("#alerts-note"),
  visibleList: document.querySelector("#visible-list"),
  sessionNote: document.querySelector("#session-note"),
  saveNoteButton: document.querySelector("#save-note-button"),
  clearNoteButton: document.querySelector("#clear-note-button"),
  recordStatus: document.querySelector("#record-status"),
  notesList: document.querySelector("#notes-list"),
  savePlanButton: document.querySelector("#save-plan-button"),
  plansNote: document.querySelector("#plans-note"),
  plansList: document.querySelector("#plans-list")
};

const ctx = els.canvas.getContext("2d");
const storageKeys = {
  notes: "sky-explorer-notes",
  plans: "sky-explorer-plans"
};

function loadStoredList(key) {
  try {
    const raw = window.localStorage?.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredList(key, items) {
  try {
    window.localStorage?.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore storage errors and keep the live session usable.
  }
}

const astro = (() => {
  const PI = Math.PI;
  const rad = PI / 180;
  const dayMs = 86400000;
  const J1970 = 2440588;
  const J2000 = 2451545;
  const e = rad * 23.4397;

  function toJulian(date) {
    return date.valueOf() / dayMs - 0.5 + J1970;
  }

  function toDays(date) {
    return toJulian(date) - J2000;
  }

  function siderealDegrees(date, longitude) {
    const d = toDays(date);
    return ((280.16 + 360.9856235 * d + longitude) % 360 + 360) % 360;
  }

  function solarMeanAnomaly(d) {
    return rad * (357.5291 + 0.98560028 * d);
  }

  function eclipticLongitude(m) {
    const c = rad * (1.9148 * Math.sin(m) + 0.02 * Math.sin(2 * m) + 0.0003 * Math.sin(3 * m));
    const p = rad * 102.9372;
    return m + c + p + PI;
  }

  function sunCoords(d) {
    const m = solarMeanAnomaly(d);
    const l = eclipticLongitude(m);
    return {
      ra: rightAscension(l, 0),
      dec: declination(l, 0)
    };
  }

  function rightAscension(l, b) {
    return Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l));
  }

  function declination(l, b) {
    return Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l));
  }

  function altAz(date, latitude, longitude, raHours, decDegrees) {
    const lst = siderealDegrees(date, longitude) * rad;
    const ra = raHours * 15 * rad;
    const dec = decDegrees * rad;
    const lat = latitude * rad;
    const hourAngle = lst - ra;

    const altitude = Math.asin(
      Math.sin(lat) * Math.sin(dec) +
      Math.cos(lat) * Math.cos(dec) * Math.cos(hourAngle)
    );

    const azimuth = Math.atan2(
      Math.sin(hourAngle),
      Math.cos(hourAngle) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat)
    );

    return {
      altitude: altitude / rad,
      azimuth: (azimuth / rad + 180 + 360) % 360
    };
  }

  function altAzFromRadians(date, latitude, longitude, ra, dec) {
    const lst = siderealDegrees(date, longitude) * rad;
    const lat = latitude * rad;
    const hourAngle = lst - ra;

    const altitude = Math.asin(
      Math.sin(lat) * Math.sin(dec) +
      Math.cos(lat) * Math.cos(dec) * Math.cos(hourAngle)
    );

    const azimuth = Math.atan2(
      Math.sin(hourAngle),
      Math.cos(hourAngle) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat)
    );

    return {
      altitude: altitude / rad,
      azimuth: (azimuth / rad + 180 + 360) % 360
    };
  }

  function moonCoords(d) {
    const l = rad * (218.316 + 13.176396 * d);
    const m = rad * (134.963 + 13.064993 * d);
    const f = rad * (93.272 + 13.22935 * d);
    const lon = l + rad * 6.289 * Math.sin(m);
    const lat = rad * 5.128 * Math.sin(f);
    const dist = 385001 - 20905 * Math.cos(m);
    return {
      ra: rightAscension(lon, lat),
      dec: declination(lon, lat),
      dist
    };
  }

  function moonPosition(date, latitude, longitude) {
    const moon = moonCoords(toDays(date));
    const coords = altAzFromRadians(date, latitude, longitude, moon.ra, moon.dec);
    return { ...coords, ra: moon.ra, dec: moon.dec, distance: moon.dist };
  }

  function angularSeparation(raA, decA, raB, decB) {
    return Math.acos(
      Math.sin(decA) * Math.sin(decB) +
      Math.cos(decA) * Math.cos(decB) * Math.cos(raA - raB)
    ) / rad;
  }

  function moonIllumination(date) {
    const d = toDays(date);
    const sun = sunCoords(d);
    const moon = moonCoords(d);
    const sdist = 149598000;
    const phi = Math.acos(
      Math.sin(sun.dec) * Math.sin(moon.dec) +
      Math.cos(sun.dec) * Math.cos(moon.dec) * Math.cos(sun.ra - moon.ra)
    );
    const inc = Math.atan2(sdist * Math.sin(phi), moon.dist - sdist * Math.cos(phi));
    const angle = Math.atan2(
      Math.cos(sun.dec) * Math.sin(sun.ra - moon.ra),
      Math.sin(sun.dec) * Math.cos(moon.dec) - Math.cos(sun.dec) * Math.sin(moon.dec) * Math.cos(sun.ra - moon.ra)
    );

    return {
      fraction: (1 + Math.cos(inc)) / 2,
      phase: 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / PI,
      angle
    };
  }

  function sunAltitude(date, latitude, longitude) {
    const sun = sunCoords(toDays(date));
    return altAzFromRadians(date, latitude, longitude, sun.ra, sun.dec).altitude;
  }

  return { altAz, sunAltitude, moonPosition, moonIllumination, angularSeparation };
})();

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function nextNightSessionStart(location, fromDate = new Date()) {
  const isNightEnough = (date) => astro.sunAltitude(date, location.latitude, location.longitude) <= -12;

  if (isNightEnough(fromDate)) {
    return fromDate;
  }

  const end = new Date(fromDate.getTime() + 36 * 3600000);
  const crossings = findThresholdCrossings(
    (date) => astro.sunAltitude(date, location.latitude, location.longitude),
    -12,
    fromDate,
    end
  );
  const nextNightfall = crossings.find((entry) => entry.direction === "setting" && entry.date >= fromDate);

  return nextNightfall?.date || fromDate;
}

function currentLocation() {
  return state.activeLocation;
}

function stateToUrl() {
  const params = new URLSearchParams();
  const location = currentLocation();
  params.set("loc", location.name);
  params.set("lat", location.latitude.toFixed(4));
  params.set("lon", location.longitude.toFixed(4));
  if (location.timezone) {
    params.set("tz", location.timezone);
  }
  params.set("obj", state.selectedName || bestTargetForTonight(location).name);
  if (state.hoursOffset !== 0) {
    params.set("hours", String(state.hoursOffset));
  }
  if (!state.showLabels) {
    params.set("labels", "0");
  }
  if (!state.showConstellations) {
    params.set("constellations", "0");
  }
  if (!state.showAtmosphere) {
    params.set("atmosphere", "0");
  }
  return params.toString();
}

function updateUrlState() {
  const nextUrl = `${window.location.pathname}?${stateToUrl()}${window.location.hash}`;
  window.history.replaceState({}, "", nextUrl);
}

function applyUrlState() {
  const params = new URLSearchParams(window.location.search);
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  const loc = params.get("loc");
  const timezone = params.get("tz");
  const obj = params.get("obj");
  const hours = Number(params.get("hours"));

  if (loc && Number.isFinite(lat) && Number.isFinite(lon)) {
    state.activeLocation = {
      name: loc,
      latitude: lat,
      longitude: lon,
      timezone: timezone || undefined
    };
  }

  if (Number.isFinite(hours) && hours >= -12 && hours <= 12) {
    state.hoursOffset = hours;
  }

  state.showLabels = params.get("labels") !== "0";
  state.showConstellations = params.get("constellations") !== "0";
  state.showAtmosphere = params.get("atmosphere") !== "0";

  if (obj) {
    state.selectedName = objectByName(obj).name;
  }
}

function targetDate() {
  const baseDate = nextNightSessionStart(currentLocation());
  return new Date(baseDate.getTime() + state.hoursOffset * 3600000);
}

async function fetchTimezoneForCoordinates(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m",
    timezone: "auto",
    forecast_days: "1"
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Timezone lookup failed.");
  }

  const payload = await response.json();

  if (!payload.timezone) {
    throw new Error("Timezone lookup failed.");
  }

  return payload.timezone;
}

function coordinatesLabel(latitude, longitude) {
  const ns = latitude >= 0 ? "N" : "S";
  const ew = longitude >= 0 ? "E" : "W";
  return `${Math.abs(latitude).toFixed(3)}°${ns}, ${Math.abs(longitude).toFixed(3)}°${ew}`;
}

async function reverseGeocode(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    language: "en",
    format: "json"
  });
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Reverse geocoding failed.");
  }

  const payload = await response.json();
  const match = payload.results?.[0];
  const gps = coordinatesLabel(latitude, longitude);

  if (!match) {
    const timezone = await fetchTimezoneForCoordinates(latitude, longitude).catch(() => undefined);
    return {
      name: `Your area (${gps})`,
      latitude,
      longitude,
      timezone
    };
  }

  return {
    name: [match.name, match.admin1, match.country].filter(Boolean).join(", "),
    latitude,
    longitude,
    timezone: match.timezone || await fetchTimezoneForCoordinates(latitude, longitude).catch(() => undefined)
  };
}

async function fetchLocationBySearch(query) {
  const params = new URLSearchParams({
    name: query,
    count: "1",
    language: "en",
    format: "json"
  });
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Location search failed.");
  }

  const payload = await response.json();
  const match = payload.results?.[0];

  if (!match) {
    throw new Error("No matching location found.");
  }

  return {
    name: [match.name, match.admin1, match.country].filter(Boolean).join(", "),
    latitude: match.latitude,
    longitude: match.longitude,
    timezone: match.timezone || await fetchTimezoneForCoordinates(match.latitude, match.longitude).catch(() => undefined)
  };
}

function objectByName(name) {
  return objectCatalog.find((item) => item.name.toLowerCase() === name.toLowerCase()) || objectCatalog[0];
}

function projectSky(altitude, azimuth, width, height) {
  const radius = Math.min(width, height) * 0.44;
  const cx = width / 2;
  const cy = height / 2 + height * 0.03;
  const r = radius * (1 - altitude / 90);
  const angle = azimuth * (Math.PI / 180);
  return {
    x: cx + r * Math.sin(angle),
    y: cy + r * Math.cos(angle),
    visible: altitude > 0,
    radius,
    cx,
    cy
  };
}

function pseudoRandom(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function drawSkyGrid(width, height, horizon) {
  const rings = [15, 30, 45, 60, 75];
  rings.forEach((altitude) => {
    const ring = projectSky(altitude, 0, width, height);
    ctx.beginPath();
    ctx.arc(horizon.cx, horizon.cy, Math.abs(ring.y - horizon.cy), 0, Math.PI * 2);
    ctx.strokeStyle = altitude === 30 ? "rgba(255, 209, 142, 0.2)" : "rgba(151, 178, 197, 0.1)";
    ctx.lineWidth = altitude === 30 ? 1.4 : 1;
    ctx.stroke();
  });

  [0, 45, 90, 135, 180, 225, 270, 315].forEach((azimuth) => {
    const edge = projectSky(0, azimuth, width, height);
    ctx.beginPath();
    ctx.moveTo(horizon.cx, horizon.cy);
    ctx.lineTo(edge.x, edge.y);
    ctx.strokeStyle = "rgba(151, 178, 197, 0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

function drawBackgroundStars(location, date, width, height) {
  const count = 160;
  for (let index = 0; index < count; index += 1) {
    const ra = pseudoRandom(index + location.latitude) * 24;
    const dec = pseudoRandom(index + location.longitude + 8) * 180 - 90;
    const mag = 1.6 + pseudoRandom(index + 3.1) * 4.4;
    const twinkle = 0.72 + pseudoRandom(index + date.getHours() + date.getMinutes() / 60) * 0.28;
    const coords = astro.altAz(date, location.latitude, location.longitude, ra, dec);
    const point = projectSky(coords.altitude, coords.azimuth, width, height);

    if (!point.visible) {
      continue;
    }

    const size = clamp(3.8 - mag * 0.45, 0.5, 2.1);
    ctx.beginPath();
    ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.28 + twinkle * 0.45})`;
    ctx.fill();
  }
}

function drawSelectedHighlight(point) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, 14, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 209, 142, 0.95)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(point.x, point.y, 26, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 209, 142, 0.28)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(point.x - 18, point.y);
  ctx.lineTo(point.x + 18, point.y);
  ctx.moveTo(point.x, point.y - 18);
  ctx.lineTo(point.x, point.y + 18);
  ctx.strokeStyle = "rgba(255, 209, 142, 0.42)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function rankObjects(location, date) {
  const moonState = describeMoonImpact(location, date);
  return objectCatalog
    .map((object) => {
      const coords = astro.altAz(date, location.latitude, location.longitude, object.ra, object.dec);
      const base = coords.altitude * 1.1 - Math.max(object.mag || 4, 0) * 3;
      const seasonBoost = seasonalBonusForObject(object, location, date);
      const moonPenalty = moonPenaltyForObject(object, moonState);
      const score = Math.round(clamp(base + 45 + seasonBoost - moonPenalty, 0, 100));
      return { ...object, altitude: coords.altitude, azimuth: coords.azimuth, score, seasonBoost, moonPenalty };
    })
    .filter((object) => object.altitude > 0)
    .sort((a, b) => b.score - a.score);
}

function formatInLocationTime(date, options, location = currentLocation()) {
  if (!location?.timezone) {
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  }

  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: location.timezone }).format(date);
}

function formatClock(date, location = currentLocation()) {
  return formatInLocationTime(date, { hour: "2-digit", minute: "2-digit" }, location);
}

function formatStageTime(date, location = currentLocation()) {
  return formatInLocationTime(
    date,
    {
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZoneName: "short"
    },
    location
  );
}

function localMonthIndex(date, location = currentLocation()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    month: "numeric",
    timeZone: location?.timezone
  }).formatToParts(date);
  const month = Number(parts.find((part) => part.type === "month")?.value || "1");
  return month - 1;
}

function seasonForLocation(date, location) {
  const month = localMonthIndex(date, location);
  const shifted = location.latitude < 0 ? (month + 6) % 12 : month;
  if (shifted >= 2 && shifted <= 4) {
    return "spring";
  }
  if (shifted >= 5 && shifted <= 7) {
    return "summer";
  }
  if (shifted >= 8 && shifted <= 10) {
    return "autumn";
  }
  return "winter";
}

function twilightBandForAltitude(altitude) {
  if (altitude <= -18) {
    return "astronomical";
  }
  if (altitude <= -12) {
    return "nautical";
  }
  if (altitude <= -6) {
    return "civil";
  }
  return "daylight";
}

function twilightBandLabel(band) {
  return {
    daylight: "Civil light",
    civil: "Civil twilight",
    nautical: "Nautical twilight",
    astronomical: "Astronomical dark"
  }[band];
}

function moonPhaseLabel(phase) {
  if (phase < 0.03 || phase > 0.97) {
    return "New Moon";
  }
  if (phase < 0.22) {
    return "Waxing Crescent";
  }
  if (phase < 0.28) {
    return "First Quarter";
  }
  if (phase < 0.47) {
    return "Waxing Gibbous";
  }
  if (phase < 0.53) {
    return "Full Moon";
  }
  if (phase < 0.72) {
    return "Waning Gibbous";
  }
  if (phase < 0.78) {
    return "Last Quarter";
  }
  return "Waning Crescent";
}

function findThresholdCrossings(getValue, threshold, startDate, endDate, stepMinutes = 20) {
  const stepMs = stepMinutes * 60000;
  const crossings = [];
  let previousDate = startDate;
  let previousValue = getValue(previousDate) - threshold;

  for (let time = startDate.getTime() + stepMs; time <= endDate.getTime(); time += stepMs) {
    const nextDate = new Date(time);
    const nextValue = getValue(nextDate) - threshold;

    if (previousValue === 0 || previousValue * nextValue <= 0) {
      let low = previousDate;
      let high = nextDate;
      let lowValue = previousValue;
      let highValue = nextValue;

      for (let index = 0; index < 16; index += 1) {
        const mid = new Date((low.getTime() + high.getTime()) / 2);
        const midValue = getValue(mid) - threshold;
        if (Math.abs(midValue) < 0.0001) {
          low = mid;
          high = mid;
          break;
        }
        if (lowValue * midValue <= 0) {
          high = mid;
          highValue = midValue;
        } else {
          low = mid;
          lowValue = midValue;
        }
      }

      const crossingDate = new Date((low.getTime() + high.getTime()) / 2);
      crossings.push({
        date: crossingDate,
        direction: previousValue < nextValue ? "rising" : "setting"
      });
    }

    previousDate = nextDate;
    previousValue = nextValue;
  }

  return crossings;
}

function findNextCrossing(crossings, direction, afterDate) {
  return crossings.find((entry) => entry.direction === direction && entry.date >= afterDate) || null;
}

function describeMoonImpact(location, date = new Date()) {
  const moon = astro.moonPosition(date, location.latitude, location.longitude);
  const illumination = astro.moonIllumination(date);
  const fraction = Math.round(illumination.fraction * 100);
  const phase = moonPhaseLabel(illumination.phase);

  let summary = "Low moon impact";
  if (moon.altitude > 0 && fraction >= 70) {
    summary = "Bright moonlight";
  } else if (moon.altitude > 0 && fraction >= 35) {
    summary = "Moderate moonlight";
  } else if (moon.altitude > 0) {
    summary = "Moon up, but gentle";
  } else if (fraction >= 70) {
    summary = "Bright phase, below horizon";
  }

  return {
    moon,
    illumination,
    phase,
    fraction,
    summary
  };
}

function buildAstronomySummary(location) {
  const now = nextNightSessionStart(location);
  const end = new Date(now.getTime() + 36 * 3600000);
  const sunAt = (date) => astro.sunAltitude(date, location.latitude, location.longitude);
  const moonAt = (date) => astro.moonPosition(date, location.latitude, location.longitude).altitude;
  const moonState = describeMoonImpact(location, now);
  const sunNow = sunAt(now);
  const moonNow = moonState.moon.altitude;

  const civilCrossings = findThresholdCrossings(sunAt, -6, now, end);
  const nauticalCrossings = findThresholdCrossings(sunAt, -12, now, end);
  const astronomicalCrossings = findThresholdCrossings(sunAt, -18, now, end);
  const moonCrossings = findThresholdCrossings(moonAt, 0, now, end);

  const civilEnd = findNextCrossing(civilCrossings, "setting", now);
  const nauticalEnd = findNextCrossing(nauticalCrossings, "setting", now);
  const astronomicalEnd = findNextCrossing(astronomicalCrossings, "setting", now);
  const astronomicalStart = findNextCrossing(astronomicalCrossings, "rising", astronomicalEnd?.date || now);
  const moonrise = findNextCrossing(moonCrossings, "rising", now);
  const moonset = findNextCrossing(moonCrossings, "setting", now);

  const darknessWindow = astronomicalEnd && astronomicalStart
    ? `${formatClock(astronomicalEnd.date, location)}-${formatClock(astronomicalStart.date, location)}`
    : sunNow <= -18
      ? `Dark now until ${formatClock(astronomicalStart?.date || end, location)}`
      : "No true astronomical dark";

  const moonTiming = moonrise && moonset
    ? `${moonrise.date < moonset.date
      ? `Rises ${formatClock(moonrise.date, location)} · sets ${formatClock(moonset.date, location)}`
      : `Sets ${formatClock(moonset.date, location)} · rises ${formatClock(moonrise.date, location)}`}`
    : moonNow > 0
      ? moonset ? `Up now · sets ${formatClock(moonset.date, location)}` : "Up through the sampled night"
      : moonrise ? `Down now · rises ${formatClock(moonrise.date, location)}` : "Below horizon through the sampled night";

  const twilightLine = astronomicalEnd
    ? `Civil ends ${formatClock(civilEnd?.date || astronomicalEnd.date, location)}, nautical ends ${formatClock(nauticalEnd?.date || astronomicalEnd.date, location)}, astronomical dark begins ${formatClock(astronomicalEnd.date, location)}.`
    : civilEnd || nauticalEnd
      ? `Twilight deepens through ${formatClock(civilEnd?.date || nauticalEnd?.date, location)} but never reaches full astronomical dark in the sampled window.`
      : "The sampled window stays in daylight or twilight without a clean dark-sky handoff.";

  const note = moonState.summary === "Bright moonlight"
    ? `${twilightLine} The moon is bright and above the horizon, so galaxies and faint nebulae will improve after it sets or once your target moves farther from it.`
    : `${twilightLine} ${moonTiming}.`;

  return {
    cards: [
      ["Moon phase", moonState.phase, `${moonState.fraction}% illuminated`],
      ["Moon impact", moonState.summary, moonTiming],
      ["Dark window", darknessWindow, twilightLine],
      ["Twilight now", twilightBandLabel(twilightBandForAltitude(sunNow)), `Sun altitude ${Math.round(sunNow)}°`]
    ],
    note
  };
}

function seasonalPackForLocation(location, date = new Date()) {
  const season = seasonForLocation(date, location);
  return { season, ...seasonalPacks[season] };
}

function moonPenaltyForObject(object, moonState) {
  const sensitivity = moonSensitivityByType[object.type] ?? 8;
  if (moonState.moon.altitude <= 0 || moonState.fraction < 10) {
    return 0;
  }
  const objectRa = object.ra * 15 * Math.PI / 180;
  const objectDec = object.dec * Math.PI / 180;
  const separation = astro.angularSeparation(objectRa, objectDec, moonState.moon.ra, moonState.moon.dec);
  const proximity = clamp(1.25 - separation / 120, 0.3, 1.2);
  return moonState.illumination.fraction * sensitivity * proximity;
}

function seasonalBonusForObject(object, location, date) {
  const pack = seasonalPackForLocation(location, date);
  const index = pack.objects.indexOf(object.name);
  if (index === -1) {
    return 0;
  }
  return Math.max(3, 10 - index);
}

function buildTonightSuggestion(location) {
  const now = nextNightSessionStart(location);
  const astronomy = buildAstronomySummary(location);
  const moonState = describeMoonImpact(location, now);
  const samples = Array.from({ length: 13 }, (_, index) => {
    const sampleDate = new Date(now.getTime() + index * 3600000);
    const sunAltitude = astro.sunAltitude(sampleDate, location.latitude, location.longitude);
    const ranked = rankObjects(location, sampleDate);
    const strongNightTargets = ranked.filter((object) => object.altitude > 30);
    return {
      date: sampleDate,
      sunAltitude,
      ranked,
      best: strongNightTargets[0] || null
    };
  }).filter((entry) => entry.best && entry.sunAltitude <= -12);

  if (!samples.length) {
    return {
      cards: [
        ["Tonight status", "No high dark target soon", "No night-time target climbs above 30° in the next several hours."]
      ],
      note: "Try another location, wait for a later dark window, or choose a target manually if you still want to observe low on the horizon."
    };
  }

  const bestWindow = samples.reduce((winner, sample) => (
    !winner || sample.best.score > winner.best.score ? sample : winner
  ), null);
  const topNow = samples[0]?.best || bestWindow.best;
  const suggestion = bestWindow.best.score >= 82
    ? "Excellent stargazing window"
    : bestWindow.best.score >= 68
      ? "Promising stargazing window"
      : "Casual observing window";

  return {
    bestTargetName: bestWindow.best.name,
    cards: [
      ["Tonight suggestion", suggestion, `${bestWindow.best.name} looks strongest for the selected location.`],
      ["Best view time", formatClock(bestWindow.date, location), `${bestWindow.best.type} peaks near ${Math.round(bestWindow.best.altitude)}° altitude.`],
      ["Best target tonight", topNow.name, `${topNow.type} reaches about ${Math.round(topNow.altitude)}° in the dark-sky window.`],
      ["Moon check", moonState.summary, astronomy.cards[2][1]]
    ],
    note: `${location.name} is most rewarding near ${formatClock(bestWindow.date, location)} when ${bestWindow.best.name} rises into its best placement. ${moonState.phase} moon conditions should be part of your target choice.`
  };
}

function bestTargetForTonight(location) {
  const tonight = buildTonightSuggestion(location);
  return objectByName(tonight.bestTargetName || objectCatalog[0].name);
}

function eligibleNightObjects(location) {
  const now = nextNightSessionStart(location);
  const bestByName = new Map();

  Array.from({ length: 13 }, (_, index) => new Date(now.getTime() + index * 3600000))
    .forEach((sampleDate) => {
      const sunAltitude = astro.sunAltitude(sampleDate, location.latitude, location.longitude);
      if (sunAltitude > -12) {
        return;
      }

      rankObjects(location, sampleDate)
        .filter((object) => object.altitude > 30)
        .forEach((object) => {
          const existing = bestByName.get(object.name);
          if (!existing || object.score > existing.score) {
            bestByName.set(object.name, object);
          }
        });
    });

  return [...bestByName.values()].sort((a, b) => b.score - a.score);
}

function buildSelectedTimeline(location, object) {
  const now = nextNightSessionStart(location);
  const samples = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getTime() + index * 2 * 3600000);
    const coords = astro.altAz(date, location.latitude, location.longitude, object.ra, object.dec);
    const sunAltitude = astro.sunAltitude(date, location.latitude, location.longitude);
    return {
      label: formatClock(date, location),
      altitude: Math.round(coords.altitude),
      visible: coords.altitude > 0,
      sunAltitude,
      twilightBand: twilightBandForAltitude(sunAltitude)
    };
  });

  const visibleSamples = samples.filter((sample) => sample.visible);
  const peak = visibleSamples.reduce(
    (winner, sample) => (!winner || sample.altitude > winner.altitude ? sample : winner),
    null
  );

  return {
    samples,
    note: peak
      ? `${object.name} reaches its strongest placement near ${peak.label} at about ${peak.altitude}° altitude.`
      : `${object.name} stays below the horizon for the next several hours at this location.`
  };
}

function buildSeasonalTargets(location) {
  const pack = seasonalPackForLocation(location, targetDate());
  const now = nextNightSessionStart(location);
  const rankedMap = new Map();

  Array.from({ length: 13 }, (_, index) => new Date(now.getTime() + index * 3600000)).forEach((sampleDate) => {
    if (astro.sunAltitude(sampleDate, location.latitude, location.longitude) > -12) {
      return;
    }
    rankObjects(location, sampleDate)
      .filter((object) => pack.objects.includes(object.name))
      .forEach((object) => {
        const existing = rankedMap.get(object.name);
        if (!existing || object.score > existing.score) {
          rankedMap.set(object.name, {
            ...object,
            bestLabel: formatClock(sampleDate, location)
          });
        }
      });
  });

  const items = pack.objects
    .map((name) => rankedMap.get(name))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return {
    ...pack,
    items
  };
}

function buildNightRoute(location) {
  const baseDate = nextNightSessionStart(location);
  const checkpoints = [
    { label: "Start", offsetHours: 0, detail: "Begin with the strongest object that is already comfortable to frame." },
    { label: "+2h", offsetHours: 2, detail: "Shift once the sky deepens or a seasonal object climbs into a cleaner altitude." },
    { label: "+4h", offsetHours: 4, detail: "Use the late window for the object that is peaking highest after midnight." }
  ];
  const usedNames = new Set();
  const route = checkpoints.map((checkpoint) => {
    const date = new Date(baseDate.getTime() + checkpoint.offsetHours * 3600000);
    const ranked = astro.sunAltitude(date, location.latitude, location.longitude) <= -12
      ? rankObjects(location, date).filter((item) => item.altitude > 25)
      : [];
    const pick = ranked.find((item) => !usedNames.has(item.name)) || ranked[0] || null;
    if (pick) {
      usedNames.add(pick.name);
    }
    return {
      ...checkpoint,
      timeLabel: formatClock(date, location),
      target: pick
    };
  });

  const usable = route.filter((item) => item.target);
  return {
    steps: route,
    note: usable.length
      ? `Start with ${usable[0].target.name}${usable[1] ? `, then hand off to ${usable[1].target.name}` : ""}${usable[2] ? ` and finish on ${usable[2].target.name}` : ""}.`
      : "The next several hours do not offer a comfortable dark-sky route, so this may be a low-value session."
  };
}

function buildWatchouts(location, selected, ranked) {
  const astronomy = buildAstronomySummary(location);
  const moonState = describeMoonImpact(location, targetDate());
  const selectedVisible = ranked.find((item) => item.name === selected.name);
  const alerts = [];

  if (astronomy.cards[2][1] === "No true astronomical dark") {
    alerts.push({
      label: "Darkness",
      title: "No fully dark window tonight",
      detail: "Twilight never reaches full astronomical dark in the sampled window, so faint galaxies and nebulae will underperform."
    });
  }

  if (moonState.summary === "Bright moonlight") {
    alerts.push({
      label: "Moonlight",
      title: "Bright moon above the horizon",
      detail: "Save faint diffuse targets for after moonset or switch to brighter stars, clusters, or compact nebulae first."
    });
  }

  if (!selectedVisible) {
    alerts.push({
      label: "Target",
      title: `${selected.name} is below the horizon right now`,
      detail: "Use the route panel or shortlist to choose a target that is already up while you wait for it to rise."
    });
  } else if (selectedVisible.altitude < 30) {
    alerts.push({
      label: "Altitude",
      title: `${selected.name} is still low`,
      detail: "Low-altitude targets are more vulnerable to haze and city glow. If you can wait, the view should improve as it climbs."
    });
  }

  if (!alerts.length) {
    alerts.push({
      label: "Green light",
      title: "The current session setup looks clean",
      detail: "Darkness, moonlight, and target altitude are all supportive enough to keep moving with the current plan."
    });
  }

  return {
    alerts,
    note: alerts[0].detail
  };
}

function buildPlanSnapshot(location, selected) {
  const tonight = buildTonightSuggestion(location);
  const astronomy = buildAstronomySummary(location);
  const time = formatStageTime(targetDate(), location);
  return {
    createdAt: new Date().toISOString(),
    title: `${selected.name} from ${location.name}`,
    location: location.name,
    object: selected.name,
    summary: `${time} · ${tonight.cards[0]?.[1] || "Night session"} · ${astronomy.cards[2]?.[1] || "No dark window"}`
  };
}

function drawSky() {
  const width = els.canvas.width;
  const height = els.canvas.height;
  const location = currentLocation();
  const date = targetDate();
  const ranked = rankObjects(location, date);
  const selected = objectByName(state.selectedName || bestTargetForTonight(location).name);

  ctx.clearRect(0, 0, width, height);

  if (state.showAtmosphere) {
    const sky = ctx.createRadialGradient(width / 2, height * 0.2, 40, width / 2, height * 0.75, width * 0.6);
    sky.addColorStop(0, "rgba(78, 109, 255, 0.18)");
    sky.addColorStop(0.45, "rgba(16, 34, 56, 0.95)");
    sky.addColorStop(1, "rgba(3, 10, 18, 1)");
    ctx.fillStyle = sky;
  } else {
    ctx.fillStyle = "#030b14";
  }
  ctx.fillRect(0, 0, width, height);

  const horizon = projectSky(0, 0, width, height);
  if (state.showAtmosphere) {
    const glow = ctx.createLinearGradient(0, horizon.cy - horizon.radius * 0.18, 0, horizon.cy + horizon.radius * 0.08);
    glow.addColorStop(0, "rgba(255, 188, 114, 0)");
    glow.addColorStop(0.6, "rgba(255, 188, 114, 0.06)");
    glow.addColorStop(1, "rgba(255, 188, 114, 0.12)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, horizon.cy - horizon.radius * 0.18, width, horizon.radius * 0.32);
  }

  drawSkyGrid(width, height, horizon);
  drawBackgroundStars(location, date, width, height);

  ctx.beginPath();
  ctx.arc(horizon.cx, horizon.cy, horizon.radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(151, 178, 197, 0.28)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(horizon.cx, horizon.cy, horizon.radius * 0.66, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(151, 178, 197, 0.14)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const allStars = [...brightStars, ...objectCatalog];
  const points = new Map();

  allStars.forEach((star) => {
    const coords = astro.altAz(date, location.latitude, location.longitude, star.ra, star.dec);
    const point = projectSky(coords.altitude, coords.azimuth, width, height);
    points.set(star.name, { ...point, altitude: coords.altitude, type: star.type || "Star", mag: star.mag ?? 2.4 });

    if (!point.visible) {
      return;
    }

    const size = star.mag !== undefined
      ? clamp(5 - star.mag, 1.2, 5.4)
      : clamp(2.4 + coords.altitude / 35, 1.4, 4.8);

    ctx.beginPath();
    ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
    ctx.fillStyle = star.type && star.type !== "Star" ? "rgba(122, 240, 212, 0.88)" : "rgba(255,255,255,0.95)";
    ctx.shadowBlur = size * 3;
    ctx.shadowColor = star.type && star.type !== "Star" ? "rgba(122,240,212,0.52)" : "rgba(255,255,255,0.45)";
    ctx.fill();
    ctx.shadowBlur = 0;

    if (state.showLabels) {
      ctx.font = star.type && star.type !== "Star" ? "15px 'IBM Plex Sans'" : "14px 'IBM Plex Sans'";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(2, 9, 21, 0.88)";
      ctx.strokeText(star.name, point.x + 10, point.y - 8);
      ctx.fillStyle = star.type && star.type !== "Star" ? "rgba(187, 255, 240, 0.96)" : "rgba(238, 248, 255, 0.92)";
      ctx.fillText(star.name, point.x + 10, point.y - 8);
    }
  });

  if (state.showConstellations) {
    ctx.strokeStyle = "rgba(122, 240, 212, 0.3)";
    ctx.lineWidth = 1.4;
    constellationLines.forEach(([a, b]) => {
      const first = points.get(a);
      const second = points.get(b);
      if (!first || !second || !first.visible || !second.visible) {
        return;
      }
      ctx.beginPath();
      ctx.moveTo(first.x, first.y);
      ctx.lineTo(second.x, second.y);
      ctx.stroke();
    });
  }

  const selectedPoint = points.get(selected.name);
  if (selectedPoint?.visible) {
    drawSelectedHighlight(selectedPoint);
  }

  const cardinals = [
    ["N", horizon.cx, horizon.cy - horizon.radius - 16],
    ["S", horizon.cx, horizon.cy + horizon.radius + 26],
    ["E", horizon.cx + horizon.radius + 18, horizon.cy + 6],
    ["W", horizon.cx - horizon.radius - 28, horizon.cy + 6]
  ];
  ctx.fillStyle = "rgba(151,178,197,0.88)";
  ctx.font = "20px 'Space Grotesk'";
  cardinals.forEach(([label, x, y]) => ctx.fillText(label, x, y));

  els.stageTitle.textContent = `Sky above ${location.name}`;
  els.stageTime.textContent = formatStageTime(date, location);
  els.stageCoords.textContent = coordinatesLabel(location.latitude, location.longitude);
  els.canvasFooter.textContent = `Showing ${ranked.length} objects above the horizon. Toggle labels, constellations, or atmosphere to simplify the view.`;

  renderTonightSuggestion(location);
  renderAstronomySummary(location);
  renderNightRoute(location);
  renderAlerts(location, selected, ranked);
  renderInfo(selected, selectedPoint, ranked, location);
  renderSeasonalPack(location);
  renderVisibleList(ranked);
  renderRecordPanels(location, selected);
  updateUrlState();
}

function renderTonightSuggestion(location) {
  const tonight = buildTonightSuggestion(location);
  els.tonightGrid.innerHTML = tonight.cards
    .map(
      ([label, value, detail]) => `
        <div class="tonight-card">
          <span>${label}</span>
          <strong>${value}</strong>
          <small>${detail}</small>
        </div>
      `
    )
    .join("");
  els.tonightNote.textContent = tonight.note;
}

function renderAstronomySummary(location) {
  const astronomy = buildAstronomySummary(location);
  els.astronomyGrid.innerHTML = astronomy.cards
    .map(
      ([label, value, detail]) => `
        <div class="astronomy-card">
          <span>${label}</span>
          <strong>${value}</strong>
          <small>${detail}</small>
        </div>
      `
    )
    .join("");
  els.astronomyNote.textContent = astronomy.note;
}

function renderInfo(selected, selectedPoint, ranked, location) {
  const nightRanked = rankObjects(location, targetDate());
  const visible = nightRanked.find((item) => item.name === selected.name);
  const pack = seasonalPackForLocation(location, targetDate());
  els.objectTitle.textContent = selected.name;
  const infoItems = [
    ["Type", selected.type],
    ["Altitude", visible ? `${Math.round(visible.altitude)}°` : "Below horizon"],
    ["Direction", visible ? `${Math.round(visible.azimuth)}° az` : "Not visible now"],
    ["Session score", visible ? `${visible.score}/100` : "Standby"],
    ["Season fit", pack.objects.includes(selected.name) ? `Featured in ${pack.season}` : `Secondary in ${pack.season}`],
    ["Moon impact", visible ? `${Math.round(visible.moonPenalty)} penalty` : "Check after rise"]
  ];
  els.objectInfo.innerHTML = infoItems
    .map(
      ([label, value]) => `
        <div class="info-card">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `
    )
    .join("");

  renderObjectPhoto(selected);
  els.objectNote.textContent = selected.note;
  renderSelectedTimeline(location, selected);
}

function renderObjectPhoto(selected) {
  const photo = objectPhotos[selected.name];

  if (!photo) {
    els.objectPhotoWrap.innerHTML = `
      <div class="object-photo-fallback">
        <div>
          <strong>No photo in the current library</strong>
          <span>This object is shown on the sky map, but a dedicated deep-sky image preview is not attached yet.</span>
        </div>
      </div>
    `;
    return;
  }

  els.objectPhotoWrap.innerHTML = `
    <img class="object-photo" src="${photo.src}" alt="${photo.title}" loading="lazy" />
    <div class="object-photo-credit">
      <strong>${selected.name}</strong>
      <span>Photo source: <a href="${photo.href}" target="_blank" rel="noreferrer">${photo.credit}</a></span>
    </div>
  `;
}

function renderSelectedTimeline(location, object) {
  const timeline = buildSelectedTimeline(location, object);
  const width = 640;
  const height = 220;
  const padding = 26;
  const values = timeline.samples.map((sample) => clamp((sample.altitude + 10) / 100, 0, 1));
  const pointPairs = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
    const y = height - padding - value * (height - padding * 2);
    return { x, y };
  });
  const points = pointPairs.map((point) => `${point.x},${point.y}`).join(" ");
  const bandColors = {
    daylight: "rgba(255, 191, 120, 0.12)",
    civil: "rgba(123, 173, 255, 0.1)",
    nautical: "rgba(77, 111, 214, 0.16)",
    astronomical: "rgba(18, 46, 82, 0.34)"
  };
  const grid = [0.25, 0.5, 0.75]
    .map((value) => {
      const y = height - padding - value * (height - padding * 2);
      const label = Math.round(value * 90 - 10);
      return `
        <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
        <text x="${padding + 6}" y="${y - 8}" fill="rgba(151,178,197,0.72)" font-size="12">${label}°</text>
      `;
    })
    .join("");
  const bandRects = timeline.samples.slice(0, -1).map((sample, index) => {
    const next = pointPairs[index + 1];
    const current = pointPairs[index];
    return `
      <rect x="${current.x}" y="${padding}" width="${Math.max(next.x - current.x, 2)}" height="${height - padding * 2}" fill="${bandColors[sample.twilightBand]}" />
    `;
  }).join("");

  els.targetTimeline.innerHTML = `
    <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(0,0,0,0)" />
    ${bandRects}
    ${grid}
    <polyline fill="none" stroke="rgba(122,240,212,0.28)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
    <polyline fill="none" stroke="#7af0d4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
    ${pointPairs.map((point) => {
      return `<circle cx="${point.x}" cy="${point.y}" r="4.5" fill="#9ff3ff" />`;
    }).join("")}
  `;
  const compactTimeline = (window.innerWidth || 1200) < 720;
  els.timelineAxis.style.gridTemplateColumns = compactTimeline
    ? "repeat(3, minmax(0, 1fr))"
    : `repeat(${timeline.samples.length}, minmax(0, 1fr))`;
  els.timelineAxis.innerHTML = timeline.samples
    .map((sample) => `<span>${sample.label}<br>${sample.visible ? `${sample.altitude}°` : "Below"}<br><small>${twilightBandLabel(sample.twilightBand)}</small></span>`)
    .join("");
  els.timelineNote.innerHTML = `${timeline.note} <span class="twilight-chip">${twilightBandLabel(timeline.samples[Math.floor(timeline.samples.length / 2)].twilightBand)}</span>`;
}

function renderSeasonalPack(location) {
  const pack = buildSeasonalTargets(location);
  els.seasonalList.innerHTML = pack.items.length
    ? pack.items.map((item) => `
        <div class="seasonal-card">
          <span class="season-tag">${pack.season}</span>
          <strong>${item.name}</strong>
          <small>${item.type} · peaks near ${item.bestLabel}</small>
          <div class="meta-line">Score ${item.score}/100 · moon penalty ${Math.round(item.moonPenalty)}</div>
        </div>
      `).join("")
    : `
      <div class="seasonal-card">
        <span class="season-tag">${pack.season}</span>
        <strong>No strong seasonal targets yet</strong>
        <small>Twilight or low altitude is keeping the main seasonal pack from climbing into a strong window.</small>
      </div>
    `;
  els.seasonalNote.textContent = `${pack.title}. ${pack.note}`;
}

function renderNightRoute(location) {
  const route = buildNightRoute(location);
  els.routeList.innerHTML = route.steps
    .map((step) => `
      <div class="route-step">
        <span class="route-badge">${step.label}</span>
        <strong>${step.target ? `${step.target.name} at ${step.timeLabel}` : `Hold at ${step.timeLabel}`}</strong>
        <small>${step.target ? `${step.target.type} · ${Math.round(step.target.altitude)}° high · score ${step.target.score}/100` : "No clean dark-sky target at this checkpoint."}</small>
        <span>${step.detail}</span>
      </div>
    `)
    .join("");
  els.routeNote.textContent = route.note;
}

function renderAlerts(location, selected, ranked) {
  const watchouts = buildWatchouts(location, selected, ranked);
  els.alertsList.innerHTML = watchouts.alerts
    .map((alert) => `
      <div class="alert-row">
        <span class="alert-badge">${alert.label}</span>
        <strong>${alert.title}</strong>
        <small>${alert.detail}</small>
      </div>
    `)
    .join("");
  els.alertsNote.textContent = watchouts.note;
}

function renderVisibleList(ranked) {
  els.visibleList.innerHTML = ranked.slice(0, 6)
    .map(
      (item) => `
        <button type="button" class="visible-row" data-object="${item.name}">
          <div>
            <strong>${item.name}</strong>
            <small>${item.type} · ${Math.round(item.altitude)}° high · season +${item.seasonBoost} · moon -${Math.round(item.moonPenalty)}</small>
          </div>
          <span class="visible-score">${item.score}</span>
        </button>
      `
    )
    .join("");

  els.visibleList.querySelectorAll("[data-object]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedName = button.dataset.object;
      els.objectSelect.value = state.selectedName;
      drawSky();
    });
  });
}

function renderRecordPanels(location, selected) {
  const notes = loadStoredList(storageKeys.notes);
  const plans = loadStoredList(storageKeys.plans);

  els.sessionNote.value = state.noteDraft;
  els.notesList.innerHTML = notes.length
    ? notes.map((entry) => `
        <div class="record-entry">
          <strong>${entry.object} · ${entry.location}</strong>
          <small>${entry.timeLabel}</small>
          <span>${entry.text}</span>
        </div>
      `).join("")
    : `
      <div class="record-entry">
        <strong>No observer notes yet</strong>
        <span>Save a note here once you have something worth remembering from the session.</span>
      </div>
    `;

  els.plansList.innerHTML = plans.length
    ? plans.map((entry) => `
        <div class="record-entry">
          <strong>${entry.title}</strong>
          <small>${entry.timeLabel}</small>
          <span>${entry.summary}</span>
        </div>
      `).join("")
    : `
      <div class="record-entry">
        <strong>No saved plans yet</strong>
        <span>Save the current setup once the route and target choice feel right.</span>
      </div>
    `;

  els.recordStatus.textContent = state.noteDraft.trim()
    ? `Drafting a note for ${selected.name} from ${location.name}.`
    : "No note saved yet for this session.";
}

function populateOptions() {
  const eligible = eligibleNightObjects(state.activeLocation);
  const options = eligible.length ? eligible : [bestTargetForTonight(state.activeLocation)];
  els.objectSelect.innerHTML = options
    .map((object) => `<option value="${object.name}">${object.name} · ${object.type}</option>`)
    .join("");
}

async function applyLocation(location, statusText) {
  if (!location.timezone) {
    location.timezone = await fetchTimezoneForCoordinates(location.latitude, location.longitude).catch(() => undefined);
  }
  state.activeLocation = location;
  populateOptions();
  const chosen = state.selectedName ? objectByName(state.selectedName).name : bestTargetForTonight(location).name;
  const eligibleNames = [...els.objectSelect.options].map((option) => option.value);
  state.selectedName = eligibleNames.includes(chosen) ? chosen : bestTargetForTonight(location).name;
  els.objectSelect.value = state.selectedName;
  els.location.value = location.name;
  els.locationStatus.textContent = statusText || `Using ${location.name}.`;
  drawSky();
}

els.locationSearchButton.addEventListener("click", async () => {
  const query = els.location.value.trim();
  if (query.length < 2) {
    els.locationStatus.textContent = "Enter at least two characters to search for a place.";
    return;
  }

  els.locationStatus.textContent = `Searching for ${query}...`;

  try {
    const location = await fetchLocationBySearch(query);
    await applyLocation(location, `Using ${location.name}.`);
  } catch (error) {
    els.locationStatus.textContent = error.message;
  }
});

els.location.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();
  els.locationSearchButton.click();
});

els.objectSelect.addEventListener("change", () => {
  const match = objectByName(els.objectSelect.value);
  state.selectedName = match.name;
  els.objectSelect.value = match.name;
  drawSky();
});

els.slider.addEventListener("input", () => {
  state.hoursOffset = Number(els.slider.value);
  drawSky();
});

els.resetTime.addEventListener("click", () => {
  state.hoursOffset = 0;
  els.slider.value = "0";
  drawSky();
});

els.sessionNote.addEventListener("input", () => {
  state.noteDraft = els.sessionNote.value;
  renderRecordPanels(currentLocation(), objectByName(state.selectedName || bestTargetForTonight(currentLocation()).name));
});

els.saveNoteButton.addEventListener("click", () => {
  const text = state.noteDraft.trim();
  if (!text) {
    els.recordStatus.textContent = "Write a quick observer note before saving it.";
    return;
  }

  const location = currentLocation();
  const selected = objectByName(state.selectedName || bestTargetForTonight(location).name);
  const notes = loadStoredList(storageKeys.notes);
  notes.unshift({
    location: location.name,
    object: selected.name,
    text,
    timeLabel: formatStageTime(targetDate(), location)
  });
  saveStoredList(storageKeys.notes, notes.slice(0, 8));
  state.noteDraft = "";
  els.recordStatus.textContent = `Saved a note for ${selected.name}.`;
  renderRecordPanels(location, selected);
});

els.clearNoteButton.addEventListener("click", () => {
  state.noteDraft = "";
  els.recordStatus.textContent = "Draft cleared.";
  renderRecordPanels(currentLocation(), objectByName(state.selectedName || bestTargetForTonight(currentLocation()).name));
});

els.savePlanButton.addEventListener("click", () => {
  const location = currentLocation();
  const selected = objectByName(state.selectedName || bestTargetForTonight(location).name);
  const snapshot = buildPlanSnapshot(location, selected);
  const plans = loadStoredList(storageKeys.plans);
  plans.unshift({
    ...snapshot,
    timeLabel: formatStageTime(targetDate(), location)
  });
  saveStoredList(storageKeys.plans, plans.slice(0, 8));
  els.plansNote.textContent = `Saved ${snapshot.title} for quick reuse later.`;
  renderRecordPanels(location, selected);
});

els.deviceLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    els.locationStatus.textContent = "This browser does not support device location.";
    return;
  }

  els.locationStatus.textContent = "Requesting your device location...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      try {
        const location = await reverseGeocode(latitude, longitude);
        await applyLocation(location, `Using ${location.name}.`);
      } catch (error) {
        const fallback = {
          name: `Your area (${coordinatesLabel(latitude, longitude)})`,
          latitude,
          longitude
        };
        await applyLocation(fallback, `Using ${fallback.name}.`);
      }
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        els.locationStatus.textContent = "Location access was denied. Please allow location access in your browser.";
        return;
      }

      els.locationStatus.textContent = "Your device location could not be read right now.";
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    }
  );
});

els.toggles.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.toggle;
    if (key === "labels") {
      state.showLabels = !state.showLabels;
      button.classList.toggle("is-active", state.showLabels);
    } else if (key === "constellations") {
      state.showConstellations = !state.showConstellations;
      button.classList.toggle("is-active", state.showConstellations);
    } else if (key === "atmosphere") {
      state.showAtmosphere = !state.showAtmosphere;
      button.classList.toggle("is-active", state.showAtmosphere);
    }
    drawSky();
  });
});

applyUrlState();
populateOptions();
{
  const optionNames = [...els.objectSelect.options].map((option) => option.value);
  const fallback = bestTargetForTonight(state.activeLocation).name;
  state.selectedName = optionNames.includes(state.selectedName) ? state.selectedName : fallback;
}
els.objectSelect.value = state.selectedName;
els.location.value = state.activeLocation.name;
els.locationStatus.textContent = `Using ${state.activeLocation.name}.`;
els.slider.value = String(state.hoursOffset);
els.toggles.forEach((button) => {
  const key = button.dataset.toggle;
  if (key === "labels") {
    button.classList.toggle("is-active", state.showLabels);
  } else if (key === "constellations") {
    button.classList.toggle("is-active", state.showConstellations);
  } else if (key === "atmosphere") {
    button.classList.toggle("is-active", state.showAtmosphere);
  }
});

(async () => {
  if (!state.activeLocation.timezone) {
    state.activeLocation.timezone = await fetchTimezoneForCoordinates(
      state.activeLocation.latitude,
      state.activeLocation.longitude
    ).catch(() => undefined);
  }
  drawSky();
})();
