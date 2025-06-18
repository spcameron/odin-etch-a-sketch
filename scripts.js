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
let currentColor = hsl(0, 0, 50);

// DOM ELEMENT REFERENCES
const drawScreen = document.querySelector("#drawScreen");
const resizeButton = document.querySelector("#resizeButton");
const drawButton = document.querySelector("#drawButton");
const eraseButton = document.querySelector("#eraseButton");

// TOOL HANDLERS
const ToolHandlers = {
  [ToolMode.DRAW]: (pixel) => (pixel.style.backgroundColor = currentColor),
  [ToolMode.ERASE]: (pixel) => (pixel.style.backgroundColor = ""),
  // [ToolMode.SHADE]: () => {/* increment darkness by 10% */},
  // [ToolMode.LIGHTEN]: () => {/* decrement darkness by 10% */},
};

const applyTool = (pixel) => {
  const handler = ToolHandlers[currentTool];
  if (handler) handler(pixel);
};

// UTILITIES
const clearScreen = () => {
  document.querySelectorAll(".pixel").forEach((pixel) => {
    pixel.style.backgroundColor = "";
  });
};

const redrawScreen = (squaresPerSide) => {
  drawScreen.replaceChildren();

  if (squaresPerSide > 64) {
    squaresPerSide = 64;
  } else if (squaresPerSide == null || squaresPerSide < 2) {
    squaresPerSide = 16;
  }

  const totalSquares = squaresPerSide * squaresPerSide;
  const flexBasis = 100 / squaresPerSide;

  for (let i = 0; i < totalSquares; i++) {
    const newSquare = document.createElement("div");
    newSquare.className = "pixel";
    newSquare.style.flex = `0 0 ${flexBasis}%`;

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

const convertRgbToHsl = (r, g, b) => {
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
  const l = lightness * 100;
  const s = saturation * 100;
  const h = hue * 60;
  if (h < 0) h += 360;

  return [h, s, l];
};

const convertHslToRgb = (h, s, l) => {};

const parseColorString = (string) => {};

// EVENT BINDINGS
document.addEventListener("mousedown", () => (isMouseDown = true));
document.addEventListener("mouseup", () => (isMouseDown = false));

resizeButton.addEventListener("click", () => {
  user_input = prompt("How many squares per side (2 - 64)?");
  clearScreen();
  redrawScreen(user_input);
});

drawButton.addEventListener("click", () => setToolMode(ToolMode.DRAW));
eraseButton.addEventListener("click", () => setToolMode(ToolMode.ERASE));

// INITIALIZATION
redrawScreen(16);
