const map = [
    "▓▓▓▓▓▓▓▓",
    "▓▓▓░░░▓▓",
    "▓OSB░░▓▓",
    "▓▓▓░BO▓▓",
    "▓O▓▓B░▓▓",
    "▓░▓░O░▓▓",
    "▓B░XBBO▓",
    "▓░░░O░░▓",
    "▓▓▓▓▓▓▓▓"
];

// const map2MapHarder = [
//     "░░░░▓▓▓▓▓░░░░░░░░░░",
//     "░░░░▓░░░▓░░░░░░░░░░",
//     "░░░░▓B░░▓░░░░░░░░░░",
//     "░░▓▓▓░░B▓▓░░░░░░░░░",
//     "░░▓░░B░B░▓░░░░░░░░░",
//     "▓▓▓░▓░▓▓░▓░░░▓▓▓▓▓▓",
//     "▓░░░▓░▓▓░▓▓▓▓▓░░OO▓",
//     "▓░B░░B░░░░░░░░░░OO▓",
//     "▓▓▓▓▓░▓▓▓░▓S▓▓░░OO▓",
//     "░░░░▓░░░░░▓▓▓▓▓▓▓▓▓",
//     "░░░░▓▓▓▓▓▓▓░░░░░░░░"
// ];

const wallBlock = "▓";
const spaceBlock = "░";
const startPosition = "S";
const boxItem = "B";
const openStorage = "O";
const filledStorage = "X";

const newMap = [];
let player = undefined;
const destination = document.getElementById("map");
const boxDestination = document.getElementById("box");

for (let i = 0; i < map.length; i++) {
    let mapCol = map[i];
    let newCol = mapCol.split("");
    newMap.push(newCol);
}

for (let rowIndex = 0; rowIndex < newMap.length; rowIndex++) {
    let mapRow = newMap[rowIndex];
    const rowDiv = document.createElement("div");
    rowDiv.className = "row";
    rowDiv.id = "row-" + rowIndex;

    for (let colIndex = 0; colIndex < mapRow.length; colIndex++) {
        const cell = document.createElement("div");
        cell.dataset.rowIndex = rowIndex;
        cell.dataset.colIndex = colIndex;
        cell.className = "cell";
        cell.id = "col-" + colIndex;

        if (mapRow[colIndex] === wallBlock) {
            cell.dataset.type = "wall";
            cell.classList.add("wall");
        } else if (mapRow[colIndex] === spaceBlock) {
            cell.dataset.type = "floor";
            cell.classList.add("floor");
        } else if (mapRow[colIndex] === startPosition) {
            cell.dataset.type = "floor";
            cell.classList.add("floor");
            cell.id = "start";
        } else if (mapRow[colIndex] === boxItem) {
            cell.dataset.type = "floor";
            cell.classList.add("floor");
            addBox(cell);
        } else if(mapRow[colIndex] === openStorage) {
            cell.dataset.type = "storage";
            cell.classList.add("storage");
        } else if(mapRow[colIndex] === filledStorage) {
            cell.dataset.type = "storage";
            cell.classList.add("storage");
            addFullBox(cell);
        }
        rowDiv.appendChild(cell);
    }
    destination.appendChild(rowDiv);
}

function setStart() {
    const playerDestination = document.getElementById("start");
    player = document.createElement("div");
    player.id = "player";
    playerDestination.appendChild(player);
}

function addBox(cell) {
    const box = document.createElement("div");
    box.classList.add("boxes");
    cell.appendChild(box);
}

function addFullBox(cell) {
    const completed = document.createElement("div");
    completed.classList.add("completed");
    cell.appendChild(completed);
}

setStart();

function findNextCell (cell, rowOffset, columnOffset) {
    const targetRowIndex = Number(cell.dataset.rowIndex) + rowOffset;
    const targetColIndex = Number(cell.dataset.colIndex) + columnOffset;

    const rowSelector = "[data-row-index='" + targetRowIndex + "']";
    const colSelector = "[data-col-index='" + targetColIndex + "']";
    const targetCell = document.querySelector(rowSelector + colSelector);

    return targetCell;
}

function winner() {
    let wins = document.querySelectorAll(".completed").length;
    if (wins === 7) {
        let winMessage = document.createElement("h2");
        winMessage.textContent = "You Win";
        document.body.appendChild(winMessage);
    }
}

document.addEventListener("keydown", (event) => {
    let targetCell;
    let followingCell;

    if (event.key === "ArrowUp") {
        targetCell = findNextCell(player.parentElement, -1, 0);
        followingCell = findNextCell(targetCell, -1, 0);
    } else if (event.key === "ArrowDown") {
        targetCell = findNextCell(player.parentElement, +1, 0);
        followingCell = findNextCell(targetCell, +1, 0);
    } else if (event.key === "ArrowLeft") {
        targetCell = findNextCell(player.parentElement, 0, -1);
        followingCell = findNextCell(targetCell, 0, -1);
    } else if (event.key === "ArrowRight") {
        targetCell = findNextCell(player.parentElement, 0, +1);
        followingCell = findNextCell(targetCell, 0, +1);
    }
    
    const targetHasBox = targetCell.childElementCount > 0;
    const followingHasBox = followingCell.childElementCount > 0;

    if(targetCell.className === "cell floor") {
        if (!targetHasBox) {
            targetCell.appendChild(player);
        } else if (targetHasBox) {
            if (followingCell.className === "cell floor") {
                if (followingCell.childElementCount === 0) {
                    followingCell.appendChild(targetCell.firstElementChild);
                    targetCell.appendChild(player);
                }
            } else if (followingCell.className === "cell storage") {
                if (!followingHasBox) {
                    const boxes = targetCell.firstElementChild;
                    followingCell.appendChild(boxes);
                    boxes.classList.remove("boxes");
                    boxes.classList.add("completed");
                    targetCell.appendChild(player);
                }
            }
        }
    } else if (targetCell.className === "cell storage") {
        if (!targetHasBox) {
            targetCell.appendChild(player);
        } else if (targetHasBox) {
            if (followingCell.className === "cell floor") {
                if (!followingHasBox) {
                    const boxes = targetCell.firstElementChild;
                    followingCell.appendChild(boxes);
                    boxes.classList.remove("completed");
                    boxes.classList.add("boxes");
                    targetCell.appendChild(player);
                }
            }
        }
    }
    winner();
})