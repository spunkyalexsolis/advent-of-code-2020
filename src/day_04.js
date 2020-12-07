import { readFile } from 'fs';

// Day 4
// Part 1: In your batch file, how many passports are valid?
// Part 2: In your batch file, how many passports are valid?

readFile('./src/data/day_04_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 4:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  let input = [];

  const dataArr = data.split("\r\n");
  dataArr.push("");

  let item = [];
  for(let row of dataArr) {
    if(row.length > 0) {
      item = item.concat(row.split(" "));
    } else {
      input.push(item);
      item = [];
    }
  }

  return input;
}

function solvePuzzle(items) {
  let validCount = 0;

  for(let item of items) {
    const dictionary = Object.assign({}, ...item.map((x) => {
      const pair = x.split(":");
      return {[pair[0]]: pair[1]};
    }));

    if(dictionary.hasOwnProperty("byr") && 
      dictionary.hasOwnProperty("iyr") &&
      dictionary.hasOwnProperty("eyr") &&
      dictionary.hasOwnProperty("hgt") &&
      dictionary.hasOwnProperty("hcl") &&
      dictionary.hasOwnProperty("ecl") &&
      dictionary.hasOwnProperty("pid")    
    )
    {
      validCount++;
    }
  }

  return validCount;
}

function solvePuzzle2(items) {
  let validCount = 0;

  for(let item of items) {
    const dictionary = Object.assign({}, ...item.map((x) => {
      const pair = x.split(":");
      return {[pair[0]]: pair[1]};
    }));
   
    if(dictionary.hasOwnProperty("byr") && isValidBirthYear(dictionary["byr"]) &&   
      dictionary.hasOwnProperty("iyr") && isValidIssueYear(dictionary["iyr"]) &&   
      dictionary.hasOwnProperty("eyr") && isValidExpirationYear(dictionary["eyr"]) &&   
      dictionary.hasOwnProperty("hgt") && isValidHeight(dictionary["hgt"]) &&   
      dictionary.hasOwnProperty("hcl") && isValidHairColor(dictionary["hcl"]) &&   
      dictionary.hasOwnProperty("ecl") && isValidEyeColor(dictionary["ecl"]) &&   
      dictionary.hasOwnProperty("pid") && isValidPassportID(dictionary["pid"])   
    )
    {
      validCount++;
    }    
  }  

  return validCount;
}

function isValidBirthYear(input) {
  let isValid = false;

  try {
    const year = parseInt(input);
    if(1920 <= year && year <= 2002) {
      isValid = true;
    }

  } catch(e) {
    console.log(e);
  } 

  return isValid;
}

function isValidIssueYear(input) {
  let isValid = false;

  try {
    const year = parseInt(input);
    if(2010 <= year && year <= 2020) {
      isValid = true;
    }

  } catch(e) {
    console.log(e);
  } 

  return isValid;
}

function isValidExpirationYear(input) {
  let isValid = false;

  try {
    const year = parseInt(input);
    if(2020 <= year && year <= 2030) {
      isValid = true;
    }

  } catch(e) {
    console.log(e);
  } 
 
  return isValid;
}

function isValidHeight(input) {
  let isValid = false;

  const regex = RegExp(/^\d+(in|cm)$/);
  isValid = regex.test(input);

  if(isValid) {
    isValid = false;
    const regexSplit = RegExp(/in|cm|\d+/g);
    const arr = input.match(regexSplit);

    let min = 0;
    let max = 0;

    if(arr[1] === "cm") {
      min = 150;
      max = 193;
    } else if (arr[1] === "in") {
      min = 59;
      max = 76;
    }
  
    try {
      const height = parseInt(arr[0]);
      if(min <= height && height <= max) {
        isValid = true;
      }  
    } catch(e) {
      console.log(e);
    } 
  }

  return isValid;
}

function isValidHairColor(input) {
  let isValid = false;

  const regex = RegExp(/^\#[0-9abcdef]{6}$/);
  isValid = regex.test(input);

  return isValid;
}

function isValidEyeColor(input) {
  let isValid = false;

  const colors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
  if(colors.includes(input)) {
    isValid = true;
  }
  
  return isValid;
}

function isValidPassportID(input) {
  let isValid = false;
  
  const regex = RegExp(/^[0-9]{9}$/);
  isValid = regex.test(input);

  return isValid;
}