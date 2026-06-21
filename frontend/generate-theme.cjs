const fs = require('fs');

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : null;
}

const darkColors = {
  "secondary-fixed-dim": "#b7c8e1",
  "on-surface": "#dae2fd",
  "background": "#0b1326",
  "surface-variant": "#2d3449",
  "tertiary-container": "#00a572",
  "inverse-surface": "#dae2fd",
  "on-primary": "#002e6a",
  "tertiary-fixed": "#6ffbbe",
  "secondary-fixed": "#d3e4fe",
  "surface-container-high": "#222a3d",
  "surface-container": "#171f33",
  "inverse-on-surface": "#283044",
  "outline-variant": "#424754",
  "primary-container": "#4d8eff",
  "on-tertiary-fixed-variant": "#005236",
  "on-secondary-fixed-variant": "#38485d",
  "primary-fixed": "#d8e2ff",
  "surface-dim": "#0b1326",
  "surface-tint": "#adc6ff",
  "on-surface-variant": "#c2c6d6",
  "error-container": "#93000a",
  "secondary-container": "#3a4a5f",
  "inverse-primary": "#005ac2",
  "on-primary-fixed": "#001a42",
  "on-secondary-fixed": "#0b1c30",
  "on-secondary-container": "#a9bad3",
  "on-primary-container": "#00285d",
  "surface-bright": "#31394d",
  "tertiary-fixed-dim": "#4edea3",
  "surface": "#0b1326",
  "surface-container-highest": "#2d3449",
  "surface-container-low": "#131b2e",
  "on-tertiary-container": "#00311f",
  "outline": "#8c909f",
  "surface-container-lowest": "#060e20",
  "on-error": "#690005",
  "on-primary-fixed-variant": "#004395",
  "on-tertiary-fixed": "#002113",
  "tertiary": "#4edea3",
  "on-secondary": "#213145",
  "error": "#ffb4ab",
  "primary-fixed-dim": "#adc6ff",
  "on-background": "#dae2fd",
  "primary": "#adc6ff",
  "secondary": "#b7c8e1",
  "on-tertiary": "#003824",
  "on-error-container": "#ffdad6"
};

const lightColors = {
  "error-container": "#ffdad6",
  "surface-container-lowest": "#ffffff",
  "error": "#ba1a1a",
  "on-tertiary-fixed": "#191c1e",
  "tertiary-container": "#484c4e",
  "surface-variant": "#d3e4fe",
  "surface": "#f8f9ff",
  "on-secondary-container": "#00714e",
  "on-background": "#0b1c30",
  "on-primary-container": "#a8b8ff",
  "on-error-container": "#93000a",
  "surface-dim": "#cbdbf5",
  "primary": "#00288e",
  "on-surface-variant": "#444653",
  "outline": "#757684",
  "secondary-fixed-dim": "#68dba9",
  "on-tertiary-container": "#b9bcbe",
  "on-tertiary": "#ffffff",
  "secondary": "#006c4a",
  "on-primary-fixed-variant": "#173bab",
  "surface-container": "#e5eeff",
  "on-secondary-fixed": "#002114",
  "inverse-on-surface": "#eaf1ff",
  "on-secondary": "#ffffff",
  "primary-fixed-dim": "#b8c4ff",
  "secondary-container": "#82f5c1",
  "primary-fixed": "#dde1ff",
  "secondary-fixed": "#85f8c4",
  "on-primary": "#ffffff",
  "on-tertiary-fixed-variant": "#444749",
  "outline-variant": "#c4c5d5",
  "surface-container-highest": "#d3e4fe",
  "tertiary-fixed-dim": "#c4c7c9",
  "inverse-primary": "#b8c4ff",
  "surface-tint": "#3755c3",
  "surface-bright": "#f8f9ff",
  "inverse-surface": "#213145",
  "on-secondary-fixed-variant": "#005137",
  "primary-container": "#1e40af",
  "surface-container-high": "#dce9ff",
  "tertiary": "#323537",
  "surface-container-low": "#eff4ff",
  "tertiary-fixed": "#e0e3e5",
  "background": "#f8f9ff",
  "on-error": "#ffffff",
  "on-primary-fixed": "#001453",
  "on-surface": "#0b1c30"
};

let cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
${Object.entries(lightColors).map(([k, v]) => `    --color-${k}: ${hexToRgb(v)};`).join('\n')}
  }

  .dark {
${Object.entries(darkColors).map(([k, v]) => `    --color-${k}: ${hexToRgb(v)};`).join('\n')}
  }

  body {
    @apply bg-background text-on-surface antialiased transition-colors duration-200;
    font-family: 'Inter', sans-serif;
  }

  h1, h2, h3, .font-manrope {
    font-family: 'Manrope', sans-serif;
  }
}

@layer components {
  .bento-card {
    @apply transition-all duration-200;
  }
  
  .bento-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.3);
  }

  .light .bento-card:hover {
    box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.08);
  }
  
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
}
`;

fs.writeFileSync('src/index.css', cssContent);

let tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
${Object.keys(lightColors).map(k => `        "${k}": "rgb(var(--color-${k}) / <alpha-value>)"`).join(',\n')}
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "lg": "24px",
        "margin-desktop": "48px",
        "sm": "8px",
        "md": "16px",
        "xs": "4px",
        "gutter": "24px",
        "margin-mobile": "16px",
        "unit": "4px",
        "xl": "32px"
      },
      fontFamily: {
        "headline-lg": ["Manrope", "sans-serif"],
        "title-md": ["Manrope", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "display-lg": ["Manrope", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-sm": ["JetBrains Mono", "monospace"]
      },
      fontSize: {
        "title-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
      }
    },
  },
  plugins: [],
}
`;

fs.writeFileSync('tailwind.config.js', tailwindConfig);
console.log('Successfully generated theme files.');
