import { readFile } from 'fs';

// Day 2
// Part 1: How many passwords are valid according to their policies?
// Part 2: How many passwords are valid according to the new interpretation of the policies?

readFile('./src/data/day_02_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 2:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  return data.split("\r\n");
}

function solvePuzzle(arr) {
  let validCount = 0;
  for(let item of arr) {
    if(isCompliant(item)) {
      validCount++;
    }
  }
  return validCount;
}

function isCompliant(str) {
  const strData = str.split(" ");

  // Get Boundaries
  const boundaries = strData[0].split("-");
  const min = parseInt(boundaries[0]);
  const max = parseInt(boundaries[1]);

  // Get Character
  const char = (strData[1])[0];

  // Get Password
  const pw = strData[2];

  return isValid(min, max, char, pw);
}

function isValid(min, max, char, pw) {
  const pwArr = pw.split("");
  let charCount = 0;

  for(let c of pwArr) {
    if(c === char) {
      charCount++;
    }
  }

  let isValid = false;
  if(min <= charCount && charCount <= max) {
    isValid = true;
  } 

  return isValid;
}

function solvePuzzle2(arr) {
  let validCount = 0;
  for(let item of arr) {
    if(isCompliant2(item)) {
      validCount++;
    }
  }
  return validCount;
}

function isCompliant2(str) {
  const strData = str.split(" ");

  // Get Boundaries
  const boundaries = strData[0].split("-");
  const firstPos = parseInt(boundaries[0]);
  const secondPos = parseInt(boundaries[1]);

  // Get Character
  const char = (strData[1])[0];

  // Get Password
  const pw = strData[2];

  return isValid2(firstPos, secondPos, char, pw);
}

function isValid2(firstPos, secondPos, char, pw) {
  let isValid = false;

  const first = pw[firstPos - 1];
  const second = pw[secondPos - 1];

  if((first !== second) && ( first === char || second === char )) {
    isValid = true;
  }

  return isValid;
}