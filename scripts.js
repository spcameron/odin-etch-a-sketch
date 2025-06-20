// ENUMS
const ToolMode = Object.freeze({
  DRAW: "draw",
  ERASE: "erase",
  SHADE: "shade",
  LIGHTEN: "lighten",
});

// STATE
let isMouseDown = false;
let currentTool = ToolMode.DRAW;
let currentColor = "rgb(127, 127, 127)";
let displayGrid = false;

// DOM ELEMENT REFERENCES
const drawScreen = document.querySelector("#drawScreen");
const resizeButton = document.querySelector("#resizeButton");
const drawButton = document.querySelector("#drawButton");
const eraseButton = document.querySelector("#eraseButton");
const shadeButton = document.querySelector("#shadeButton");
const lightenButton = document.querySelector("#lightenButton");
const gridButton = document.querySelector("#toggleGrid");
const pixelInput = document.querySelector("#pixelSize");

// TOOL HANDLERS
const ToolHandlers = {
  [ToolMode.DRAW]: (pixel) => (pixel.style.backgroundColor = currentColor),
  [ToolMode.ERASE]: (pixel) => (pixel.style.backgroundColor = "rgb(255, 255, 255)"),
  [ToolMode.SHADE]: (pixel) => shadePixel(pixel, -10),
  [ToolMode.LIGHTEN]: (pixel) => shadePixel(pixel, 10),
};

const applyTool = (pixel) => {
  const handler = ToolHandlers[currentTool];
  if (handler) handler(pixel);
};

// DOM UTILITIES
const clearScreen = () => {
  document.querySelectorAll(".pixel").forEach((pixel) => {
    pixel.style.backgroundColor = "";
  });
};

const redrawScreen = (squaresPerSide) => {
  drawScreen.replaceChildren();

  squaresPerSide = clamp(squaresPerSide, 2, 64);

  pixelInput.value = squaresPerSide;

  const totalSquares = squaresPerSide * squaresPerSide;
  const flexBasis = 100 / squaresPerSide;

  for (let i = 0; i < totalSquares; i++) {
    const newSquare = document.createElement("div");
    newSquare.style.flex = `0 0 ${flexBasis}%`;
    newSquare.classList.add("pixel");
    if (displayGrid) newSquare.classList.add("show-grid");
    drawScreen.appendChild(newSquare);
  }

  document.querySelectorAll(".pixel").forEach((pixel) => {
    pixel.addEventListener("mouseenter", () => {
      if (isMouseDown) applyTool(pixel);
    });

    pixel.addEventListener("mousedown", () => {
      applyTool(pixel);
    });
  });
};

const bindToolButton = (button, mode) => {
  button.addEventListener("click", (event) => {
    setToolMode(mode);
    document.querySelectorAll(".tool-button").forEach((btn) => {
      btn.classList.remove("active");
    });
    event.currentTarget.classList.add("active");
  });
};

const setToolMode = (mode) => {
  switch (mode) {
    case ToolMode.DRAW:
    case ToolMode.ERASE:
    case ToolMode.SHADE:
    case ToolMode.LIGHTEN:
      currentTool = mode;
      break;
    default:
      console.error("Invalid tool mode:", mode);
  }
};

// COLOR UTILITIES
const convertRgbToHsl = ({ r, g, b }) => {
  // normalize RGB values
  const rFloat = r / 255;
  const gFloat = g / 255;
  const bFloat = b / 255;

  // find min, max, and calculate delta
  const max = Math.max(rFloat, gFloat, bFloat);
  const min = Math.min(rFloat, gFloat, bFloat);
  const delta = max - min;

  // compute lightness (L)
  let lightness = (max + min) / 2;

  // compute saturation (S)
  let saturation;
  if (delta == 0) {
    saturation = 0;
  } else {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
  }

  // computer hue (H)
  let hue;
  if (delta === 0) {
    hue = 0;
  } else if (max === rFloat) {
    hue = (gFloat - bFloat) / delta;
  } else if (max === gFloat) {
    hue = (bFloat - rFloat) / delta + 2;
  } else if (max === bFloat) {
    hue = (rFloat - gFloat) / delta + 4;
  }

  // scale L and S to percentage, H to degrees
  hue *= 60;
  if (hue < 0) hue += 360;
  saturation *= 100;
  lightness *= 100;

  return { h: hue, s: saturation, l: lightness };
};

const convertHslToRgb = ({ h, s, l }) => {
  // normalize HSL values
  h = h % 360;
  const hFloat = h / 60;
  const sFloat = s / 100;
  const lFloat = l / 100;

  // compute chroma (C)
  const C = (1 - Math.abs(2 * lFloat - 1)) * sFloat;

  // computer intermediate value X
  const X = C * (1 - Math.abs((hFloat % 2) - 1));

  // compute intermediate RGB values
  let rgb;
  if (hFloat < 1) {
    rgb = { r: C, g: X, b: 0 };
  } else if (hFloat < 2) {
    rgb = { r: X, g: C, b: 0 };
  } else if (hFloat < 3) {
    rgb = { r: 0, g: C, b: X };
  } else if (hFloat < 4) {
    rgb = { r: 0, g: X, b: C };
  } else if (hFloat < 5) {
    rgb = { r: X, g: 0, b: C };
  } else {
    rgb = { r: C, g: 0, b: X };
  }

  // compute lightness offset (M)
  const M = lFloat - C / 2;

  // apply M to each RGB, scale and clamp to [0, 255]
  for (const key of ["r", "g", "b"]) {
    let val = rgb[key] + M;
    val *= 255;
    val = Math.round(val);
    val = clamp(val, 0, 255);
    rgb[key] = val;
  }

  return rgb;
};

const parseColorString = (string) => {
  const start = string.indexOf("(");
  const end = string.indexOf(")");
  const values = string.slice(start + 1, end);

  let tokens = values.split(",");
  const [r, g, b] = tokens.slice(0, 3).map((str) => parseInt(str.trim()));
  return { r, g, b };
};

const formatColorString = (rgbObject) => {
  return `rgb(${rgbObject.r}, ${rgbObject.g}, ${rgbObject.b})`;
};

const shadePixel = (pixel, delta) => {
  const currRgbString = getComputedStyle(pixel).backgroundColor;
  const currRgb = parseColorString(currRgbString);
  const currHsl = convertRgbToHsl(currRgb);
  const newHsl = {
    h: currHsl.h,
    s: currHsl.s,
    l: clamp(currHsl.l + delta, 0, 100),
  };
  const newRgb = convertHslToRgb(newHsl);
  const newRgbString = formatColorString(newRgb);
  pixel.style.backgroundColor = newRgbString;
};

const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

// EVENT BINDINGS
document.addEventListener("mousedown", () => (isMouseDown = true));
document.addEventListener("mouseup", () => (isMouseDown = false));

bindToolButton(drawButton, ToolMode.DRAW);
bindToolButton(eraseButton, ToolMode.ERASE);
bindToolButton(shadeButton, ToolMode.SHADE);
bindToolButton(lightenButton, ToolMode.LIGHTEN);

resizeButton.addEventListener("click", () => {
  const userInput = parseInt(pixelInput.value, 10) || 16;
  clearScreen();
  redrawScreen(userInput);
});

gridButton.addEventListener("click", () => {
  if (displayGrid) {
    document.querySelectorAll(".pixel").forEach((pixel) => {
      pixel.classList.remove("show-grid");
    });
    gridButton.innerHTML = "Show Grid";
    displayGrid = false;
  } else {
    document.querySelectorAll(".pixel").forEach((pixel) => {
      pixel.classList.add("show-grid");
    });
    gridButton.innerHTML = "Hide Grid";
    displayGrid = true;
  }
});

pixelInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    resizeButton.click();
  }
});

// INITIALIZATION
const startup = () => {
  setToolMode(ToolMode.DRAW);
  drawButton.classList.add("active");
  redrawScreen(16);
};

startup();
