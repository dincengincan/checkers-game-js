const boardElement = document.getElementById("board");

const blackValue = "b";
const whiteValue = "w";
const emptyValue = "e";

let selectedPieceElement = "";
let isWhiteNext = true;

const whitePieceClass = "piece-white";
const blackPieceClass = "piece-black";
let isWhitePieceSelected = false;

const gridSize = 8;
const board = [];

const whitePieces = new Set([
  "00",
  "02",
  "04",
  "06",
  "11",
  "13",
  "15",
  "17",
  "20",
  "22",
  "24",
  "26",
]);

const blackPieces = new Set([
  "51",
  "53",
  "55",
  "57",
  "60",
  "62",
  "64",
  "66",
  "71",
  "73",
  "75",
  "77",
]);

// Not sure if I need it
function createMatrix() {
  for (let i = 0; i < 8; i++) {
    const arr = [];
    for (let j = 0; j < 8; j++) {
      if (i === 3 || i === 4) {
        arr.push(emptyValue);
      } else if (i < 3) {
        if (j % 2 === 0) {
          arr.push(blackValue);
        } else {
          arr.push(emptyValue);
        }
      } else {
        if (j % 2 === 0) {
          arr.push(emptyValue);
        } else {
          arr.push(whiteValue);
        }
      }
    }
    board.push(arr);
  }
}

function createBoard() {
  for (let i = 0; i < gridSize; i++) {
    const boardRow = document.createElement("div");
    boardRow.classList.add("boardRow");
    for (let j = 0; j < gridSize; j++) {
      const hasBlackPiece = blackPieces.has(`${i}${j}`);
      const hasWhitePiece = whitePieces.has(`${i}${j}`);

      const cell = document.createElement("div");
      cell.classList.add("cell");
      const indexSum = i + j;
      const location = `${i}${j}`;
      if (indexSum % 2 === 0) {
        cell.addEventListener("click", playMove);
        cell.classList.add("black");
        const piece = document.createElement("div");
        piece.setAttribute("data-location", location);
        piece.addEventListener("click", setSelectPiece);
        piece.classList.add("piece");
        if (hasBlackPiece || hasWhitePiece) {
          piece.classList.add(
            hasBlackPiece ? blackPieceClass : whitePieceClass
          );
        }
        cell.appendChild(piece);
      } else {
        cell.classList.add("white");
      }
      boardRow.appendChild(cell);
    }
    boardElement.appendChild(boardRow);
  }
}

function setSelectPiece(e) {
  e.stopPropagation();
  selectedPieceElement = this;
  isWhitePieceSelected = whitePieces.has(getLocation(this));
  console.log(isWhitePieceSelected);
}

function playMove() {
  if (!selectedPieceElement) {
    return;
  }

  const selectedClass = isWhitePieceSelected
    ? whitePieceClass
    : blackPieceClass;

  selectedPieceElement.classList.remove(selectedClass);
  this.children[0].classList.add(selectedClass);

  const nextLocation = getLocation(this.children[0]);
  const previousLocation = getLocation(selectedPieceElement);

  if (isValidMove(previousLocation, nextLocation)) {
    (isWhitePieceSelected ? whitePieces : blackPieces).add(nextLocation);
    (isWhitePieceSelected ? whitePieces : blackPieces).delete(previousLocation);

    selectedPieceElement = null;
    isWhiteNext = !isWhiteNext;
  }
}

function isValidMove(prevLocation, nextLocation) {
  return true;
}

function getLocation(element) {
  return element.getAttribute("data-location");
}

createMatrix();
createBoard();
