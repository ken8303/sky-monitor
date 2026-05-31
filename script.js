const locations = {
  dartmoor: {
    name: "Dartmoor, UK",
    summary: "Clearest viewing window starts at 22:40 and peaks near midnight.",
    intro:
      "A calm, data-rich dashboard for planning astronomy sessions, stargazing trips, and astrophotography windows.",
    stats: [
      { label: "Cloud Cover", value: "14%", note: "Low after 21:00" },
      { label: "Seeing", value: "7.8 / 10", note: "Stable atmosphere" },
      { label: "Moon Phase", value: "18%", note: "Waning crescent" }
    ],
    badge: "Excellent",
    note: "Transparency improves quickly after dusk, with the cleanest sky between 23:30 and 01:10.",
    timeline: [
      { time: "20:00", label: "Fair", level: "q2" },
      { time: "22:00", label: "Great", level: "q4" },
      { time: "00:00", label: "Peak", level: "q5" },
      { time: "02:00", label: "Great", level: "q4" },
      { time: "04:00", label: "Good", level: "q3" }
    ],
    forecast: [
      ["Sun", "81%", "Best"],
      ["Mon", "52%", "Mixed"],
      ["Tue", "68%", "Good"],
      ["Wed", "39%", "Cloudy"],
      ["Thu", "74%", "Sharp"]
    ],
    transparency: { score: 86, title: "Excellent contrast", body: "Dry upper air and low haze make faint objects easier to pick out." },
    dew: { score: 62, title: "Moderate risk later", body: "Lens heaters recommended after 01:00 as surface cooling picks up." },
    darkness: { title: "Dark window starts 22:18", body: "Moonset before midnight keeps the second half of the night much darker." },
    targets: [
      ["Andromeda Galaxy", "Best from 22:50 to 01:20"],
      ["Lagoon Nebula", "Low western haze, capture early"],
      ["Saturn", "Stable seeing supports high magnification"]
    ],
    quicklook: [
      ["Humidity", "63%", "Comfortable"],
      ["Wind", "7 km/h", "Tripod-friendly"],
      ["Bortle", "4", "Rural sky"]
    ],
    chart: [48, 56, 70, 82, 93, 90, 78, 66]
  },
  sedona: {
    name: "Sedona, Arizona",
    summary: "Deep-sky conditions stay strong for most of the night with very dry air.",
    intro:
      "A high-desert session profile with stronger transparency, darker skies, and better all-night consistency.",
    stats: [
      { label: "Cloud Cover", value: "8%", note: "Nearly clear all night" },
      { label: "Seeing", value: "8.4 / 10", note: "Smooth upper atmosphere" },
      { label: "Moon Phase", value: "18%", note: "Moon low in west" }
    ],
    badge: "Prime",
    note: "The best stretch runs from 21:50 to 02:40, with both seeing and transparency holding steady.",
    timeline: [
      { time: "20:00", label: "Good", level: "q3" },
      { time: "22:00", label: "Great", level: "q4" },
      { time: "00:00", label: "Peak", level: "q5" },
      { time: "02:00", label: "Peak", level: "q5" },
      { time: "04:00", label: "Great", level: "q4" }
    ],
    forecast: [
      ["Sun", "88%", "Prime"],
      ["Mon", "83%", "Prime"],
      ["Tue", "76%", "Strong"],
      ["Wed", "61%", "Mixed"],
      ["Thu", "85%", "Prime"]
    ],
    transparency: { score: 93, title: "Very dark and dry", body: "Low moisture and altitude combine for excellent contrast and fainter-object visibility." },
    dew: { score: 22, title: "Very low dew risk", body: "Dry desert air keeps optics clear, even during the coldest pre-dawn period." },
    darkness: { title: "Astronomical dark from 21:04", body: "A long dark run leaves plenty of room for imaging and target hopping." },
    targets: [
      ["Veil Nebula", "Wide-field imaging window is excellent"],
      ["M31 Core Detail", "Dry air supports cleaner contrast"],
      ["Saturn", "Late-night seeing stays sharp"]
    ],
    quicklook: [
      ["Humidity", "28%", "Very dry"],
      ["Wind", "5 km/h", "Steady setup"],
      ["Bortle", "3", "Dark sky"]
    ],
    chart: [62, 74, 86, 92, 95, 94, 88, 80]
  },
  lofoten: {
    name: "Lofoten, Norway",
    summary: "Cloud breaks create a shorter, more tactical observing window with aurora potential.",
    intro:
      "A northern-session profile that balances sky quality, weather gaps, and the possibility of dramatic auroral activity.",
    stats: [
      { label: "Cloud Cover", value: "36%", note: "Variable gaps after 23:00" },
      { label: "Seeing", value: "6.5 / 10", note: "Changeable marine air" },
      { label: "Aurora", value: "Kp 4", note: "Moderate activity chance" }
    ],
    badge: "Watch Closely",
    note: "The clearest opportunity is compact, roughly 23:10 to 00:50, but aurora activity may reward patience.",
    timeline: [
      { time: "20:00", label: "Poor", level: "q2" },
      { time: "22:00", label: "Fair", level: "q2" },
      { time: "00:00", label: "Great", level: "q4" },
      { time: "02:00", label: "Good", level: "q3" },
      { time: "04:00", label: "Fair", level: "q2" }
    ],
    forecast: [
      ["Sun", "44%", "Mixed"],
      ["Mon", "57%", "Better"],
      ["Tue", "63%", "Good"],
      ["Wed", "41%", "Cloudy"],
      ["Thu", "59%", "Watch"]
    ],
    transparency: { score: 67, title: "Clear spells likely", body: "Transparency improves sharply during gaps, but conditions may swing hour by hour." },
    dew: { score: 48, title: "Manageable moisture", body: "Cold, damp air means heaters help, though the risk is not extreme." },
    darkness: { title: "Aurora watch peaks 23:40", body: "If clouds open on schedule, the northern horizon could become the main event." },
    targets: [
      ["Aurora Patrol", "Stay mobile and frame the northern horizon"],
      ["Pleiades", "Best during the clearest mid-window gap"],
      ["Wide-field Milky Way", "Use fast lenses between cloud bands"]
    ],
    quicklook: [
      ["Humidity", "79%", "Layer up"],
      ["Wind", "14 km/h", "Shelter advised"],
      ["Bortle", "3", "Very dark"]
    ],
    chart: [30, 36, 40, 58, 74, 71, 55, 42]
  }
};

const state = {
  location: "dartmoor",
  mode: "visual"
};

const els = {
  locationSelect: document.querySelector("#location-select"),
  heroEyebrow: document.querySelector("#hero-eyebrow"),
  heroTitle: document.querySelector("#hero-title"),
  heroText: document.querySelector("#hero-text"),
  heroStats: document.querySelector("#hero-stats"),
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
  modeButtons: document.querySelectorAll("[data-mode]"),
  planButton: document.querySelector("#plan-button"),
  locationButton: document.querySelector("#location-button")
};

function makeStat(stat) {
  return `
    <div class="stat">
      <span>${stat.label}</span>
      <strong>${stat.value}</strong>
      <small>${stat.note}</small>
    </div>
  `;
}

function renderLocation() {
  const data = locations[state.location];

  els.heroEyebrow.textContent = `Tonight at ${data.name}`;
  els.heroTitle.textContent = data.summary;
  els.heroText.textContent = data.intro;
  els.heroStats.innerHTML = data.stats.map(makeStat).join("");
  els.qualityBadge.textContent = data.badge;
  els.qualityNote.textContent = data.note;

  els.timelineLabels.innerHTML = data.timeline.map((item) => `<span>${item.time}</span>`).join("");
  els.timelineBars.innerHTML = data.timeline
    .map((item) => `<span class="${item.level}">${item.label}</span>`)
    .join("");

  els.forecastList.innerHTML = data.forecast
    .map(
      ([day, score, note]) =>
        `<li><span>${day}</span><strong>${score}</strong><small>${note}</small></li>`
    )
    .join("");

  els.transparencyScore.textContent = data.transparency.score;
  els.transparencyScore.parentElement.style.setProperty("--value", data.transparency.score);
  els.transparencyTitle.textContent = data.transparency.title;
  els.transparencyBody.textContent = data.transparency.body;

  els.dewScore.textContent = data.dew.score;
  els.dewScore.parentElement.style.setProperty("--value", data.dew.score);
  els.dewTitle.textContent = data.dew.title;
  els.dewBody.textContent = data.dew.body;

  els.darkTitle.textContent = data.darkness.title;
  els.darkBody.textContent = data.darkness.body;

  els.quicklook.innerHTML = data.quicklook
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

  els.chartBars.innerHTML = data.chart
    .map(
      (value, index) => `
        <div class="chart-col">
          <span class="chart-value" style="height:${value}%"></span>
          <small>${20 + index}:00</small>
        </div>
      `
    )
    .join("");

  renderTargets();
}

function renderTargets() {
  const data = locations[state.location];
  const targetSets = {
    visual: data.targets,
    photo: data.targets.map(([title, detail]) => [title, `Photo mode: ${detail}`]),
    travel: data.targets.map(([title, detail]) => [title, `Travel setup: ${detail}`])
  };

  els.targetList.innerHTML = targetSets[state.mode]
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
}

els.locationSelect.addEventListener("change", (event) => {
  state.location = event.target.value;
  renderLocation();
});

els.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    renderTargets();
  });
});

els.planButton.addEventListener("click", () => {
  document.querySelector("#planner")?.scrollIntoView({ behavior: "smooth" });
});

els.locationButton.addEventListener("click", () => {
  els.locationSelect.focus();
});

renderLocation();
