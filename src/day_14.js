import { readFile } from 'fs';

// Day 14 
// Part 1: What is the sum of all values left in memory after it completes?
// Part 2: What is the sum of all values left in memory after it completes?

readFile('./src/data/day_14_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 14:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  const input = [];
  const dataArr = data.split("\r\n"); 
  dataArr.push("mask end");  

  let program = null;
  for(let dataLine of dataArr) {
    if(dataLine.startsWith("mask")) {
      if (program) {
        input.push(program);
      }    

      const mask = dataLine.replace("mask = ", "");

      const override = mask.split("").map((item, index) => { 
        return { [parseInt(index)]: (item === "X") ? item : parseInt(item) };
      }).filter(item => Object.values(item)[0] !== "X");

      const maskOverride = Object.assign({}, ...override);
      const instructionList = [];

      program = { mask, maskOverride, instructionList };
    } else {
      const dataLineArr = dataLine.replace("mem[", "").replace("]", "").split(" = ");
      const newInstruction = { memoryAddress: parseInt(dataLineArr[0]), value: parseInt(dataLineArr[1]) };

      program["instructionList"].push(newInstruction);
    } 
  }

  return input;
}

function solvePuzzle(arr) {
  const memory = {};
 
  for(let data of arr) {
    const instructions = data["instructionList"];
    for(let item of instructions) {
      const address = item["memoryAddress"];
      const maskedItem = maskItem(data["maskOverride"], item["value"]);
      memory[address] = maskedItem;
    }
  }
  
  const memorySum = Object.values(memory).reduce((accumulator, item) => {
    return accumulator + item["maskedDecimalValue"];
  }, 0);

  return memorySum; 
}

function maskItem(maskOverride, value) {
  let bitValue = value.toString(2);
  let bit36value = bitValue.padStart(36, 0);
  let bit36valueArr = bit36value.split(""); 
  let maskedValue = bit36value;

  for(let key in maskOverride) {    
    bit36valueArr[key] = maskOverride[key];
  }

  let maskedBit36value = bit36valueArr.join("");
  let maskedDecimalValue = parseInt(maskedBit36value, 2);
  
  const result = { bit36value,  maskedValue, maskedDecimalValue}
  return result;
}

function solvePuzzle2(arr) {
  const memory = {};

  for(let data of arr) {
    const instructions = data["instructionList"];
    
    for(let item of instructions) {
      const address = item["memoryAddress"];
      const value = item["value"];
            
      const maskedItem = maskItemV2(data["mask"], address);
      const floatingBit36Values = getFloating(maskedItem, 0, "", []); 
      const floatingValues = floatingBit36Values.map(value => parseInt(value, 2)); 

      Object.assign(memory, ...floatingValues.map((address) => {      
        return {[address]: value};
      }));     
    }
  }

  const memorySum = Object.values(memory).reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);
  return memorySum; 
}

function maskItemV2(mask, value) {
  let bitValue = value.toString(2);
  let bit36value = bitValue.padStart(36, 0);
  let bit36valueArr = bit36value.split(""); 
  
  let maskArr = mask.split("");

  for(let i = 0; i < maskArr.length; i++) {    
    switch(maskArr[i]) {
      case "0":
        // Unchanged
        break;
      case "1":
        bit36valueArr[i] = 1;
        break;
      case "X":
        bit36valueArr[i] = "X";
        break;
    }   
  }

  let maskedBit36value = bit36valueArr.join("");  
  return maskedBit36value;
}

function getFloating(maskedItem, index, tempValue, values) {
  if(index === maskedItem.length) {
    values.push(tempValue);
    return;
  } else {   
    const currentChar = maskedItem.charAt(index);
    if(currentChar === 'X') {
      getFloating(maskedItem, index + 1, tempValue + "0", values);
      getFloating(maskedItem, index + 1, tempValue + "1", values);
    } else {
      getFloating(maskedItem, index + 1, tempValue + currentChar, values);
    }    
  } 

  return values;
}