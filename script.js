const boardElement = document.getElementById("board");
const jumpModeButton = document.getElementById("jump-mode-button");
const whoIsNextInfo = document.getElementById("who-is-next-info");
const moveSound = document.getElementById("move-sound");
const beatSound = document.getElementById("beat-sound");
const godModeEnableSound = document.getElementById("god-mode-enable-sound");
const godModeDisableSound = document.getElementById("god-mode-disable-sound");

const blackValue = "b";
const whiteValue = "w";

let selectedPieceElement = "";
let isWhiteNext = true;
let isGodMode = false;

const whitePieceClass = "piece-white";
const blackPieceClass = "piece-black";
let isWhitePieceSelected = false;

const gridSize = 8;

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

function createBoard() {
  for (let i = 0; i < gridSize; i++) {
    const boardRow = document.createElement("div");
    boardRow.classList.add("board-row");
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

  if (validMove) {
    selectedPieceElement.classList.remove(selectedClass);
    this.children[0].classList.add(selectedClass);

    (isWhitePieceSelected ? whitePieces : blackPieces).add(nextLocation);
    (isWhitePieceSelected ? whitePieces : blackPieces).delete(previousLocation);

    if (!validMove?.toBeRemoved) {
      moveSound.play();
    }

    if (validMove?.toBeRemoved) {
      (isWhitePieceSelected ? blackPieces : whitePieces).delete(
        validMove?.toBeRemoved
      );
      const pieceToBeRemoved = findElementByDataId(validMove.toBeRemoved);
      pieceToBeRemoved.classList.remove(
        isWhiteNext ? blackPieceClass : whitePieceClass
      );
      beatSound.play();
    }

    selectedPieceElement.classList.remove("selected");
    selectedPieceElement = null;
    if (!isGodMode) {
      switchToNextOpponent();
    }
  }
}

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

function switchToNextOpponent() {
  isWhiteNext = !isWhiteNext;
  if (isWhiteNext) {
    whoIsNextInfo.innerText = "white's turn";
    whoIsNextInfo.style.color = "white";
  } else {
    whoIsNextInfo.innerText = "black's turn";
    whoIsNextInfo.style.color = "black";
  }
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
  if (isGodMode) {
    this.innerText = "ENABLE QUDAY MODE";
    this.classList.toggle("god-mode");
    switchToNextOpponent();
    godModeEnableSound.pause();
    godModeEnableSound.currentTime = 0;

    godModeDisableSound.currentTime = 0;
    godModeDisableSound.play();
    isGodMode = false;
  } else {
    this.innerText = "DISABLE QUDAY MODE";
    this.classList.toggle("god-mode");

    godModeDisableSound.pause();
    godModeDisableSound.currentTime = 0;

    godModeEnableSound.currentTime = 0;
    godModeEnableSound.play();
    isGodMode = true;
  }
}

createBoard();
jumpModeButton.addEventListener("click", handleGodMode);
