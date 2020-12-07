import { readFile } from 'fs';

// Day 7
// Part 1:
// Part 2:

readFile('./src/data/day_07_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 7:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  return data.split("\r\n");
}

function solvePuzzle(arr) {
  
}

function solvePuzzle2(arr) {
  
}
