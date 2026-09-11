/**
 * FrostCraft Weather Display for Minecraft 'WebDisplays' Mod
 * Dynamic weather cycling every 60 seconds with realistic cold shift & animations
 */

const WEATHER_CONFIG = {
  // Update interval in milliseconds (60000ms = 1 minute)
  updateIntervalMs: 60000,

  // Temperature ranges for server conditions
  tempPresets: [
    { type: 'snowflake', temp: '-50C' },
    { type: 'storm', temp: '-64C' },
    { type: 'snowflake', temp: '-72C' },
    { type: 'storm', temp: '-64C' },
    { type: 'snowflake', temp: '-50C' },
    { type: 'storm', temp: '-58C' },
    { type: 'snowflake', temp: '-68C' },
    { type: 'storm', temp: '-75C' },
    { type: 'snowflake', temp: '-52C' },
    { type: 'storm', temp: '-60C' }
  ]
};

// SVG Templates
const ICONS = {
  snowflake: `
    <svg class="forecast-icon snowflake-svg" viewBox="0 0 100 100">
      <g stroke="#000000" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <line x1="50" y1="10" x2="50" y2="90" />
        <line x1="10" y1="50" x2="90" y2="50" />
        <line x1="22" y1="22" x2="78" y2="78" />
        <line x1="22" y1="78" x2="78" y2="22" />
        <path d="M50 25 L40 35 M50 25 L60 35" />
        <path d="M50 75 L40 65 M50 75 L60 65" />
        <path d="M25 50 L35 40 M25 50 L35 60" />
        <path d="M75 50 L65 40 M75 50 L65 60" />
        <path d="M32 32 L44 32 M32 32 L32 44" />
        <path d="M68 32 L56 32 M68 32 L68 44" />
        <path d="M32 68 L44 68 M32 68 L32 56" />
        <path d="M68 68 L56 68 M68 68 L68 56" />
        <path d="M50 12 L42 20 M50 12 L58 20" />
        <path d="M50 88 L42 80 M50 88 L58 80" />
        <path d="M12 50 L20 42 M12 50 L20 58" />
        <path d="M88 50 L80 42 M88 50 L80 58" />
      </g>
    </svg>
  `,
  storm: `
    <svg class="forecast-icon storm-svg" viewBox="0 0 100 100">
      <path d="M20 42 A12 12 0 0 1 38 34 A14 14 0 0 1 62 34 A12 12 0 0 1 80 42 A10 10 0 0 1 78 52 L22 52 A10 10 0 0 1 20 42 Z" 
            fill="#ffffff" stroke="#000000" stroke-width="5" stroke-linejoin="round" />
      <path d="M36 53 L31 66 L40 66 L33 80" stroke="#00cccc" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M58 53 L53 66 L62 66 L55 80" stroke="#00cccc" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <g stroke="#000000" stroke-width="4" stroke-linecap="round">
        <line x1="22" y1="58" x2="18" y2="67" />
        <line x1="25" y1="72" x2="21" y2="81" />
        <line x1="46" y1="57" x2="42" y2="66" />
        <line x1="48" y1="72" x2="44" y2="81" />
        <line x1="72" y1="58" x2="68" y2="67" />
        <line x1="74" y1="72" x2="70" y2="81" />
      </g>
    </svg>
  `
};

// Current 5 active days state
let currentForecast = [
  { type: 'snowflake', temp: '-50C' },
  { type: 'storm', temp: '-64C' },
  { type: 'snowflake', temp: '-72C' },
  { type: 'storm', temp: '-64C' },
  { type: 'snowflake', temp: '-50C' }
];

// Helper to generate a new realistic weather step
function generateNextWeatherItem() {
  const isStorm = Math.random() > 0.45;
  // Extreme frost range from -48°C to -76°C
  const tempValues = isStorm 
    ? [-58, -62, -64, -66, -70, -74] 
    : [-48, -50, -52, -54, -68, -72];
  const chosenTemp = tempValues[Math.floor(Math.random() * tempValues.length)];
  return {
    type: isStorm ? 'storm' : 'snowflake',
    temp: `${chosenTemp}C`
  };
}

// Update forecast by shifting forward like a real weather cycle
function cycleWeather() {
  const nextDay = generateNextWeatherItem();
  
  // Shift left (day 1 becomes day 2, and new day arrives at end)
  currentForecast.shift();
  currentForecast.push(nextDay);

  renderForecast(currentForecast, true);
}

function renderForecast(forecastArray, animate = false) {
  const container = document.getElementById('weatherRow');
  if (!container) return;

  if (animate) {
    container.classList.add('updating');
    setTimeout(() => {
      buildHTML();
      container.classList.remove('updating');
    }, 300);
  } else {
    buildHTML();
  }

  function buildHTML() {
    container.innerHTML = '';
    forecastArray.forEach((item, index) => {
      const cell = document.createElement('div');
      cell.className = 'weather-cell';
      cell.id = `day-${index + 1}`;
      
      const iconSvg = ICONS[item.type] || ICONS.snowflake;
      
      cell.innerHTML = `
        <div class="icon-wrap">
          ${iconSvg}
        </div>
        <div class="temp-text">${item.temp}</div>
      `;

      container.appendChild(cell);
    });
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderForecast(currentForecast, false);

  // Auto-shift weather every 60 seconds (1 minute)
  setInterval(() => {
    cycleWeather();
  }, WEATHER_CONFIG.updateIntervalMs);
});
