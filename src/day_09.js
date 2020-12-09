import { readFile } from 'fs';

// Day 9
// Part 1: What is the first number that does not have this property?
// Part 2: What is the encryption weakness in your XMAS-encrypted list of numbers?

readFile('./src/data/day_09_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 9:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  return data.split("\r\n").map(x => parseInt(x));
}

function solvePuzzle(arr) {  
  return findWeakness(arr, 25)["value"];
}

function solvePuzzle2(arr) {
  const weakness = findWeakness(arr, 25);
  const setDomain = arr.slice(0, weakness["index"]);
  
  const contiguousSet = findContiguousSet(setDomain, weakness["value"]);
 
  const min = Math.min(...contiguousSet);
  const max = Math.max(...contiguousSet);  

  const encryptionWeakness = min + max;

  return encryptionWeakness;
}

function findWeakness(arr, preamble) {
  let value;
  let index;

  for(let i = preamble; i < arr.length; i++) {
    const preambleArr = arr.slice(i - preamble, i);
    const weak = checkWeakness(preambleArr, arr[i]);

    if(weak) {
      value = arr[i];
      index = i;
      break;
    }
  } 

  return { value , index };
}

function checkWeakness(preambleArr, num) {  
  let isWeak = true;
  for(let i = 0; i < preambleArr.length; i++) {
    const diff = num - preambleArr[i];
    
    if(preambleArr.includes(diff) && diff !== num && diff !== preambleArr[i]) {
      isWeak = false;
      break;
    }
  }  
  return isWeak;
}

function findContiguousSet(domain, weakNum) {
  let solution;

  for(let start = 0; start < domain.length - 1; start++) {
    let sum = domain[start];      
    for(let end = start+1; end < domain.length; end++) {
      sum += domain[end];

      if(weakNum <= sum) {
        solution = { start, end, sum };
        break;
      }
    }

    if (solution["sum"] === weakNum) {
      break;
    }
  }

  const contiguousSet = domain.slice(solution["start"], solution["end"] + 1);
  return contiguousSet;
}