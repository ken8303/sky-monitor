const presetLocations = {
  dartmoor: { name: "Dartmoor, UK", latitude: 50.57, longitude: -3.92 },
  sedona: { name: "Sedona, Arizona", latitude: 34.8697, longitude: -111.761 },
  lofoten: { name: "Lofoten, Norway", latitude: 68.154, longitude: 13.611 }
};

const weatherLabels = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Heavy showers",
  82: "Violent showers",
  95: "Thunderstorm"
};

const targetCatalog = [
  { name: "Andromeda Galaxy", ra: 0.712, dec: 41.269, type: "Galaxy", tags: ["galaxy", "north"] },
  { name: "Pleiades", ra: 3.79, dec: 24.117, type: "Open cluster", tags: ["cluster", "north"] },
  { name: "Orion Nebula", ra: 5.588, dec: -5.45, type: "Nebula", tags: ["nebula", "equatorial"] },
  { name: "Carina Nebula", ra: 10.75, dec: -59.68, type: "Nebula", tags: ["nebula", "south"] },
  { name: "Omega Centauri", ra: 13.447, dec: -47.479, type: "Globular cluster", tags: ["cluster", "south"] },
  { name: "Sombrero Galaxy", ra: 12.633, dec: -11.623, type: "Galaxy", tags: ["galaxy", "equatorial"] },
  { name: "Lagoon Nebula", ra: 18.05, dec: -24.383, type: "Nebula", tags: ["nebula", "south"] },
  { name: "Ring Nebula", ra: 18.884, dec: 33.03, type: "Planetary nebula", tags: ["planetary", "north"] },
  { name: "North America Nebula", ra: 20.967, dec: 44.53, type: "Nebula", tags: ["nebula", "north"] },
  { name: "Triangulum Galaxy", ra: 1.564, dec: 30.66, type: "Galaxy", tags: ["galaxy", "north"] }
];

const targetColors = ["#ff8e72", "#b4ff8a", "#7fd2ff"];
const mapOverlayConfig = {
  clouds: { label: "Clouds", overlay: "clouds", product: "ecmwf", zoom: "5" },
  wind: { label: "Wind", overlay: "wind", product: "ecmwf", zoom: "5" },
  rain: { label: "Rain", overlay: "rain", product: "ecmwf", zoom: "5" },
  pressure: { label: "Pressure", overlay: "pressure", product: "ecmwf", zoom: "5" }
};

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

  function fromJulian(julianDate) {
    return new Date((julianDate + 0.5 - J1970) * dayMs);
  }

  function toDays(date) {
    return toJulian(date) - J2000;
  }

  function rightAscension(l, b) {
    return Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l));
  }

  function declination(l, b) {
    return Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l));
  }

  function solarMeanAnomaly(d) {
    return rad * (357.5291 + 0.98560028 * d);
  }

  function eclipticLongitude(m) {
    const c = rad * (1.9148 * Math.sin(m) + 0.02 * Math.sin(2 * m) + 0.0003 * Math.sin(3 * m));
    const p = rad * 102.9372;
    return m + c + p + PI;
  }

  function sunDeclination(d) {
    return declination(eclipticLongitude(solarMeanAnomaly(d)), 0);
  }

  function julianCycle(d, lw) {
    return Math.round(d - 0.0009 - lw / (2 * PI));
  }

  function approxTransit(ht, lw, n) {
    return 0.0009 + (ht + lw) / (2 * PI) + n;
  }

  function solarTransitJ(ds, m, l) {
    return J2000 + ds + 0.0053 * Math.sin(m) - 0.0069 * Math.sin(2 * l);
  }

  function hourAngle(h, phi, dec) {
    return Math.acos((Math.sin(h) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
  }

  function observerAngle(height) {
    return -2.076 * Math.sqrt(height) / 60;
  }

  function getSetJ(h, lw, phi, dec, n, m, l) {
    const w = hourAngle(h, phi, dec);
    const a = approxTransit(w, lw, n);
    return solarTransitJ(a, m, l);
  }

  function getTimes(date, latitude, longitude) {
    const lw = rad * -longitude;
    const phi = rad * latitude;
    const dh = observerAngle(0);
    const d = toDays(date);
    const n = julianCycle(d, lw);
    const ds = approxTransit(0, lw, n);
    const m = solarMeanAnomaly(ds);
    const l = eclipticLongitude(m);
    const dec = declination(l, 0);
    const jNoon = solarTransitJ(ds, m, l);

    const times = {
      solarNoon: fromJulian(jNoon),
      nadir: fromJulian(jNoon - 0.5)
    };

    const values = [
      [-0.833 + dh, "sunrise", "sunset"],
      [-6, "dawn", "dusk"],
      [-12, "nauticalDawn", "nauticalDusk"],
      [-18, "nightEnd", "night"]
    ];

    values.forEach(([angle, riseName, setName]) => {
      const julianSet = getSetJ(angle * rad, lw, phi, dec, n, m, l);
      const julianRise = jNoon - (julianSet - jNoon);
      times[riseName] = fromJulian(julianRise);
      times[setName] = fromJulian(julianSet);
    });

    return times;
  }

  function siderealTime(date, longitude) {
    const d = toDays(date);
    const degrees = 280.16 + 360.9856235 * d + longitude;
    return ((degrees % 360) + 360) % 360;
  }

  function altitude(date, latitude, longitude, raHours, decDegrees) {
    const lst = siderealTime(date, longitude) * rad;
    const ra = raHours * 15 * rad;
    const dec = decDegrees * rad;
    const phi = latitude * rad;
    const hourAngleNow = lst - ra;

    return Math.asin(
      Math.sin(phi) * Math.sin(dec) +
      Math.cos(phi) * Math.cos(dec) * Math.cos(hourAngleNow)
    ) / rad;
  }

  return { getTimes, altitude };
})();

const state = {
  mode: "visual",
  mapOverlay: "clouds",
  activeLocation: presetLocations.dartmoor,
  activeData: null,
  liveSummary: null
};

const els = {
  locationQuery: document.querySelector("#location-query"),
  searchForm: document.querySelector("#search-form"),
  searchStatus: document.querySelector("#search-status"),
  deviceLocationButton: document.querySelector("#device-location-button"),
  sourceNote: document.querySelector("#source-note"),
  statusStrip: document.querySelector("#status-strip"),
  heroEyebrow: document.querySelector("#hero-eyebrow"),
  heroTitle: document.querySelector("#hero-title"),
  heroText: document.querySelector("#hero-text"),
  verdictCard: document.querySelector("#verdict-card"),
  verdictChip: document.querySelector("#verdict-chip"),
  verdictTitle: document.querySelector("#verdict-title"),
  verdictBody: document.querySelector("#verdict-body"),
  heroStats: document.querySelector("#hero-stats"),
  mobilePriority: document.querySelector("#mobile-priority"),
  overviewDetailToggle: document.querySelector("#overview-detail-toggle"),
  qualityBadge: document.querySelector("#quality-badge"),
  qualityNote: document.querySelector("#quality-note"),
  timelineLabels: document.querySelector("#timeline-labels"),
  timelineBars: document.querySelector("#timeline-bars"),
  forecastList: document.querySelector("#forecast-list"),
  transparencyScore: document.querySelector("#transparency-score"),
  transparencyTitle: document.querySelector("#transparency-title"),
  transparencyBody: document.querySelector("#transparency-body"),
  dewScore: document.querySelector("#dew-score"),
  dewTitle: document.querySelector("#dew-title"),
  dewBody: document.querySelector("#dew-body"),
  darkTitle: document.querySelector("#dark-title"),
  darkBody: document.querySelector("#dark-body"),
  targetList: document.querySelector("#target-list"),
  quicklook: document.querySelector("#quicklook"),
  chartBars: document.querySelector("#chart-bars"),
  trendChart: document.querySelector("#trend-chart"),
  trendAxis: document.querySelector("#trend-axis"),
  mapFrame: document.querySelector("#location-map"),
  mapSpotlight: document.querySelector("#map-spotlight"),
  mapMeta: document.querySelector("#map-meta"),
  mapOverlayButtons: document.querySelectorAll("[data-map-overlay]"),
  layerChart: document.querySelector("#layer-chart"),
  layerAxis: document.querySelector("#layer-axis"),
  seeingGrid: document.querySelector("#seeing-grid"),
  seeingNote: document.querySelector("#seeing-note"),
  runbookList: document.querySelector("#runbook-list"),
  alertsList: document.querySelector("#alerts-list"),
  alertsNote: document.querySelector("#alerts-note"),
  spotlightList: document.querySelector("#spotlight-list"),
  targetLegend: document.querySelector("#target-legend"),
  targetChart: document.querySelector("#target-chart"),
  targetAxis: document.querySelector("#target-axis"),
  moonwatchTitle: document.querySelector("#moonwatch-title"),
  moonwatchSubtitle: document.querySelector("#moonwatch-subtitle"),
  moonwatchGrid: document.querySelector("#moonwatch-grid"),
  moonwatchNote: document.querySelector("#moonwatch-note"),
  collapsibleBlocks: document.querySelectorAll("[data-collapsible-block]"),
  blockToggleButtons: document.querySelectorAll("[data-block-toggle]"),
  modeButtons: document.querySelectorAll("[data-mode]"),
  planButton: document.querySelector("#plan-button"),
  locationButton: document.querySelector("#location-button")
};

function toTitle(value) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isMobileLayout() {
  return window.matchMedia("(max-width: 720px)").matches;
}

function setOverviewDetailsExpanded(shouldExpand) {
  const overviewBlock = document.querySelector("#overview");

  if (!overviewBlock || !els.overviewDetailToggle) {
    return;
  }

  overviewBlock.classList.toggle("is-details-expanded", shouldExpand);
  els.overviewDetailToggle.setAttribute("aria-expanded", shouldExpand ? "true" : "false");
  els.overviewDetailToggle.textContent = shouldExpand ? "Hide extra signals" : "Show more signals";
}

function setBlockCollapsed(block, shouldCollapse) {
  if (!block) {
    return;
  }

  block.classList.toggle("is-collapsed", shouldCollapse);
  const toggle = block.querySelector("[data-block-toggle]");

  if (toggle) {
    toggle.setAttribute("aria-expanded", shouldCollapse ? "false" : "true");
    toggle.textContent = shouldCollapse ? "Expand" : "Collapse";
  }
}

function openBlock(block) {
  if (!block) {
    return;
  }

  if (isMobileLayout()) {
    els.collapsibleBlocks.forEach((item) => {
      setBlockCollapsed(item, item !== block);
    });
  } else {
    setBlockCollapsed(block, false);
  }
}

function stateToUrl() {
  const params = new URLSearchParams();
  const location = state.activeLocation;

  if (location?.name) {
    params.set("loc", location.name);
  }
  if (Number.isFinite(location?.latitude)) {
    params.set("lat", location.latitude.toFixed(4));
  }
  if (Number.isFinite(location?.longitude)) {
    params.set("lon", location.longitude.toFixed(4));
  }
  if (state.mode !== "visual") {
    params.set("mode", state.mode);
  }
  if (state.mapOverlay !== "clouds") {
    params.set("map", state.mapOverlay);
  }

  return params.toString();
}

function updateUrlState() {
  const nextUrl = `${window.location.pathname}?${stateToUrl()}${window.location.hash}`;
  window.history.replaceState({}, "", nextUrl);
}

function currentShareUrl() {
  return `${window.location.pathname}?${stateToUrl()}${window.location.hash}`;
}

function applyUrlState() {
  const params = new URLSearchParams(window.location.search);
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  const loc = params.get("loc");
  const mode = params.get("mode");
  const map = params.get("map");

  if (loc && Number.isFinite(lat) && Number.isFinite(lon)) {
    state.activeLocation = {
      name: loc,
      latitude: lat,
      longitude: lon
    };
  }

  if (mode && ["visual", "photo", "travel"].includes(mode)) {
    state.mode = mode;
  }

  if (map && mapOverlayConfig[map]) {
    state.mapOverlay = map;
  }
}

function formatClock(isoString) {
  return isoString.slice(11, 16);
}

function formatLocalClock(date, timezone) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone
  }).format(date);
}

function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.valueOf());
}

function localForecastTimeToDate(timeString, utcOffsetSeconds = 0) {
  return new Date(Date.parse(`${timeString}Z`) - utcOffsetSeconds * 1000);
}

function weatherLabel(code) {
  return weatherLabels[code] || "Changeable";
}

function moonPhaseForDate(dateString) {
  const epoch = Date.UTC(2000, 0, 6, 18, 14);
  const current = Date.parse(`${dateString.slice(0, 10)}T12:00:00Z`);
  const synodicMonth = 29.53058867 * 24 * 60 * 60 * 1000;
  const phase = ((current - epoch) % synodicMonth + synodicMonth) % synodicMonth / synodicMonth;
  const illumination = Math.round(((1 - Math.cos(phase * Math.PI * 2)) / 2) * 100);

  let name = "New moon";
  if (phase > 0.03 && phase < 0.22) {
    name = "Waxing crescent";
  } else if (phase >= 0.22 && phase < 0.28) {
    name = "First quarter";
  } else if (phase >= 0.28 && phase < 0.47) {
    name = "Waxing gibbous";
  } else if (phase >= 0.47 && phase < 0.53) {
    name = "Full moon";
  } else if (phase >= 0.53 && phase < 0.72) {
    name = "Waning gibbous";
  } else if (phase >= 0.72 && phase < 0.78) {
    name = "Last quarter";
  } else if (phase >= 0.78 && phase <= 0.97) {
    name = "Waning crescent";
  }

  return { illumination, name };
}

function isNightAt(timeString, daily) {
  const dayKey = timeString.slice(0, 10);
  const dayIndex = daily.time.findIndex((entry) => entry === dayKey);

  if (dayIndex === -1) {
    return false;
  }

  return timeString < daily.sunrise[dayIndex] || timeString > daily.sunset[dayIndex];
}

function scoreHour(sample) {
  const cloudPenalty = sample.cloud_cover * 0.62;
  const humidityPenalty = sample.relative_humidity_2m * 0.16;
  const windPenalty = sample.wind_speed_10m * 1.35;
  const visibilityBonus = clamp((sample.visibility || 10000) / 1000, 0, 18);
  const precipitationPenalty = sample.weather_code >= 51 ? 14 : 0;
  const nightBonus = sample.isNight ? 12 : -10;

  return Math.round(
    clamp(100 - cloudPenalty - humidityPenalty - windPenalty - precipitationPenalty + visibilityBonus + nightBonus, 8, 98)
  );
}

function qualityBadge(score) {
  if (score >= 82) {
    return "Prime";
  }
  if (score >= 68) {
    return "Excellent";
  }
  if (score >= 54) {
    return "Good";
  }
  if (score >= 40) {
    return "Watch";
  }
  return "Limited";
}

function tonightVerdict(summary) {
  const reasons = [];
  const hasStrongDarkWindow = summary.darkHoursValue >= 2.5;
  const lowMoonImpact = summary.moon.illumination <= 35 || summary.darkHoursValue >= 3;

  if (summary.bestScore >= 78 && hasStrongDarkWindow) {
    reasons.push(`Strong window near ${summary.bestPeak}`);
    reasons.push(`${summary.darkHoursLabel} of dark sky`);
    if (lowMoonImpact) {
      reasons.push("moon impact stays manageable");
    }
    return {
      level: "go",
      chip: "Go",
      title: "Worth setting up tonight",
      body: `${reasons.join(" · ")}.`
    };
  }

  if (summary.bestScore >= 58) {
    reasons.push(`usable peak near ${summary.bestPeak}`);
    reasons.push(summary.darkHoursValue > 0 ? `${summary.darkHoursLabel} of dark sky` : "limited darkness");
    reasons.push(summary.moon.illumination > 55 ? "moonlight will narrow target choice" : "stay selective with targets");
    return {
      level: "watch",
      chip: "Maybe",
      title: "Good if you stay selective",
      body: `${reasons.join(" · ")}.`
    };
  }

  reasons.push("peak conditions stay modest");
  reasons.push(summary.darkHoursValue > 0 ? `${summary.darkHoursLabel} of dark sky` : "no real dark window");
  reasons.push("better for a short check than a full setup");
  return {
    level: "skip",
    chip: "Skip",
    title: "Low-value night for a full setup",
    body: `${reasons.join(" · ")}.`
  };
}

function describeMoonImpact(illumination, darkHours) {
  if (illumination <= 20 && darkHours >= 3) {
    return "Low moon impact tonight";
  }
  if (illumination <= 55 && darkHours >= 2) {
    return "Moderate moon impact tonight";
  }
  return "Moonlight will shape target choice";
}

function seeingLabel(score) {
  if (score >= 78) {
    return "Steady";
  }
  if (score >= 60) {
    return "Usable";
  }
  if (score >= 42) {
    return "Soft";
  }
  return "Restless";
}

function runPhaseForHour(item, bestScore) {
  if (item.score >= Math.max(72, bestScore - 4)) {
    return ["Prime window", "Best time for faint targets or your main imaging run."];
  }
  if (item.isNight && item.score >= 56) {
    return ["Workable window", "Good for bright targets, framing, and flexible observing."];
  }
  if (!item.isNight) {
    return ["Setup window", "Use this stretch for alignment, framing, and gear checks."];
  }
  return ["Fallback window", "Conditions are softer, so switch to bright targets or pause."];
}

function buildRunbook(summary) {
  return summary.runbookSource.map((item) => {
    const [phase, detail] = runPhaseForHour(item, summary.bestScore);
    const modeHint = state.mode === "photo"
      ? (item.score >= 70 ? "Start the longer capture block here." : "Keep exposures shorter and watch the histogram.")
      : state.mode === "travel"
        ? (item.score >= 60 ? "Worth staying on site for this stretch." : "Good moment to reset, warm up, or relocate.")
        : (item.score >= 70 ? "Lean into galaxies, nebulae, or tighter planetary work." : "Favor clusters, planets, or casual sweeping.");
    return [item.label, phase, detail, modeHint];
  });
}

function buildSpotlight(summary) {
  const modeWeights = {
    visual: { galaxy: 1.05, nebula: 1.05, cluster: 1.12, planetary: 1.08 },
    photo: { galaxy: 1.15, nebula: 1.18, cluster: 0.96, planetary: 1.02 },
    travel: { galaxy: 0.95, nebula: 1.02, cluster: 1.12, planetary: 1.0 }
  };
  const weights = modeWeights[state.mode];

  return summary.targetSpotlightSource
    .map((target) => {
      const family = target.tags.find((tag) => weights[tag]) || "cluster";
      const weighted = target.score * weights[family];
      const recommendation = state.mode === "photo"
        ? (weighted >= 78 ? "Strong framing and capture candidate." : "Better for shorter blocks or test frames.")
        : state.mode === "travel"
          ? (weighted >= 72 ? "Worth staying set up for this target." : "Good backup if the main lane softens.")
          : (weighted >= 74 ? "Rewarding visual target in this sky." : "Good secondary target when transparency shifts.");
      return {
        ...target,
        weighted,
        recommendation
      };
    })
    .sort((a, b) => b.weighted - a.weighted)
    .slice(0, 3);
}

function buildTargetTracks(location, times, utcOffsetSeconds) {
  const tracks = targetCatalog
    .map((target) => {
      const points = times.map((time) => {
        const sampleDate = localForecastTimeToDate(time, utcOffsetSeconds);
        return clamp((astro.altitude(sampleDate, location.latitude, location.longitude, target.ra, target.dec) + 10) / 90, 0, 1);
      });
      const peak = Math.max(...points);
      const visibleHours = points.filter((value) => value > 0.15).length;
      return { ...target, points, peak, visibleHours };
    })
    .filter((target) => target.visibleHours > 0)
    .sort((a, b) => (b.peak * 100 + b.visibleHours * 5) - (a.peak * 100 + a.visibleHours * 5));

  return tracks.slice(0, 3);
}

function buildTargets(summary) {
  const moonText = `${summary.moon.name.toLowerCase()} at ${summary.moon.illumination}% illumination`;
  const darkWindowText = summary.darkStart && summary.darkEnd
    ? `with full darkness from ${summary.darkStart} to ${summary.darkEnd}`
    : "without a fully dark astronomical window tonight";

  const map = {
    visual: summary.bestScore >= 70
      ? [
          ["Galaxies & nebulae", `Best during the ${summary.bestStart} to ${summary.bestPeak} window`],
          ["Saturn or Jupiter", `Stable conditions make bright planets rewarding tonight`],
          ["Open clusters", `Great fallback if transparency shifts later in the session`]
        ]
      : [
          ["Bright clusters", `Safer pick while conditions stay ${qualityBadge(summary.bestScore).toLowerCase()}`],
          ["Planets", `Use brighter targets when cloud and humidity stay variable`],
          ["Moon-aware observing", `${moonText}, ${darkWindowText}`]
        ],
    photo: summary.bestScore >= 70
      ? [
          ["Wide-field Milky Way", `Plan imaging around ${summary.bestPeak} when the score peaks`],
          ["Deep-sky imaging", `Cloud cover and wind are most favorable near the best window`],
          ["Planetary capture", `Current weather reads as ${summary.weatherSummary.toLowerCase()}`]
        ]
      : [
          ["Short exposures", `Use shorter runs while conditions remain more tactical`],
          ["Foreground night scenes", `Leaner setup suits a mixed forecast`],
          ["Bright-object capture", moonText]
        ],
    travel: [
      ["Pack for wind and moisture", `${summary.windText} wind and ${summary.humidityText} humidity right now`],
      ["Aim for the best window", `Most promising stretch starts around ${summary.bestStart}`],
      ["Check the sky before setup", `${summary.weatherSummary} is the live current condition`]
    ]
  };

  return map[state.mode];
}

function makeStat(stat) {
  return `
    <div class="stat">
      <span>${stat.label}</span>
      <strong>${stat.value}</strong>
      <small>${stat.note}</small>
    </div>
  `;
}

function deriveSummary(location, forecast) {
  const current = forecast.current;
  const hourly = forecast.hourly;
  const daily = forecast.daily;
  const todayMoon = moonPhaseForDate(hourly.time[0]);
  const astroTimes = astro.getTimes(new Date(`${daily.time[0]}T12:00:00Z`), location.latitude, location.longitude);
  const nextEight = hourly.time.slice(0, 8).map((time, index) => ({
    time,
    cloud_cover: hourly.cloud_cover[index],
    relative_humidity_2m: hourly.relative_humidity_2m[index],
    wind_speed_10m: hourly.wind_speed_10m[index],
    visibility: hourly.visibility[index],
    weather_code: hourly.weather_code[index],
    isNight: isNightAt(time, daily)
  }));
  const scored = nextEight.map((item) => ({ ...item, score: scoreHour(item) }));
  const timeline = scored.filter((_, index) => index < 5);
  const nightCandidates = scored.filter((item) => item.isNight);
  const best = nightCandidates.reduce(
    (winner, item) => (item.score > winner.score ? item : winner),
    nightCandidates[0] || scored[0]
  );

  const dewGap = Math.max(0, current.temperature_2m - hourly.dew_point_2m[0]);
  const dewScore = Math.round(clamp(dewGap * 11, 10, 96));
  const transparencyScore = Math.round(
    clamp(100 - current.cloud_cover * 0.7 + Math.min((hourly.visibility[0] || 10000) / 1000, 18), 18, 98)
  );
  const avgCloud = daily.cloud_cover_mean || [];
  const bestStart = formatClock(best.time);
  const bestPeak = formatClock(best.time);
  const bestScore = best.score;
  const currentLabel = weatherLabel(current.weather_code);
  const hasAstronomicalNight = isValidDate(astroTimes.night) && isValidDate(astroTimes.nightEnd);
  const darkStart = hasAstronomicalNight ? formatLocalClock(astroTimes.night, forecast.timezone) : null;
  const darkEnd = hasAstronomicalNight ? formatLocalClock(astroTimes.nightEnd, forecast.timezone) : null;
  const nauticalDusk = formatLocalClock(astroTimes.nauticalDusk, forecast.timezone);
  const nauticalDawn = formatLocalClock(astroTimes.nauticalDawn, forecast.timezone);
  const astroNightHours = hasAstronomicalNight ? Math.max(0, (astroTimes.nightEnd - astroTimes.night) / 3600000) : 0;
  const moonPenalty = Math.round(todayMoon.illumination * 0.18);
  const darknessScore = Math.round(clamp(bestScore - moonPenalty + astroNightHours * 3.5 + (!hasAstronomicalNight ? 8 : 0), 8, 96));
  const darknessTitle = hasAstronomicalNight
    ? `Astronomical darkness from ${darkStart} to ${darkEnd}`
    : "No full astronomical night tonight";
  const darknessBody = hasAstronomicalNight
    ? `${todayMoon.name} at ${todayMoon.illumination}% illumination, with nautical twilight from ${nauticalDusk} to ${nauticalDawn}.`
    : `${todayMoon.name} at ${todayMoon.illumination}% illumination, with nautical twilight from ${nauticalDusk} to ${nauticalDawn}. The sky stays in late twilight rather than becoming fully dark.`;
  const darkHoursLabel = hasAstronomicalNight ? `${astroNightHours.toFixed(1)}h` : "0.0h";
  const overview = hasAstronomicalNight
    ? `${qualityBadge(bestScore)} conditions. ${darkHoursLabel} of dark sky after ${darkStart}.`
    : `${qualityBadge(bestScore)} conditions. No full dark window tonight.`;
  const visibilityNow = Math.round((hourly.visibility[0] || 0) / 1000);
  const pressureNow = current.pressure_msl ? `${Math.round(current.pressure_msl)} hPa` : "Model";
  const statusItems = [
    { label: "Visibility", value: `${visibilityNow} km`, note: "Current model estimate" },
    { label: "Wind", value: `${Math.round(current.wind_speed_10m)} km/h`, note: "Surface flow" },
    { label: "Pressure", value: pressureNow, note: "Air mass signal" },
    { label: "Darkness", value: darkHoursLabel, note: hasAstronomicalNight ? "Astronomical night" : "Late twilight only" }
  ];
  const trendSeries = {
    labels: nextEight.map((item) => formatClock(item.time)),
    cloud: nextEight.map((item) => clamp(item.cloud_cover / 100, 0, 1)),
    humidity: nextEight.map((item) => clamp(item.relative_humidity_2m / 100, 0, 1)),
    wind: nextEight.map((item) => clamp(item.wind_speed_10m / 30, 0, 1)),
    visibility: nextEight.map((item) => clamp((item.visibility || 0) / 30000, 0, 1))
  };
  const layerBreakdown = nextEight.map((item, index) => ({
    label: formatClock(item.time),
    low: hourly.cloud_cover_low?.[index] ?? 0,
    mid: hourly.cloud_cover_mid?.[index] ?? 0,
    high: hourly.cloud_cover_high?.[index] ?? 0,
    total: item.cloud_cover
  }));
  const seeingScore = Math.round(
    clamp(
      100 -
      current.wind_speed_10m * 1.5 -
      current.cloud_cover * 0.35 -
      current.relative_humidity_2m * 0.12,
      12,
      95
    )
  );
  const setupStress = Math.round(
    clamp(current.wind_speed_10m * 2 + Math.max(0, 12 - dewGap) * 2.6, 10, 94)
  );
  const atmosphereCards = [
    ["Seeing", `${seeingScore}/100`, `${seeingLabel(seeingScore)} air for magnified targets`],
    ["Setup stress", `${setupStress}/100`, `${Math.round(current.wind_speed_10m)} km/h wind and ${dewGap.toFixed(1)}°C dew gap`],
    ["Upper haze", `${hourly.cloud_cover_high?.[0] ?? 0}%`, "High cloud tends to flatten contrast first"]
  ];
  const atmosphereNote = seeingScore >= 68
    ? "The atmosphere looks stable enough for planets and tighter framing if the cloud timing cooperates."
    : "The sky may still be worth using, but softer seeing and layer shifts make this a night to stay flexible.";
  const runbookSource = scored.map((item) => ({
    label: formatClock(item.time),
    score: item.score,
    isNight: item.isNight
  }));
  const alerts = [
    current.wind_speed_10m >= 18
      ? ["Wind load", "Medium risk", `Wind is already ${Math.round(current.wind_speed_10m)} km/h, so mount shake may limit longer focal lengths.`]
      : ["Wind load", "Low risk", `Wind is ${Math.round(current.wind_speed_10m)} km/h, so mechanical stability looks manageable right now.`],
    dewGap <= 4
      ? ["Moisture", "High risk", `The dew gap is only ${dewGap.toFixed(1)}°C, so heaters or wipes may matter sooner than expected.`]
      : ["Moisture", "Moderate risk", `The dew gap is ${dewGap.toFixed(1)}°C, which buys some time before condensation pressure rises.`],
    bestScore < 58
      ? ["Cloud timing", "Watch closely", "The best upcoming score stays fairly modest, so treat the night as opportunistic rather than fixed."]
      : ["Cloud timing", "Promising", `There is a stronger lane near ${bestPeak}, so shape the session around that window.`]
  ];
  const alertsNote = bestScore >= 70
    ? "The night has a real high-value stretch, but the watchouts still matter if you are setting up heavier gear."
    : "This is the kind of night where fast decisions help more than a rigid plan, so keep the setup adaptable.";
  const mapSpotlight = [
    ["Current sky", currentLabel, `${current.cloud_cover}% cloud cover now`],
    ["Peak hour", bestPeak, `${qualityBadge(bestScore)} viewing window`],
    ["Surface flow", `${Math.round(current.wind_speed_10m)} km/h`, `${visibilityNow} km visibility`]
  ];
  const targetTracks = buildTargetTracks(location, nextEight.map((item) => item.time), forecast.utc_offset_seconds || 0);
  const targetSpotlightSource = targetTracks.map((target) => {
    const peakIndex = target.points.findIndex((point) => point === target.peak);
    const peakAltitude = Math.round(target.peak * 90 - 10);
    const peakTime = peakIndex >= 0 ? formatClock(nextEight[peakIndex].time) : bestPeak;
    const score = Math.round(
      clamp(
        bestScore * 0.55 +
        peakAltitude * 0.45 +
        target.visibleHours * 4 -
        todayMoon.illumination * 0.08,
        18,
        96
      )
    );

    return {
      name: target.name,
      type: target.type,
      tags: target.tags,
      peakAltitude,
      peakTime,
      visibleHours: target.visibleHours,
      score
    };
  });
  const moonWindow = bestScore >= 72 ? "Best faint-object window" : "Better for brighter targets";
  const moonwatch = {
    title: `${todayMoon.name} · ${todayMoon.illumination}% lit`,
    subtitle: describeMoonImpact(todayMoon.illumination, astroNightHours),
    items: [
      ["Darkness score", `${darknessScore}/100`, hasAstronomicalNight ? `${darkHoursLabel} of astronomical night` : "No fully dark astronomical window"],
      ["Best use", moonWindow, `Peak weather score near ${bestPeak}`],
      ["Twilight span", `${nauticalDusk} - ${nauticalDawn}`, hasAstronomicalNight ? "Nautical dusk to dawn" : "Late twilight all night"]
    ],
    note: hasAstronomicalNight
      ? `Faint targets should improve once darkness settles in at ${darkStart}.`
      : "Lean toward brighter targets or wide-field scenes because full darkness never arrives tonight."
  };

  return {
    heroTitle: `Best viewing near ${bestPeak}.`,
    heroText: overview,
    stats: [
      { label: "Viewing Score", value: `${bestScore}/100`, note: `${bestStart} to ${bestPeak}` },
      { label: "Dark Sky", value: darkHoursLabel, note: hasAstronomicalNight ? `Moon ${todayMoon.illumination}%` : "Late twilight" }
    ],
    badge: qualityBadge(bestScore),
    note: `${currentLabel} right now, with the strongest near-term score at ${bestPeak}. Wind is ${Math.round(current.wind_speed_10m)} km/h and humidity is ${current.relative_humidity_2m}%.`,
    timeline: timeline.map((item) => ({
      time: formatClock(item.time),
      label: qualityBadge(item.score),
      level: item.score >= 82 ? "q5" : item.score >= 68 ? "q4" : item.score >= 52 ? "q3" : "q2"
    })),
    forecast: daily.time.slice(0, 5).map((day, index) => {
      const label = new Date(`${day}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short" });
      const score = String(Math.round(clamp(100 - avgCloud[index] * 0.72 - (daily.precipitation_probability_max[index] || 0) * 0.25, 18, 96))) + "%";
      return [label, score, weatherLabel(daily.weather_code[index])];
    }),
    transparency: {
      score: transparencyScore,
      title: transparencyScore >= 70 ? "Promising clarity" : "Mixed transparency",
      body: `Cloud cover is ${current.cloud_cover}% with visibility near ${Math.round((hourly.visibility[0] || 0) / 1000)} km in the latest hourly forecast.`
    },
    dew: {
      score: dewScore,
      title: dewScore >= 70 ? "Low dew risk" : "Dew may build later",
      body: `The current temperature-dew point spread is about ${dewGap.toFixed(1)}°C, which is a simple proxy for condensation risk.`
    },
    darkness: {
      title: darknessTitle,
      body: darknessBody
    },
    quicklook: [
      ["Timezone", forecast.timezone, "Location-local forecast"],
      ["Wind", `${Math.round(current.wind_speed_10m)} km/h`, "Live current wind"],
      ["Dark Hours", darkHoursLabel, `Score ${darknessScore}/100`]
    ],
    chart: scored.map((item) => item.score),
    statusItems,
    trendSeries,
    layerBreakdown,
    atmosphereCards,
    atmosphereNote,
    runbookSource,
    alerts,
    alertsNote,
    targetSpotlightSource,
    mapSpotlight,
    targetTracks,
    targetLabels: nextEight.map((item) => formatClock(item.time)),
    moonwatch,
    moon: todayMoon,
    verdict: tonightVerdict({
      bestPeak,
      bestScore,
      darkHoursLabel,
      darkHoursValue: astroNightHours,
      moon: todayMoon
    }),
    bestStart,
    bestPeak,
    bestScore,
    darkStart,
    darkEnd,
    weatherSummary: currentLabel,
    windText: `${Math.round(current.wind_speed_10m)} km/h`,
    humidityText: `${current.relative_humidity_2m}%`
  };
}

function renderTargets() {
  const targets = buildTargets(state.liveSummary);
  const spotlight = buildSpotlight(state.liveSummary);

  els.targetList.innerHTML = targets
    .map(
      ([title, detail]) => `
        <li>
          <strong>${title}</strong>
          <span>${detail}</span>
        </li>
      `
    )
    .join("");

  els.modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === state.mode);
  });

  renderRunbook(buildRunbook(state.liveSummary), state.liveSummary.alerts, state.liveSummary.alertsNote);
  renderSpotlight(spotlight);

  if (els.mobilePriority) {
    const lead = spotlight[0];
    els.mobilePriority.innerHTML = lead
      ? `
        <strong>${lead.name}</strong>
        <span>${lead.type} peaks near ${lead.peakTime} at about ${lead.peakAltitude}°.</span>
        <small>${lead.recommendation}</small>
      `
      : `
        <strong>No standout target yet</strong>
        <small>Wait for the dark window to settle or switch location for a stronger recommendation.</small>
      `;
  }
}

function renderSummary(location, forecast) {
  const summary = deriveSummary(location, forecast);
  state.activeData = forecast;
  state.liveSummary = summary;

  els.heroEyebrow.textContent = `Live at ${location.name}`;
  els.heroTitle.textContent = summary.heroTitle;
  els.heroText.textContent = summary.heroText;
  els.verdictCard.classList.remove("is-watch", "is-skip");
  if (summary.verdict.level === "watch") {
    els.verdictCard.classList.add("is-watch");
  } else if (summary.verdict.level === "skip") {
    els.verdictCard.classList.add("is-skip");
  }
  els.verdictChip.textContent = summary.verdict.chip;
  els.verdictTitle.textContent = summary.verdict.title;
  els.verdictBody.textContent = summary.verdict.body;
  els.heroStats.innerHTML = summary.stats.map(makeStat).join("");
  renderStatusStrip(summary.statusItems);
  els.qualityBadge.textContent = summary.badge;
  els.qualityNote.textContent = summary.note;
  els.sourceNote.textContent = `Timezone: ${forecast.timezone}. Forecast by Open-Meteo.`;

  els.timelineLabels.innerHTML = summary.timeline.map((item) => `<span>${item.time}</span>`).join("");
  els.timelineBars.innerHTML = summary.timeline
    .map((item) => `<span class="${item.level}">${item.label}</span>`)
    .join("");

  els.forecastList.innerHTML = summary.forecast
    .map(
      ([day, score, note]) =>
        `<li><span>${day}</span><strong>${score}</strong><small>${note}</small></li>`
    )
    .join("");

  els.transparencyScore.textContent = summary.transparency.score;
  els.transparencyScore.parentElement.style.setProperty("--value", summary.transparency.score);
  els.transparencyTitle.textContent = summary.transparency.title;
  els.transparencyBody.textContent = summary.transparency.body;

  els.dewScore.textContent = summary.dew.score;
  els.dewScore.parentElement.style.setProperty("--value", summary.dew.score);
  els.dewTitle.textContent = summary.dew.title;
  els.dewBody.textContent = summary.dew.body;

  els.darkTitle.textContent = summary.darkness.title;
  els.darkBody.textContent = summary.darkness.body;

  els.quicklook.innerHTML = summary.quicklook
    .map(
      ([label, value, note]) => `
        <div class="quick-item">
          <span>${label}</span>
          <strong>${value}</strong>
          <small>${note}</small>
        </div>
      `
    )
    .join("");

  els.chartBars.innerHTML = summary.chart
    .map(
      (value, index) => `
        <div class="chart-col">
          <span class="chart-value" style="height:${value}%"></span>
          <small>+${index}h</small>
        </div>
      `
    )
    .join("");

  renderTrendChart(summary.trendSeries);
  renderMap(location, summary);
  renderLayerBreakdown(summary.layerBreakdown);
  renderAtmosphere(summary.atmosphereCards, summary.atmosphereNote);
  renderTargetChart(summary.targetTracks, summary.targetLabels);
  renderMoonwatch(summary.moonwatch);
  renderTargets();
  updateUrlState();
}

async function fetchForecast(location) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "cloud_cover",
      "wind_speed_10m",
      "pressure_msl",
      "weather_code"
    ].join(","),
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "dew_point_2m",
      "cloud_cover",
      "cloud_cover_low",
      "cloud_cover_mid",
      "cloud_cover_high",
      "wind_speed_10m",
      "visibility",
      "weather_code"
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "daylight_duration",
      "cloud_cover_mean",
      "precipitation_probability_max"
    ].join(","),
    timezone: "auto",
    forecast_days: "7"
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Forecast request failed.");
  }

  return response.json();
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
    longitude: match.longitude
  };
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

  if (!match) {
    return {
      name: `Your location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
      latitude,
      longitude
    };
  }

  return {
    name: [match.name, match.admin1, match.country].filter(Boolean).join(", "),
    latitude,
    longitude
  };
}

function coordinatesLabel(latitude, longitude) {
  const ns = latitude >= 0 ? "N" : "S";
  const ew = longitude >= 0 ? "E" : "W";
  return `${Math.abs(latitude).toFixed(3)}°${ns}, ${Math.abs(longitude).toFixed(3)}°${ew}`;
}

function mapEmbedUrl(latitude, longitude) {
  const selected = mapOverlayConfig[state.mapOverlay] || mapOverlayConfig.clouds;
  const params = new URLSearchParams({
    type: "map",
    location: "coordinates",
    metricRain: "default",
    metricTemp: "default",
    metricWind: "default",
    zoom: selected.zoom,
    overlay: selected.overlay,
    product: selected.product,
    level: "surface",
    lat: latitude.toFixed(3),
    lon: longitude.toFixed(3)
  });
  return `https://embed.windy.com/embed.html?${params.toString()}`;
}

function toPolyline(points, width, height, padding) {
  return points
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(points.length - 1, 1);
      const y = height - padding - value * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

function renderTrendChart(series) {
  const width = 640;
  const height = 260;
  const padding = 24;
  const grid = [0.2, 0.4, 0.6, 0.8]
    .map((value) => {
      const y = height - padding - value * (height - padding * 2);
      return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />`;
    })
    .join("");

  els.trendChart.innerHTML = `
    <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(0,0,0,0)" />
    ${grid}
    <polyline fill="none" stroke="#86b8ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${toPolyline(series.cloud, width, height, padding)}" />
    <polyline fill="none" stroke="#7af0d4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${toPolyline(series.humidity, width, height, padding)}" />
    <polyline fill="none" stroke="#ffc77a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${toPolyline(series.wind, width, height, padding)}" />
    <polyline fill="none" stroke="#ef8fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${toPolyline(series.visibility, width, height, padding)}" />
  `;

  els.trendAxis.innerHTML = series.labels.map((label) => `<span>${label}</span>`).join("");
}

function renderStatusStrip(items) {
  els.statusStrip.innerHTML = items
    .map(
      (item) => `
        <article class="status-card">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
          <small>${item.note}</small>
        </article>
      `
    )
    .join("");
}

function renderMap(location, summary) {
  const selected = mapOverlayConfig[state.mapOverlay] || mapOverlayConfig.clouds;
  els.mapFrame.src = mapEmbedUrl(location.latitude, location.longitude);
  els.mapOverlayButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mapOverlay === state.mapOverlay);
  });
  els.mapSpotlight.innerHTML = summary.mapSpotlight
    .map(
      ([label, value, note]) => `
        <div class="map-spotlight-card">
          <span>${label}</span>
          <strong>${value}</strong>
          <small>${note}</small>
        </div>
      `
    )
    .join("");
  els.mapMeta.innerHTML = `
    <div>
      <span>Area</span>
      <strong>${location.name}</strong>
      <small>${coordinatesLabel(location.latitude, location.longitude)}</small>
    </div>
    <div>
      <span>Windy layer</span>
      <strong>${selected.label} · ${selected.product.toUpperCase()} · Zoom ${selected.zoom}</strong>
      <small>${summary.weatherSummary}</small>
    </div>
  `;
}

function renderLayerBreakdown(layers) {
  els.layerChart.innerHTML = layers
    .map((entry) => {
      const stackTotal = Math.max(entry.low + entry.mid + entry.high, 1);
      const lowHeight = (entry.low / stackTotal) * 100;
      const midHeight = (entry.mid / stackTotal) * 100;
      const highHeight = (entry.high / stackTotal) * 100;
      return `
        <div class="layer-col">
          <div class="layer-total">${entry.total}%</div>
          <div class="layer-stack">
            <div class="layer-segment high" style="height:${highHeight}%"></div>
            <div class="layer-segment mid" style="height:${midHeight}%"></div>
            <div class="layer-segment low" style="height:${lowHeight}%"></div>
          </div>
        </div>
      `
    })
    .join("");

  els.layerAxis.innerHTML = layers.map((entry) => `<span>${entry.label}</span>`).join("");
}

function renderAtmosphere(cards, note) {
  els.seeingGrid.innerHTML = cards
    .map(
      ([label, value, detail]) => `
        <div class="seeing-card">
          <div>
            <span>${label}</span>
            <small>${detail}</small>
          </div>
          <strong>${value}</strong>
        </div>
      `
    )
    .join("");
  els.seeingNote.textContent = note;
}

function renderRunbook(runbook, alerts, alertsNote) {
  els.runbookList.innerHTML = runbook
    .map(
      ([time, phase, detail, hint]) => `
        <div class="runbook-item">
          <div class="runbook-time">${time}</div>
          <div class="runbook-copy">
            <strong>${phase}</strong>
            <span>${detail}</span>
            <small>${hint}</small>
          </div>
        </div>
      `
    )
    .join("");

  els.alertsList.innerHTML = alerts
    .map(
      ([title, level, detail]) => `
        <div class="alert-item">
          <span class="alert-chip">${level}</span>
          <strong>${title}</strong>
          <small>${detail}</small>
        </div>
      `
    )
    .join("");

  els.alertsNote.textContent = alertsNote;
}

function renderSpotlight(spotlight) {
  if (!spotlight.length) {
    els.spotlightList.innerHTML = `
      <div class="spotlight-card">
        <strong>No standout target yet</strong>
        <small>Try another location, wait for darkness, or use the runbook to catch a better lane later.</small>
      </div>
    `;
    return;
  }

  els.spotlightList.innerHTML = spotlight
    .map(
      (target, index) => `
        <div class="spotlight-card">
          <div class="spotlight-top">
            <span class="spotlight-rank">#${index + 1}</span>
            <span class="spotlight-type">${target.type}</span>
          </div>
          <strong>${target.name}</strong>
          <div class="spotlight-meta">
            <span>Peak altitude ${target.peakAltitude}° near ${target.peakTime}</span>
            <span>Visible for about ${target.visibleHours}h in the next block</span>
          </div>
          <small>${target.recommendation}</small>
        </div>
      `
    )
    .join("");
}

function renderTargetChart(tracks, labels) {
  const width = 640;
  const height = 260;
  const padding = 24;
  if (!tracks.length) {
    els.targetChart.innerHTML = `
      <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(0,0,0,0)" />
      <text x="50%" y="50%" text-anchor="middle" fill="rgba(154,183,202,0.9)" font-size="18">
        No featured targets are high enough right now.
      </text>
    `;
    els.targetLegend.innerHTML = "<span>Try a different location or a later night window.</span>";
    els.targetAxis.innerHTML = labels.map((label) => `<span>${label}</span>`).join("");
    return;
  }

  const grid = [0.25, 0.5, 0.75]
    .map((value) => {
      const y = height - padding - value * (height - padding * 2);
      const altitude = Math.round(value * 80);
      return `
        <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
        <text x="${padding + 8}" y="${y - 8}" fill="rgba(154,183,202,0.75)" font-size="12">${altitude}°</text>
      `;
    })
    .join("");

  els.targetChart.innerHTML = `
    <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(0,0,0,0)" />
    ${grid}
    ${tracks.map((track, index) => `
      <polyline
        fill="none"
        stroke="${targetColors[index]}"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        points="${toPolyline(track.points, width, height, padding)}"
      />
    `).join("")}
  `;

  els.targetLegend.innerHTML = tracks
    .map(
      (track, index) => `<span><i class="legend-dot target-${String.fromCharCode(97 + index)}"></i>${track.name}</span>`
    )
    .join("");

  els.targetAxis.innerHTML = labels.map((label) => `<span>${label}</span>`).join("");
}

function renderMoonwatch(moonwatch) {
  els.moonwatchTitle.textContent = moonwatch.title;
  els.moonwatchSubtitle.textContent = moonwatch.subtitle;
  els.moonwatchGrid.innerHTML = moonwatch.items
    .map(
      ([label, value, note]) => `
        <div class="moonwatch-item">
          <div>
            <span>${label}</span>
            <small>${note}</small>
          </div>
          <strong>${value}</strong>
        </div>
      `
    )
    .join("");
  els.moonwatchNote.textContent = moonwatch.note;
}

async function loadLocation(location, statusMessage) {
  els.searchStatus.textContent = statusMessage;

  try {
    const forecast = await fetchForecast(location);
    state.activeLocation = location;
    els.locationQuery.value = location.name;
    renderSummary(location, forecast);
    els.searchStatus.textContent = `Loaded live forecast for ${location.name}.`;
  } catch (error) {
    els.searchStatus.textContent = "Live weather could not be loaded right now. Please try again.";
  }
}

els.searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = els.locationQuery.value.trim();

  if (query.length < 2) {
    els.searchStatus.textContent = "Enter at least two characters to search for a place.";
    return;
  }

  els.searchStatus.textContent = `Searching for ${query}...`;

  try {
    const foundLocation = await fetchLocationBySearch(query);
    await loadLocation(foundLocation, `Loading ${foundLocation.name}...`);
  } catch (error) {
    els.searchStatus.textContent = error.message;
  }
});

els.deviceLocationButton.addEventListener("click", async () => {
  if (!navigator.geolocation) {
    els.searchStatus.textContent = "This browser does not support device location.";
    return;
  }

  els.searchStatus.textContent = "Requesting your device location...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const gpsLabel = coordinatesLabel(latitude, longitude);

      try {
        const foundLocation = await reverseGeocode(latitude, longitude);
        await loadLocation(foundLocation, `Loading ${foundLocation.name}...`);
      } catch (error) {
        const fallbackLocation = {
          name: `Your area (${gpsLabel})`,
          latitude,
          longitude
        };
        await loadLocation(fallbackLocation, `Loading ${fallbackLocation.name}...`);
      }
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        els.searchStatus.textContent = "Location access was denied. Please allow location access in your browser.";
        return;
      }

      els.searchStatus.textContent = "Your device location could not be read right now.";
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    }
  );
});

els.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    if (state.liveSummary) {
      renderTargets();
      updateUrlState();
    }
  });
});

els.mapOverlayButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mapOverlay = button.dataset.mapOverlay;
    if (state.liveSummary && state.activeLocation) {
      renderMap(state.activeLocation, state.liveSummary);
      updateUrlState();
    }
  });
});

els.planButton.addEventListener("click", () => {
  const plannerBlock = document.querySelector("#planner");
  openBlock(plannerBlock);
  plannerBlock?.scrollIntoView({ behavior: "smooth" });
});

els.locationButton.addEventListener("click", () => {
  els.locationQuery.focus();
});

els.overviewDetailToggle?.addEventListener("click", () => {
  const overviewBlock = document.querySelector("#overview");
  const shouldExpand = !overviewBlock?.classList.contains("is-details-expanded");
  setOverviewDetailsExpanded(shouldExpand);
});

els.blockToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const block = button.closest("[data-collapsible-block]");

    if (!block) {
      return;
    }

    const shouldCollapse = !block.classList.contains("is-collapsed");

    if (isMobileLayout()) {
      if (shouldCollapse) {
        setBlockCollapsed(block, true);
      } else {
        openBlock(block);
      }
    } else {
      setBlockCollapsed(block, false);
    }
  });
});

document.querySelectorAll(".topnav a[href^='#']").forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href");
    if (!targetId) {
      return;
    }

    const targetBlock = document.querySelector(targetId);
    if (isMobileLayout() && ["#forecast", "#conditions"].includes(targetId)) {
      setOverviewDetailsExpanded(true);
      openBlock(document.querySelector("#overview"));
      return;
    }
    openBlock(targetBlock);
  });
});

applyUrlState();
els.locationQuery.value = state.activeLocation.name;
setOverviewDetailsExpanded(false);
els.modeButtons.forEach((button) => {
  button.classList.toggle("is-active", button.dataset.mode === state.mode);
});
els.mapOverlayButtons.forEach((button) => {
  button.classList.toggle("is-active", button.dataset.mapOverlay === state.mapOverlay);
});
loadLocation(state.activeLocation, `Loading ${state.activeLocation.name}...`);
