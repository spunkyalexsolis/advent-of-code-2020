import { readFile } from 'fs';

// Day 12
// Part 1: What is the Manhattan distance between that location and the ship's starting position?
// Part 2: What is the Manhattan distance between that location and the ship's starting position?

readFile('./src/data/day_12_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 12:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  let input = [];

  const arr = data.split("\r\n");
  input = arr.map(row => {
    return {
      action: row.charAt(0),
      value: parseInt(row.slice(1))
    }
  })
  return input;
}

function solvePuzzle(data) {  
  return evasiveManuever(data, false);
}

function solvePuzzle2(data) {  
  return evasiveManuever(data, true);
}

const Direction = {
  EAST: 0,
  NORTH: 90,
  WEST: 180,
  SOUTH: 270
}

// Quadrant 0 is same as Quadrant 4 in MOD 4
const Quadrant = {
  0: { x: 1, y: -1}, 
  1: { x: 1, y: 1},
  2: { x: -1, y: 1},
  3: { x: -1, y: -1},
}

function evasiveManuever(actions, useWaypoint) {
  let movementHistory = [];
  let currentDirection = Direction.EAST;

  if (useWaypoint) {
    movementHistory.push({ moveX: 0 , moveY: 0, posX: 0, posY: 0, waypointX: 10, waypointY: 1, direction: currentDirection });
  }

  for(let item of actions) {
    if (useWaypoint) {
      doActionWithWaypoint(item, currentDirection, movementHistory);
    } else {
      doAction(item, currentDirection, movementHistory);
    }
    const lastAction = movementHistory[0];
    currentDirection = lastAction["direction"];
  }  

  const finalPosition = movementHistory[0];
  const manhattanDistance = Math.abs(finalPosition["posX"]) + Math.abs(finalPosition["posY"]);

  return manhattanDistance;
}

function doAction(item, currentDirection, movementHistory) {
  let moveX = 0;
  let moveY = 0;
  let posX = movementHistory[0] ? movementHistory[0]["posX"] : 0;
  let posY = movementHistory[0] ? movementHistory[0]["posY"] : 0;

  let value = item["value"];
  switch(item["action"]) {
    case "N":
      moveY = value;
      break;
    case "S":
      moveY = value * -1;
      break;
    case "E":
      moveX = value;
      break;
    case "W":
      moveX = value * -1;
      break;     
    case "L":
    case "R":
      value = (item["action"] === "R") ? 360 - value : value;
      currentDirection = (currentDirection + value)%360;
      break; 
    case "F":
      if(currentDirection === Direction.WEST || currentDirection === Direction.SOUTH) {
        value *= -1;
      }

      if(currentDirection === Direction.WEST || currentDirection === Direction.EAST) {
        moveX = value;
      } else {
        moveY = value;
      }
      break; 
  }

  posX += moveX;
  posY += moveY;

  const movement = { moveX, moveY, posX, posY, direction: currentDirection, item };
  movementHistory.unshift(movement);
}

function doActionWithWaypoint(item, currentDirection, movementHistory) {
  let moveX = 0;
  let moveY = 0;
  let waypointX = movementHistory[0] ? movementHistory[0]["waypointX"] : 0;
  let waypointY = movementHistory[0] ? movementHistory[0]["waypointY"] : 0;
  let posX = movementHistory[0] ? movementHistory[0]["posX"] : 0;
  let posY = movementHistory[0] ? movementHistory[0]["posY"] : 0;

  let value = item["value"];
  switch(item["action"]) {
    case "N":
      waypointY += value;
      break;
    case "S":
      waypointY += value * -1;
      break;
    case "E":
      waypointX += value;
      break;
    case "W":
      waypointX += value * -1;
      break;     
    case "L":      
    case "R":
      value = (item["action"] === "R") ? 360 - value : value;
      const newDirection = (currentDirection + value)%360;
      const newWayPointCoordinates = getNewWaypoint(currentDirection, newDirection, waypointX, waypointY);

      // console.log(item, currentDirection, newDirection, { waypointX, waypointY } , newWayPointCoordinates);

      currentDirection = newDirection;
      waypointX = newWayPointCoordinates["newWaypointX"];
      waypointY = newWayPointCoordinates["newWaypointY"];
      break; 
    case "F":
      moveX = value * waypointX;
      moveY = value * waypointY;
      break; 
  }

  posX += moveX;
  posY += moveY;

  const movement = { moveX, moveY, posX, posY, waypointX, waypointY, direction: currentDirection, item };
  movementHistory.unshift(movement);
}

function getNewWaypoint(currentDirection, newDirection, waypointX, waypointY) {
  let newWaypointX = waypointX;
  let newWaypointY = waypointY;

  let tempDirection = currentDirection;
  while(tempDirection !== newDirection) {
    tempDirection = (tempDirection + 90)%360;

    let newQuadrant = (getQuadrant(newWaypointX,newWaypointY) + 1)%4;

    let tempWayPoint = newWaypointX;
    newWaypointX = Math.abs(newWaypointY) * Quadrant[newQuadrant]["x"];
    newWaypointY = Math.abs(tempWayPoint) * Quadrant[newQuadrant]["y"];
  }

  return { newWaypointX, newWaypointY }
}

function getQuadrant(x,y) {
  let quadrant = 0;
  if(0 < x && 0 <= y) {
    quadrant = 1;
  } else if (x <= 0 && y > 0) {
    quadrant = 2;
  } else if (x < 0 && y <= 0) {
    quadrant = 3;
  } else {
    quadrant = 4;
  }

  return quadrant;
}