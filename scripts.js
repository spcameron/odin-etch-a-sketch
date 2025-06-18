const drawScreen = document.querySelector("#drawScreen");
const resizeButton = document.querySelector("#resizeButton");

let isMouseDown = false;

document.addEventListener("mousedown", () => (isMouseDown = true));
document.addEventListener("mouseup", () => (isMouseDown = false));

resizeButton.addEventListener("click", () => {
  user_input = prompt("How many squares per side (2 - 64)?");
  clearScreen();
  redrawScreen(user_input);
});

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
      if (isMouseDown) {
        pixel.classList.add("painted");
      }
    });

    pixel.addEventListener("mousedown", () => {
      pixel.classList.add("painted");
    });
  });
};

redrawScreen(16);
