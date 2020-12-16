import { readFile } from 'fs';

// Day 15 
// Part 1: What will be the 2020th number spoken?
// Part 2: What will be the 30000000th number spoken?

readFile('./src/data/day_15_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 15:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  return data.split(",").map(x => parseInt(x));
}

function solvePuzzle(data) {
  return playGame(data, 2020);  
}

function solvePuzzle2(data) {
  return playGame(data, 30000000);  
}

function playGame(data, turns) {

  const lastSpokenDict = {};
  let lastSpoken;

  for(let i = 1; i <= turns; i++) {  
    // Just to check where it is at.
    if(i % 1000000 === 0) {
      console.log(i);
    }
    
    if(i <= data.length) {
      const value = data[i-1];
      lastSpokenDict[value] = [];
      lastSpokenDict[value].unshift(i);
      lastSpoken = value;    
    } else {
      let value;

      if(lastSpokenDict.hasOwnProperty(lastSpoken)) {
        const lastSpokenIndexes = lastSpokenDict[lastSpoken];
        if(lastSpokenIndexes.length > 1) {
          value = lastSpokenIndexes[0] - lastSpokenIndexes[1];
        } else {
          value = 0;
        }
      } 

      if(!lastSpokenDict.hasOwnProperty(value)) {
        lastSpokenDict[value] = [];
      }
        
      lastSpokenDict[value].unshift(i);
      if(lastSpokenDict[value].length > 2) {
        lastSpokenDict[value].pop();
      }
      lastSpoken = value;   
    }
  }

  return lastSpoken;
}
