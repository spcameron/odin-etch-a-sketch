const drawScreen = document.querySelector("#drawScreen");
const resizeButton = document.querySelector("#resizeButton");

resizeButton.addEventListener("click", () => {
  user_input = prompt("How many squares per side?");
  clearScreen();
  redrawScreen(user_input);
});

const clearScreen = () => {
  drawScreen.replaceChildren();
};

const redrawScreen = (squaresPerSide) => {
  if (squaresPerSide > 64) {
    squaresPerSide = 64;
  }
  
  const totalSquares = squaresPerSide * squaresPerSide;

  for (let i = 0; i < totalSquares; i++) {
    const flexBasis = 100 / squaresPerSide;

    const newSquare = document.createElement("div");
    newSquare.className = "square";
    newSquare.style.flex = `0 0 ${flexBasis}%`;

    newSquare.addEventListener("mouseenter", (event) => {
      event.target.style.backgroundColor = "#7f7f7f";
    });

    drawScreen.appendChild(newSquare);
  }
};

redrawScreen(16);