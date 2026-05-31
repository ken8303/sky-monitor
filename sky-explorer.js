const presetLocations = {
  dartmoor: { name: "Dartmoor, UK", latitude: 50.57, longitude: -3.92 },
  sedona: { name: "Sedona, Arizona", latitude: 34.8697, longitude: -111.761 },
  lofoten: { name: "Lofoten, Norway", latitude: 68.154, longitude: 13.611 }
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
  locationKey: "dartmoor",
  hoursOffset: 0,
  selectedName: "Andromeda Galaxy",
  showLabels: true,
  showConstellations: true,
  showAtmosphere: true
};

const els = {
  location: document.querySelector("#explorer-location"),
  search: document.querySelector("#object-search"),
  options: document.querySelector("#object-options"),
  slider: document.querySelector("#time-slider"),
  resetTime: document.querySelector("#reset-time"),
  toggles: document.querySelectorAll("[data-toggle]"),
  stageTitle: document.querySelector("#stage-title"),
  stageTime: document.querySelector("#stage-time"),
  stageCoords: document.querySelector("#stage-coords"),
  canvas: document.querySelector("#sky-canvas"),
  canvasFooter: document.querySelector("#canvas-footer"),
  objectTitle: document.querySelector("#object-title"),
  objectInfo: document.querySelector("#object-info"),
  objectNote: document.querySelector("#object-note"),
  visibleList: document.querySelector("#visible-list")
};

const ctx = els.canvas.getContext("2d");

const astro = (() => {
  const PI = Math.PI;
  const rad = PI / 180;
  const dayMs = 86400000;
  const J1970 = 2440588;
  const J2000 = 2451545;

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

  return { altAz };
})();

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function currentLocation() {
  return presetLocations[state.locationKey];
}

function targetDate() {
  return new Date(Date.now() + state.hoursOffset * 3600000);
}

function coordinatesLabel(latitude, longitude) {
  const ns = latitude >= 0 ? "N" : "S";
  const ew = longitude >= 0 ? "E" : "W";
  return `${Math.abs(latitude).toFixed(3)}°${ns}, ${Math.abs(longitude).toFixed(3)}°${ew}`;
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

function rankObjects(location, date) {
  return objectCatalog
    .map((object) => {
      const coords = astro.altAz(date, location.latitude, location.longitude, object.ra, object.dec);
      const base = coords.altitude * 1.1 - Math.max(object.mag || 4, 0) * 3;
      const score = Math.round(clamp(base + 45, 0, 100));
      return { ...object, altitude: coords.altitude, azimuth: coords.azimuth, score };
    })
    .filter((object) => object.altitude > 0)
    .sort((a, b) => b.score - a.score);
}

function drawSky() {
  const width = els.canvas.width;
  const height = els.canvas.height;
  const location = currentLocation();
  const date = targetDate();
  const ranked = rankObjects(location, date);
  const selected = objectByName(state.selectedName);

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

    if (state.showLabels && (star.mag !== undefined ? star.mag < 1.0 : coords.altitude > 25)) {
      ctx.fillStyle = "rgba(238,248,255,0.9)";
      ctx.font = "18px 'IBM Plex Sans'";
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
    ctx.beginPath();
    ctx.arc(selectedPoint.x, selectedPoint.y, 14, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 209, 142, 0.95)";
    ctx.lineWidth = 2;
    ctx.stroke();
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
  els.stageTime.textContent = date.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", weekday: "short", month: "short", day: "numeric" });
  els.stageCoords.textContent = coordinatesLabel(location.latitude, location.longitude);
  els.canvasFooter.textContent = `Showing ${ranked.length} objects above the horizon. Toggle labels, constellations, or atmosphere to simplify the view.`;

  renderInfo(selected, selectedPoint, ranked);
  renderVisibleList(ranked);
}

function renderInfo(selected, selectedPoint, ranked) {
  const visible = ranked.find((item) => item.name === selected.name);
  els.objectTitle.textContent = selected.name;
  const infoItems = [
    ["Type", selected.type],
    ["Altitude", visible ? `${Math.round(visible.altitude)}°` : "Below horizon"],
    ["Direction", visible ? `${Math.round(visible.azimuth)}° az` : "Not visible now"],
    ["Session score", visible ? `${visible.score}/100` : "Standby"]
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

  els.objectNote.textContent = selected.note;
}

function renderVisibleList(ranked) {
  els.visibleList.innerHTML = ranked.slice(0, 6)
    .map(
      (item) => `
        <button type="button" class="visible-row" data-object="${item.name}">
          <div>
            <strong>${item.name}</strong>
            <small>${item.type} · ${Math.round(item.altitude)}° high</small>
          </div>
          <span class="visible-score">${item.score}</span>
        </button>
      `
    )
    .join("");

  els.visibleList.querySelectorAll("[data-object]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedName = button.dataset.object;
      els.search.value = state.selectedName;
      drawSky();
    });
  });
}

function populateOptions() {
  els.options.innerHTML = objectCatalog
    .map((object) => `<option value="${object.name}"></option>`)
    .join("");
}

els.location.addEventListener("change", () => {
  state.locationKey = els.location.value;
  drawSky();
});

els.search.addEventListener("change", () => {
  const match = objectByName(els.search.value.trim());
  state.selectedName = match.name;
  els.search.value = match.name;
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

populateOptions();
els.search.value = state.selectedName;
drawSky();
