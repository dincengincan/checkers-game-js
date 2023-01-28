const boardElement = document.getElementById("board");
const jumpModeButton = document.getElementById("jump-mode-button");

const blackValue = "b";
const whiteValue = "w";
const emptyValue = "e";

let selectedPieceElement = "";
let isWhiteNext = true;
let isGodMode = false;

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

  if (selectedPieceElement) {
    selectedPieceElement.classList.remove("selected");
  }

  selectedPieceElement = this;
  selectedPieceElement.classList.add("selected");

  isWhitePieceSelected = whitePieces.has(getLocation(this));
}

function isWhitePiece(element) {
  return element.classList.contains("piece-white");
}

function playMove() {
  if (!selectedPieceElement) {
    return;
  }

  if (isWhiteNext !== isWhitePieceSelected) {
    return;
  }

  const selectedClass = isWhitePieceSelected
    ? whitePieceClass
    : blackPieceClass;

  const nextLocation = getLocation(this.children[0]);
  const previousLocation = getLocation(selectedPieceElement);

  const validMove = findValidMove(previousLocation, nextLocation);
  console.log(validMove);
  if (validMove) {
    selectedPieceElement.classList.remove(selectedClass);
    this.children[0].classList.add(selectedClass);

    (isWhitePieceSelected ? whitePieces : blackPieces).add(nextLocation);
    (isWhitePieceSelected ? whitePieces : blackPieces).delete(previousLocation);

    if (validMove?.toBeRemoved) {
      (isWhitePieceSelected ? blackPieces : whitePieces).delete(
        validMove?.toBeRemoved
      );
      const pieceToBeRemoved = findElementByDataId(validMove.toBeRemoved);
      console.log(pieceToBeRemoved);
      pieceToBeRemoved.classList.remove(
        isWhiteNext ? blackPieceClass : whitePieceClass
      );
    }

    selectedPieceElement.classList.remove("selected");
    selectedPieceElement = null;
    isWhiteNext = !isWhiteNext;
  }
}

function hasBeaten(prevLocation, nextLocation) {
  // return nextLocation !== nextNeighbor;
}

function beatPieces(prevLocation, nextLocation) {}

function findValidMove(prevLocation, nextLocation) {
  const validMoves = validateNeighbours(prevLocation);

  return validMoves?.find((move) => move.location === nextLocation);
}

function validateNeighbours(pieceLocation) {
  const neighbours = getAllNeighbours(pieceLocation);
  const nextLeftNeighbours = getAllNeighbours(neighbours.left);
  const nextRightNeighbours = getAllNeighbours(neighbours.right);

  const firstValidMoves = checkNeighbour(
    neighbours.left,
    nextLeftNeighbours.left
  );
  const SecondValidMoves = checkNeighbour(
    neighbours.right,
    nextRightNeighbours.right
  );

  return [...firstValidMoves, ...SecondValidMoves];
}

function checkNeighbour(location, nextNextNeighbour) {
  const validMoves = [];

  if (isCellEmpty(location)) {
    // if empty add to valid moves
    validMoves.push({ location });
  }

  if (
    (isWhiteNext ? blackPieces : whitePieces).has(location) &&
    isCellEmpty(nextNextNeighbour)
  ) {
    // if there is opponent and space behind it add it
    validMoves.push({ location: nextNextNeighbour, toBeRemoved: location });
  }

  return validMoves;
}

function isCellEmpty(location) {
  return !blackPieces.has(location) && !whitePieces.has(location);
}

function getAllNeighbours(location) {
  const [numberX, numberY] = extractLocationAsNumbers(location);

  let firstNeighbourX;
  let firstNeighbourY;

  let secondNeighbourX;
  let secondNeighbourY;

  if (isWhiteNext) {
    firstNeighbourX = numberX + 1;
    firstNeighbourY = numberY - 1;

    secondNeighbourX = numberX + 1;
    secondNeighbourY = numberY + 1;
  } else {
    firstNeighbourX = numberX - 1;
    firstNeighbourY = numberY - 1;

    secondNeighbourX = numberX - 1;
    secondNeighbourY = numberY + 1;
  }

  return {
    left: isWhiteNext
      ? `${secondNeighbourX}${secondNeighbourY}`
      : `${firstNeighbourX}${firstNeighbourY}`,
    right: isWhiteNext
      ? `${firstNeighbourX}${firstNeighbourY}`
      : `${secondNeighbourX}${secondNeighbourY}`,
  };
}

function extractLocationAsNumbers(location) {
  const [x, y] = location.split("");
  const numberX = Number(x);
  const numberY = Number(y);
  return [numberX, numberY];
}

function getLocation(element) {
  return element.getAttribute("data-location");
}

function findElementByDataId(dataId) {
  return document.querySelector(`[data-location="${dataId}"]`);
}

function handleGodMode() {
  isGodMode = !isGodMode;
  if (!isGodMode) {
    this.innerText = "ENABLE QUDAY MODE";
    this.classList.toggle("kuday-mode");
  } else {
    this.innerText = "DISABLE QUDAY MODE";
    this.classList.toggle("kuday-mode");
  }
}

createMatrix();
createBoard();
jumpModeButton.addEventListener("click", handleGodMode);
