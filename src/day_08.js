import { readFile } from 'fs';

// Day 
// Part 1: What value is in the accumulator?
// Part 2: What is the value of the accumulator after the program terminates?

readFile('./src/data/day_08_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 8:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  return data.split("\r\n");
}

function solvePuzzle(arr) {
  const output = processInstructions(arr);
  return output['accumulator'];
}

function solvePuzzle2(arr) {
  let accumulator;
  
  for(let i = 0; i < arr.length; i++) {
    if(!arr[i].startsWith("acc")) {

      const swappedArr = [];
      swappedArr.push(...arr);

      if(arr[i].startsWith("nop")) {
        swappedArr[i] = swappedArr[i].replace("nop", "jmp");
      } else if (arr[i].startsWith("jmp")) {
        swappedArr[i] = swappedArr[i].replace("jmp", "nop");
      }

      const output = processInstructions(swappedArr);

      if(output['terminatesEOF']) {
        accumulator = output['accumulator'];
        break;
      }
    }
  }

  return accumulator;
}

function processInstructions(arr) {
  const history = {};
  const length = arr.length;

  let terminatesEOF = false;
  let accumulator = 0;
  let index = 0;
  while(!history.hasOwnProperty(index) && 0 <= index && index < length) {
    history[index] = true;
    const row = arr[index].split(" ");
    const command = row[0];
    const value = parseInt(row[1]);

    switch(command) {
      case "nop":
        index++;
        break;
      case "acc":  
        accumulator += value;
        index++;
        break;
      case "jmp":
        index += value;      
        break;
    }   
    
    if(length <= index) {
      terminatesEOF = true;
    }
  } 

  return  { accumulator , terminatesEOF };
}