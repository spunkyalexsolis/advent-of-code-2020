import { readFile } from 'fs';

// Day 10
// Part 1: What is the number of 1-jolt differences multiplied by the number of 3-jolt differences?
// Part 2: What is the total number of distinct ways you can arrange the adapters to connect the charging outlet to your device?

readFile('./src/data/day_10_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 10:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  return data.split("\r\n").map(x => parseInt(x));
}

function solvePuzzle(arr) {
  const adapterdiff = { 1:0, 2:0, 3:0 }
  const sortedArr = [];
  sortedArr.push(...arr.sort((a,b) => a-b));
  
  const highestAdapter = sortedArr[sortedArr.length - 1] + 3;
  sortedArr.push(highestAdapter);

  let previousAdapter = 0;
  for(let adapter of sortedArr) {    
    const diff = adapter - previousAdapter;
    if (diff <= 3) {
      adapterdiff[diff] += 1;
    }
    previousAdapter = adapter;
  }

  return adapterdiff[1] * adapterdiff[3];
}

function solvePuzzle2(arr) {
  const consecutives = {};
  const permutation = {
    0:1,
    1:1,
    2:2,
    3:4,
    4:7,
    5:13,
    6:24
  }

  const sortedArr = [];
  sortedArr.push(...arr.sort((a,b) => a-b));

  const highestAdapter = sortedArr[sortedArr.length - 1] + 3;  
  sortedArr.unshift(0);
  sortedArr.push(highestAdapter);

  const differences = sortedArr.map((item, index) => {
    if (index === 0) {
      return 0;
    } else {
      return item - sortedArr[index - 1];
    }
  });
  differences.shift();

  let count = 0;
  for(let diff of differences) {
    if (diff === 3) {
      consecutives[count]? consecutives[count] += 1 : consecutives[count] = 1;
      count = 0;
    } else if (diff === 1) {
      count++;
    }
  }

  let total = 1;
  for(let count in consecutives) {
    total *= Math.pow(permutation[count], consecutives[count]);
  }

  return total;  
}


function bruteForce(arr) {
  const sortedArr = [];
  sortedArr.push(...arr.sort((a,b) => a-b));

  const highestAdapter = sortedArr[sortedArr.length - 1] + 3;  
  sortedArr.push(highestAdapter);

  const tempValue = [0];
  const result = [];
  const combinations = util(tempValue, sortedArr, result);
  
  return combinations.length;
}

function util(active, rest, combinations) {  
  if(active.length === 0 && rest.length === 0) {
    return;
  }

  if (rest.length === 0) {
    console.log(active);
    combinations.push(active);
  } else {
    const lastActive = active[active.length -1];

    if (rest.length > 2) {
      const secondRest = rest[2];
      if (secondRest - lastActive <= 3) {
        const newRest = [];
        newRest.push(...rest);

        const newActive = [];
        newActive.push(...active);
        newActive.push(newRest[2]);

        util(newActive, newRest.slice(3), combinations);
      }
    }
    
    if (rest.length > 1) {
      const firstRest = rest[1];
      if (firstRest - lastActive <= 3) {
        const newRest = [];
        newRest.push(...rest);

        const newActive = [];
        newActive.push(...active);
        newActive.push(newRest[1]);

        util(newActive, newRest.slice(2), combinations);
      }
    }

    active.push(rest[0]);
    util(active,rest.slice(1), combinations);
  }

  return combinations;
}