import { readFile } from 'fs';

// Day 7
// Part 1: How many bag colors can eventually contain at least one shiny gold bag?
// Part 2: How many individual bags are required inside your single shiny gold bag?

readFile('./src/data/day_07_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const model = getModel(input);
  const answer = solvePuzzle(model);
  const answer2 = solvePuzzle2(model);

  console.log("Day 7:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  const datalines = data.split("\r\n");

  let input = {};
  for(let dataline of datalines) {
    const luggageArr = dataline.split(" contain ");
    const outermostBag = luggageArr[0].replace(" bags", "");
    if(!input[outermostBag]) {
      const insideBags = luggageArr[1].split(", ").map((item) => {
        return item.replace(" bags.", "").replace(" bag.", "").replace(" bags", "").replace(" bag", "");
      });
      input[outermostBag] = insideBags;
    }
  }

  return input;
}

function solvePuzzle(model) {
  const uniqueOuterBag = getOuterBags(model);
  return uniqueOuterBag.length;
}

function solvePuzzle2(model) {
  const count = countBags("shiny gold", model);
  return count;
}

// Generates Model { outerbag : { "A": 1, "B": 2 } }
function getModel(data) {
  const model = {};  
  for(let outerbag in data) {
    const items = Object.assign({}, ...data[outerbag].map(item => convertItem(item)));
    model[outerbag] = items;
  }
  return model;
}

function convertItem(str) {
  let item = {};
  if(str === 'no other') {
    item = {['no other']: 0};    
  } else {
    const regex = RegExp(/\d+|.+/g);
    const matches = str.match(regex);

    let count = parseInt(matches[0]);
    const color = matches[1].trim();
    item = {[color]: count};
  }
  return item;
}

function getOuterBags(model) {
  const queue = ["shiny gold"];

  const canContain = {};
  while(queue.length > 0) {
    const current = queue[0];
    const colorList = filterBags(current, model);

    for(let color of colorList) {
      if(!canContain.hasOwnProperty(color)) {
        canContain[color] = true;
      }

      if(!queue.includes(color)) {
        queue.push(color);
      }
    }
    queue.shift();    
  }
  
  return Object.keys(canContain);  
}

function filterBags(color, model) {
  let canContain = [];
  for(let outerbag in model) {
    if(Object.keys(model[outerbag]).includes(color)) {
      canContain.push(outerbag);
    }
  }
  return canContain;
}

function countBags(currentColor, model) {
  if(currentColor === 'no other') {
    return 0;
  }
  
  let sum = 0;
  const contents = model[currentColor];  
  for(let color of Object.keys(contents)) {
    sum += contents[color];
    sum += contents[color] * countBags(color, model);
  }

  return sum;
}