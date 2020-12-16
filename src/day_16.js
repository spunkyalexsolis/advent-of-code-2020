import { readFile } from 'fs';

// Day 16
// Part 1: What is your ticket scanning error rate?
// Part 2: What do you get if you multiply those six values together?

readFile('./src/data/day_16_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 16:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

class Ticket {
  fields = {};
  yourTicket = [];
  nearbyTickets = [];
} 

class Range {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  min;
  max;
}

function readInput(data) {
  let input = new Ticket();

  const dataArr = data.split("\r\n");

  let inputType = "fields";
  for(let dataLine of dataArr) {
    if(dataLine.startsWith("your ticket"))  {
      inputType = "yourTicket";
    } else if (dataLine.startsWith("nearby tickets")) {
      inputType = "nearbyTickets";
    } else if (dataLine) {
      switch(inputType) {
        case "fields":
          const fieldSplit = dataLine.split(": ");
          const fieldName = fieldSplit[0];
          const fieldRanges = fieldSplit[1].split(" or ").map(range => {
            const values = range.split("-");
            const newRange = new Range(parseInt(values[0]), parseInt(values[1]));
            return newRange;
          });
          input.fields[fieldName] = fieldRanges;
          break;
        case "yourTicket":
          input.yourTicket = dataLine.split(",").map(x => parseInt(x));
          break;
        case "nearbyTickets":
          const ticket = dataLine.split(",").map(x => parseInt(x));
          input.nearbyTickets.push(ticket);
          break;
      }
    }  
  }

  return input;
}

function solvePuzzle(data) {
  return scanTickets(data)["errorRate"];  
}

function solvePuzzle2(data) {
  // Scan Tickets and Get all Valid Tickets
  const scanResults = scanTickets(data);
  
  // Match each column With fields that they satisfy
  const columnDetails = matchColumnToInRangeFields(scanResults, data);  
  columnDetails.sort((a,b) => a["length"] - b["length"]);

  // Map each fields based on the available satisfying fields in order of length
  const fieldDict = getFieldMapping(columnDetails);

  // Compute for Departure Fields Product
  const result = getDepartureProductValue(fieldDict, data.yourTicket);
  return result;
}

function scanTickets(data) {
  let validTickets = [];
  let invalidTicketValues = [];
  let rangeList = [];
  Object.values(data.fields).forEach(rangeArr => rangeList.push(...rangeArr));

  for(let ticket of data.nearbyTickets) {
    const invalidValues = getInvalidValues(ticket, rangeList);
    invalidTicketValues.push(...invalidValues);

    if(invalidValues.length === 0) {
      validTickets.push(ticket);
    }
  } 

  validTickets.unshift(data.yourTicket);
  const errorRate = invalidTicketValues.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);
  return { errorRate, invalidTicketValues, validTickets };
}

function getInvalidValues(ticket, rangeList) {
  let invalidValues = [];

  const checkTicketValues = ticket.map(value => {
    const checkRange = rangeList.map(range => range.min <= value && value <= range.max);
    const isValid = checkRange.some(item => item === true);
    return isValid;
  });
  
  for(let i = 0; i < checkTicketValues.length; i++) {
    if(!checkTicketValues[i]) {
      invalidValues.push(ticket[i]);
    }
  } 

  return invalidValues;
}


function matchColumnToInRangeFields(scanResults, data) {
  const columnDetails = [];
  const validTickets = scanResults["validTickets"];

  // Get possible fields for each column data that can be valid
  for(let i=0; i < data.yourTicket.length; i++) {
    const columnData = validTickets.map(ticketData => ticketData[i]);
    const matchingColumns = getMatchingFields(columnData, data.fields);
    columnDetails.push({ index:i, length: matchingColumns.length, matchingColumns });
  }  

  return columnDetails;
}

function getMatchingFields(columnData, fields) {
  let matchingColumns = [];
  for(let key in fields) {
    const isMatchingFields = columnData.map(value => {

      // Validate Each Column Data Value To The Range Available
      const ranges = fields[key];      
      const isWithinRange = ranges.map(range => range.min <= value && value <= range.max);

      // Column Data Is Within any of the Ranges of that Field
      return isWithinRange.some(value => value === true);
    });

    // Fields is a possible match only when ALL column data is within range
    const isMatching = isMatchingFields.every(value => value === true);

    if(isMatching) {
      matchingColumns.push(key);
    }
  }

  return matchingColumns;
}

function getFieldMapping(columnDetails) {
  let fieldDict = {};

  for(let column of columnDetails) {
    const matchingColumns = column["matchingColumns"];
    for(let field of matchingColumns) {
      if(!fieldDict.hasOwnProperty(field)) {
        fieldDict[field] = column["index"];
        break;  
      }
    }    
  }

  return fieldDict;
}

function getDepartureProductValue(fieldDict, yourTicket) {
  let product = 1;
  for(let key in fieldDict) {
    if(key.startsWith("departure")) {
      product *= yourTicket[fieldDict[key]];
    }
  }
  return product;
}