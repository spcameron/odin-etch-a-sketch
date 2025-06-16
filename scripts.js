const container = document.querySelector("#container");

let containerEdgeLength = container.clientWidth;
let numberOfSquares = 16;
let squareSideLength = containerEdgeLength / numberOfSquares;

for (let i = 0; i < numberOfSquares * numberOfSquares; i++) {
  const flexBasis = 100 / numberOfSquares;

  const newSquare = document.createElement("div");
  newSquare.className = "square";
  newSquare.style.flex = `0 0 ${flexBasis}%`;

  newSquare.addEventListener("mouseenter", (event) => {
    event.target.style.backgroundColor = "#7f7f7f";
  });

  container.appendChild(newSquare);
}
