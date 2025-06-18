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

// DOM ELEMENT REFERENCES
const drawScreen = document.querySelector("#drawScreen");
const resizeButton = document.querySelector("#resizeButton");
const drawButton = document.querySelector("#drawButton");
const eraseButton = document.querySelector("#eraseButton");

// TOOL HANDLERS
const ToolHandlers = {
  [ToolMode.DRAW]: (pixel) => pixel.classList.add("painted"),
  [ToolMode.ERASE]: (pixel) => pixel.classList.remove("painted"),
  // [ToolMode.SHADE]: () => {/* increment darkness by 10% */},
  // [ToolMode.LIGHTEN]: () => {/* decrement darkness by 10% */},
};

const applyTool = (pixel) => {
  const handler = ToolHandlers[currentTool];
  if (handler) handler(pixel);
};

// UTILITIES
const clearScreen = () => {
  drawScreen.replaceChildren();
};

const redrawScreen = (squaresPerSide) => {
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
