import { readFile } from 'fs';

// Day 3
// Part 1: How many trees would you encounter?
// Part 2: What do you get if you multiply together the number of trees encountered on each of the listed slopes?

readFile('./src/data/day_03_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 3:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  return data.split("\r\n");
}

function solvePuzzle(arr) {
  return countTrees(arr,3,1);
}

function solvePuzzle2(arr) {
  const slopeStops = [];
  slopeStops.push(countTrees(arr,1,1));
  slopeStops.push(countTrees(arr,3,1));
  slopeStops.push(countTrees(arr,5,1));
  slopeStops.push(countTrees(arr,7,1));
  slopeStops.push(countTrees(arr,1,2));  

  let productSlopStops = 1;
  for(let trees of slopeStops) {
    productSlopStops *= trees;
  }

  return productSlopStops;
}

function countTrees(arr, rightMovement, downMovement) {
  const rowLength = arr[0].length;
  let position = 0;

  let treeCount = 0;
  for(let row = 0; row < arr.length; row += downMovement) {
    const geo = arr[row];
    const newPosition = position % rowLength;
    if(geo[newPosition] === "#") {
      treeCount++;
    }
    position += rightMovement;
  }

  return treeCount;
}