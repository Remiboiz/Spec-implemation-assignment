const rows = 20;
const cols = 20;

let grid = [];
let start = null;
let goal = null;

const gridDiv = document.getElementById("grid");

//create grid
function createGrid() {
    gridDiv.innerHTML = "";
    grid = [];

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");

            cell.addEventListener("click", () => handleClick(r, c, cell));

            gridDiv.appendChild(cell);
            row.push({ r, c, isWall: false, element: cell, parent: null});
        }
        grid.push(row);
    }
}

//to handle the clicks
function handleClick(r, c, cell) {
    let node = grid[r][c];

    if (!start) {
        start = node;
        cell.classList.add("start");
    } else if (!goal) {
        goal = node;
        cell.classList.add("goal");
    } else {
        node.isWall = !node.isWall;
        cell.classList.toggle("wall");
    }
}

//Bfs
async function runBFS() {
    let queue = [start];
    let visited = new Set();
    visited.add(start);

    while (queue.length > 0) {
        let current = queue.shift();

        if(current === goal) {
            drawPath(current);
            return;
        }

        let neighbors = getNeighbors(current);

        for (let n of neighbors) {
            if (!visited.has(n) && !n.isWall) {
                visited.add(n);
                n.parent = current;
                queue.push(n);

                n.element.classList.add("visited");
                await sleep(20); //animation
            }
        }
    }
}

// get neigbhors 
function getNeighbors(node) {
    let dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    let result = [];

    for (let d of dirs) {
        let nr = node.r + d[0];
        let nc = node.c + d[1];

        if (nr >= 0 && nc >= 0 && nr < rows && nc < cols) {
            result.push(grid[nr][nc]);
        }
    }
    return result;
}

//drw path
function drawPath(node) {
    while (node.parent) {
        node.element.classList.add("path");
        node = node.parent;
    }
}

//reset
function resetGrid(){
    start = null;
    goal = null;
    createGrid();
}

//delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//start
createGrid();