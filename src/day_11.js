import { match } from 'assert';
import { readFile } from 'fs';

// Day 11
// Part 1: How many seats end up occupied?
// Part 2: How many seats end up occupied?

readFile('./src/data/day_11_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 11:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  return data;
}

function solvePuzzle(data) {
  return runProgram(data, 1);
}

function solvePuzzle2(data) {
  return runProgram(data, 2);
}

// Program Methods
// --------------------------------------------------------------
function runProgram(data, puzzle) {
  let prev = null;
  let current = data;

  let i = 0;
  while(!isGridSame(prev, current)) {    
    prev = current;
    current = applyRules(current, puzzle);
    i++;
  } 
      
  const count = getOccupiedSeatCount(current);
  return count;
}

function isGridSame(prev, current) {
  let isSame = false;

  if(prev && current) {
    const prevArr = prev.split("\r\n");
    const currentArr = current.split("\r\n");
    const match = prevArr.map((row,index) => row === currentArr[index]);
    isSame = match.every((value) => value === true);
  }

  return isSame;
}

function getOccupiedSeatCount(data) {
  const regex = new RegExp(/\#/g);
  const matches = data.match(regex) || [];
  return matches.length;
}

// Rules Methods
// --------------------------------------------------------------
function applyRules(data, puzzle) {
  const arr = data.split("\r\n");
  const grid = arr.map(item => item.split(""));
  const workingGrid = arr.map(item => item.split(""));

  const colLength = grid[0].length;
  const rowLength = grid.length;

  for(let row = 0; row < rowLength; row++) {
    for(let col = 0; col < colLength; col++) {    
      let occupiedState = {};
      let maxOccupied = 0;

      // Determine Which Rules Applied
      if(puzzle === 1) {
        occupiedState = getOccupiedState(grid, row, col);
        maxOccupied = 4;
      } else if (puzzle === 2) {
        occupiedState = getRangedOccupiedState(grid, row, col);
        maxOccupied = 5;
      }

      let occupied = 0;
      for(let isOccupied of Object.values(occupiedState)) {
        if(isOccupied) {
          occupied++;
        }
      }

      if (grid[row][col] === "L" && occupied === 0) { 
        workingGrid[row][col] ="#";
      } else if (grid[row][col] === "#" && occupied >= maxOccupied) {
        workingGrid[row][col] ="L";
      }           
    }
  }

  const layout = workingGrid.map(item => item.join("")).join("\r\n");
  return layout;
}

function getOccupiedState(grid, row, col) {
  const colLength = grid[0].length;
  const rowLength = grid.length;

  const inRange = {
    topLeft:      (row > 0 && col > 0),
    top:          (row > 0),
    topRight:     (row > 0 && col < colLength - 1),
    left:         (col > 0),
    right:        (col < colLength - 1),
    bottomLeft:   (row < rowLength - 1 && col > 0),
    bottom:       (row < rowLength - 1),
    bottomRight:  (row < rowLength - 1 && col < colLength - 1)
  }

  const occupied = {
    topLeft:      inRange["topLeft"] ?      isOccupied(grid, row - 1, col - 1) : false,
    top:          inRange["top"] ?          isOccupied(grid, row - 1, col) : false,
    topRight:     inRange["topRight"] ?     isOccupied(grid, row - 1, col + 1) : false,
    left:         inRange["left"] ?         isOccupied(grid, row, col - 1) : false,
    right:        inRange["right"] ?        isOccupied(grid, row, col + 1) : false,
    bottomLeft:   inRange["bottomLeft"] ?   isOccupied(grid, row + 1, col - 1) : false,
    bottom:       inRange["bottom"] ?       isOccupied(grid, row + 1, col) : false,
    bottomRight:  inRange["bottomRight"] ?  isOccupied(grid, row + 1, col + 1) : false
  }   

  return occupied;
}

function getRangedOccupiedState(grid, row, col) {
  const colLength = grid[0].length;
  const rowLength = grid.length;

  const inRange = {
    topLeft:      (row > 0 && col > 0),
    top:          (row > 0),
    topRight:     (row > 0 && col < colLength - 1),
    left:         (col > 0),
    right:        (col < colLength - 1),
    bottomLeft:   (row < rowLength - 1 && col > 0),
    bottom:       (row < rowLength - 1),
    bottomRight:  (row < rowLength - 1 && col < colLength - 1)
  }

  const vs = {
    topLeft:      inRange["topLeft"] ?      getVisibleSeat(grid, row, col, -1, -1): undefined,
    top:          inRange["top"] ?          getVisibleSeat(grid, row, col, -1, 0): undefined,
    topRight:     inRange["topRight"] ?     getVisibleSeat(grid, row, col, -1, 1): undefined,
    left:         inRange["left"] ?         getVisibleSeat(grid, row, col, 0, -1): undefined,
    right:        inRange["right"] ?        getVisibleSeat(grid, row, col, 0, 1): undefined,
    bottomLeft:   inRange["bottomLeft"] ?   getVisibleSeat(grid, row, col, 1, -1): undefined,
    bottom:       inRange["bottom"] ?       getVisibleSeat(grid, row, col, 1, 0): undefined,
    bottomRight:  inRange["bottomRight"] ?  getVisibleSeat(grid, row, col, 1, 1): undefined
  }  

  const occupied = {
    topLeft:      isDefined(vs,"topLeft") ?       isRangedOccupied(grid, vs["topLeft"]) : false,
    top:          isDefined(vs,"top") ?           isRangedOccupied(grid, vs["top"]) : false,
    topRight:     isDefined(vs,"topRight") ?      isRangedOccupied(grid, vs["topRight"]) : false,
    left:         isDefined(vs,"left") ?          isRangedOccupied(grid, vs["left"]) : false,
    right:        isDefined(vs,"right") ?         isRangedOccupied(grid, vs["right"]) : false,
    bottomLeft:   isDefined(vs,"bottomLeft") ?    isRangedOccupied(grid, vs["bottomLeft"]) : false,
    bottom:       isDefined(vs,"bottom") ?        isRangedOccupied(grid, vs["bottom"]) : false,
    bottomRight:  isDefined(vs,"bottomRight") ?   isRangedOccupied(grid, vs["bottomRight"]) : false
  } 
 
  return occupied;
}

function getVisibleSeat(grid, row, col, moveX, moveY) {
  const colLength = grid[0].length;
  const rowLength = grid.length;

  let newRow = row;
  let newCol = col;
  let value;
  
  do {
    newRow += moveX;
    newCol += moveY;  

    if(inDataRange(newRow, 0, rowLength - 1) && inDataRange(newCol, 0, colLength - 1)) {
      value = grid[newRow][newCol];
    } else {    
      value = undefined; 
      break;
    }
  } while(grid[newRow][newCol] === ".")

  return { row: newRow, col: newCol, value };
}

// Utilities Methods
// --------------------------------------------------------------
function isDefined(vs, position) {
  return vs[position] && vs[position]["value"];
}

function isRangedOccupied(grid, seat) {
  return isOccupied(grid, seat["row"], seat["col"]); 
}

function isOccupied(grid, row, col) {
  return grid[row][col] === "#";
}

function inDataRange(value, min, max) {
  return min <= value && value <= max;
}