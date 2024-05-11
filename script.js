const GRID_SIZE = 4;
const CELL_SIZE = 110;

var canvas;
var grid;
var gameOver;
var score;
var gameWon;

scoreContainer = document.getElementById("score");

function setup() {
    canvas = createCanvas(GRID_SIZE * CELL_SIZE + 50, GRID_SIZE * CELL_SIZE + 50);
    background(187, 173, 160);
    centerCanvas(canvas);
    newGame();
    noLoop();
    updateGrid();
}

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2 + 40;
    canvas.position(x, y);
}

function windowResized() {
    centerCanvas();
}

function newGame() {
    grid = new Array(GRID_SIZE * GRID_SIZE).fill(0);
    gameOver = false;
    gameWon = false;
    score = 0;
    addRandomTile();
    addRandomTile();
}

function updateGrid() {
    displayScore();
    drawGrid();
    if (gameOver) {
        displayGameOver();
    }
    else if (gameWon) {
        displayGameWon();
    }
}

function keyPressed() {
    if (!gameOver && !gameWon) {
        switch (keyCode) {
            case UP_ARROW:
                verticalSlide(keyCode);
                updateGrid();
                break;
            case DOWN_ARROW:
                verticalSlide(keyCode);
                updateGrid();
                break;
            case RIGHT_ARROW:
                horizontalSlide(keyCode);
                updateGrid();
                break;
            case LEFT_ARROW:
                horizontalSlide(keyCode);
                updateGrid();
                break;
        }
    }
    else if (keyCode === ENTER) {
        if (gameWon) {
            location.reload();
        }
        else {
            location.reload();
        }
    }
}

function verticalSlide(direction) {
    var previousGrid = [];
    var column;
    var filler;

    arrayCopy(grid, previousGrid);

    for (var i = 0; i < GRID_SIZE; i++) {
        column = [];
        for (var j = i; j < GRID_SIZE * GRID_SIZE; j += 4) {
            column.push(grid[j]);
        }

        column = combine(column, direction);

        column = column.filter(notEmpty);

        filler = new Array(GRID_SIZE - column.length).fill(0);
        if (direction === UP_ARROW) {
            column = column.concat(filler);
        }
        else {
            column = filler.concat(column);
        }

        for (var k = 0; k < column.length; k++) {
            grid[k * GRID_SIZE + i] = column[k];
        }

        combine(column, direction);
    }
    checkSlide(previousGrid);
}

function horizontalSlide(direction) {
    var previousGrid = [];
    var row;
    var filler;

    arrayCopy(grid, previousGrid);

    for (var i = 0; i < GRID_SIZE; i++) {

        row = grid.slice(i * GRID_SIZE, i * GRID_SIZE + GRID_SIZE);

        row = combine(row, direction);

        row = row.filter(notEmpty);

        filler = new Array(GRID_SIZE - row.length).fill(0);
        if (direction === LEFT_ARROW) {
            row = row.concat(filler);
        }
        else {
            row = filler.concat(row);
        }

        grid.splice(i * GRID_SIZE, GRID_SIZE);
        grid.splice(i * GRID_SIZE, 0, ...row);
    }
    checkSlide(previousGrid);
}

function notEmpty(x) {
    return x > 0;
}

function checkSlide(previousGrid) {
    if (!(grid.every((x, i) => x === previousGrid[i]))) {
        addRandomTile();
    }
    if (!movesLeft()) {
        gameOver = true;
    }
}

function movesLeft() {
    var movesLeft = false;
    var flag = false;
    var currentTile;
    var right;
    var bottom;

    for (var i = 0; i < GRID_SIZE; i++) {
        for (var j = 0; j < GRID_SIZE; j++) {
            if (!flag) {
                currentTile = grid[i * GRID_SIZE + j];
                if (currentTile === 0) {
                    movesLeft = true;
                    flag = true;
                }
                else {
                    if (j < GRID_SIZE - 1) {
                        right = grid[i * GRID_SIZE + j + 1];
                    }
                    else {
                        right = 0;
                    }
                    if (i < GRID_SIZE - 1) {
                        bottom = grid[(i + 1) * GRID_SIZE + j];
                    }
                    else {
                        bottom = 0;
                    }
                    if (currentTile === right || currentTile === bottom) {
                        movesLeft = true;
                        flag = true;
                    }
                }
            }
        }
    }

    return movesLeft;
}

function combine(row, direction) {
    switch (direction) {
        case DOWN_ARROW:
            row = combineDownRight(row);
            break;
        case RIGHT_ARROW:
            row = combineDownRight(row);
            break;
        case UP_ARROW:
            row = combineUpLeft(row);
            break;
        case LEFT_ARROW:
            row = combineUpLeft(row);
            break;
    }

    return row;
}

function combineDownRight(row) {
    var x;
    var y;

    for (var i = row.length - 1; i > 0; i--) {
        x = row[i];
        index = i - 1;
        y = row[index];

        while (y === 0 && index > 0) {
            y = row[index--];
        }

        if (x === y && x !== 0) {
            row[i] = x + y;
            score += row[i];
            row[index] = 0;
            if (row[i] === 2048) {
                gameWon = true;
            }
        }
    }

    return row;
}

function combineUpLeft(row) {
    var x;
    var y;

    for (var i = 0; i < row.length - 1; i++) {
        x = row[i];
        index = i + 1;
        y = row[index];

        while (y === 0 && index < row.length - 1) {
            y = row[index++];
        }

        if (x === y && x !== 0) {
            row[i] = x + y;
            score += row[i];
            row[index] = 0;
            if (row[i] === 2048) {
                gameWon = true;
            }
        }
    }

    return row;
}

function addRandomTile() {
    var emptyTiles = [];
    var index;
    var newTile = [2, 4];

    grid.forEach(function(value, index) {
        if (value === 0) {
            emptyTiles.push(index);
        }
    });

    if (emptyTiles.length > 0) {
        index = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[index] = newTile[Math.floor(Math.random() * newTile.length)];
    }
}

function displayScore() {
    scoreContainer.innerHTML = `${score}`;
}

function displayGameOver() {
    displayText("Game Over!\nHit Enter to Play Again", color(119, 110, 101), 32, width / 2, height / 2);
}

function displayGameWon() {
    displayText("You Win!\nHit Enter to Play Again", color(119, 110, 101), 32, width / 2, height / 2);
}

function displayText(message, color, size, xpos, ypos) {
    textAlign(CENTER);
    textSize(size);
    fill(color);
    text(message, xpos, ypos);
}

function drawGrid() {
    var c;

    for (var i = 0; i < GRID_SIZE; i++) {
        for (var j = 0; j < GRID_SIZE; j++) {
            switch (grid[i * GRID_SIZE + j]) {
                case 0:
                    c = color("#CDC0B4");
                    break;
                case 2:
                    c = color("#EEE4DA");
                    break;
                case 4:
                    c = color("#EDE0C8");
                    break;
                case 8:
                    c = color("#B2DFDB");
                    break;
                case 16:
                    c = color("#80CBC4");
                    break;
                case 32:
                    c = color("#4DB6AC");
                    break;
                case 64:
                    c = color("#26A69A");
                    break;
                case 128:
                    c = color("#009688");
                    break;
                case 256:
                    c = color("#00897B");
                    break;
                case 512:
                    c = color("#00796B");
                    break;
                case 1024:
                    c = color("#00695C");
                    break;
                case 2048:
                    c = color("#004D40");
                    break;
            }

            fill(c);
            strokeWeight(2);
            stroke(c); 
            rect(j * CELL_SIZE + j * 10 + 10, i * CELL_SIZE + i * 10 + 10, CELL_SIZE, CELL_SIZE, 5);

            if (grid[i * GRID_SIZE + j] !== 0) {
                displayText(`${grid[i * GRID_SIZE + j]}`,
                color(255, 255, 255),
                45,
                j * CELL_SIZE + j * 10 + 10 + CELL_SIZE / 2,
                i * CELL_SIZE + i * 10 + 20 + CELL_SIZE / 2);
            }
        }
    }
}
