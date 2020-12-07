import { readFile } from 'fs';

// Day 1
// Part 1: Find the two entries that sum to 2020; what do you get if you multiply them together?
// Part 2: What is the product of the three entries that sum to 2020?

readFile('./src/data/day_01_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 1:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  return data.split("\r\n").map(x => parseInt(x));
}

function solvePuzzle(arr) {
  let solution;
  const length = arr.length;

  for(let i = 0; i < length - 1; i++) {
    for(let j = i+1; j < length; j++) {

      if((arr[i] + arr[j]) === 2020) {
        // console.log("Index:",i, j);
        // console.log("Items:",arr[i], arr[j]);
        solution = arr[i] * arr[j];
        break;
      }

    }
  }

  return solution;
}

function solvePuzzle2(arr) {
  let solution;
  const length = arr.length;
  
  for(let i = 0; i < length - 2; i++) {
    for(let j = i+1; j < length - 1; j++) {
      for(let k = j+1; k < length; k++) {

        if((arr[i] + arr[j] + arr[k]) === 2020) {
          // console.log("Index:",i, j, k);
          // console.log("Items:",arr[i], arr[j], arr[k]);
          solution = arr[i] * arr[j] * arr[k];
          break;
        }

      }
    }
  }
  return solution;
}
