import { readFile } from 'fs';

// Day 6
// Part 1: What is the sum of those counts?
// Part 2: What is the sum of those counts?

readFile('./src/data/day_06_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 6:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
    let input = [];

    const dataArr = data.split("\r\n");
    dataArr.push("");

    let item = [];
    for(let row of dataArr) {
        if(row && row.length > 0) {
            item = item.concat(row);
        } else {
            input.push(item);
            item = [];
        }
    }

    return input;
}

function solvePuzzle(arr) {
    const uniqueAnswers = arr.map((item) => Object.keys(getUniqueValues(item.join(""))));
    const uniqueAnswerCount = uniqueAnswers.map((item) => item.length);
    const sumCount = uniqueAnswerCount.reduce((a,b) => a + b, 0);
    return sumCount;
}

function solvePuzzle2(arr) {
    const uniqueAnswers = arr.map((item) => getUniqueValues(item.join("")));
    const sharedAnswers = uniqueAnswers.map((item,index) => {
        const keys = Object.keys(item);
        const groupCount = arr[index].length;
        return keys.filter(key => item[key] === groupCount);
    });
    const sharedCount = sharedAnswers.map((item) => item.length);
    const sumCount = sharedCount.reduce((a,b) => a + b, 0);

    return sumCount;
}

function getUniqueValues(answerStr) {
    const dict = {};

    const answers = answerStr.split("");    
    for(let char of answers) {
        if(dict[char]) {
            dict[char] += 1;
        } else {
            dict[char] = 1;
        }
    }

    return dict;
}