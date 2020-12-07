import { readFile } from 'fs';

// Day 5:
// Part 1: What is the highest seat ID on a boarding pass?
// Part 2: What is the ID of your seat?

readFile('./src/data/day_05_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 5:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  return data.split("\r\n");
}

function solvePuzzle(arr) {
  const seatIDList = [];

  for(let code of arr) {
    seatIDList.push(getUniqueSeatId(code));
  }

  return Math.max(...seatIDList);
}

function solvePuzzle2(arr) {
  const seatIDList = [];

  for(let code of arr) {
    seatIDList.push(getUniqueSeatId(code));
  }

  const sortedList = seatIDList.sort((a,b) => a-b);
  return findSeat(sortedList);
}

function getUniqueSeatId(code) {
  // F = Lower, True
  // L = Lower, True
  const rows = (code + "").substr(0,7).split("").map(x => (x === 'F' ? true : false ));
  const columns = (code + "").substr(7,3).split("").map(x => (x === 'L' ? true : false ));;

  const row = getBinarySpacePartitionValue(0, 0, 127, rows);
  const column = getBinarySpacePartitionValue(0, 0, 7, columns);
  const seatId = row * 8 + column;

  return seatId;
}


function getBinarySpacePartitionValue(index, min, max, isLowerArr) {
  if(index === isLowerArr.length || min === max) {
    return min;
  }

  const middle = Math.floor((min + max)/2);   

  if(isLowerArr[index]) {
    return getBinarySpacePartitionValue(index + 1, min, middle, isLowerArr);
  } else {
    return getBinarySpacePartitionValue(index + 1, middle + 1, max, isLowerArr);
  }
}

function findSeat(seatIDList) {
  // const minSeatId = Math.max((0 * 8 + 0),seatIDList[0]);
  // const maxSeatId = Math.min((127 * 8 + 7), seatIDList[seatIDList.length - 1]);

  const minSeatId = seatIDList[0];
  const maxSeatId = seatIDList[seatIDList.length - 1];

  const seatIDDict = Object.assign({}, ...seatIDList.map((x) => {
    return {[x]: true};
  }));

  let seatId;
  for(let i = minSeatId; i <= maxSeatId; i++) {
    if(!seatIDDict[i]) {
      seatId = i;
    }
  }
  return seatId;
}