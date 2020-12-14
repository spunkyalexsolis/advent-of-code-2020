import { readFile } from 'fs';

// Day 13
// Part 1:
// Part 2:

readFile('./src/data/day_13_data.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const input = readInput(data);
  const answer = solvePuzzle(input);
  const answer2 = solvePuzzle2(input);

  console.log("Day 13:");
  console.log("Puzzle 1:", answer);
  console.log("Puzzle 2:", answer2);
})

function readInput(data) {
  const dataArr = data.split("\r\n");
  const departure = parseInt(dataArr[0]);
  const busTracks = dataArr[1].split(",");
  const busIdList = busTracks.filter(item => item !== "x")
                                .map(item => parseInt(item));

  return { departure, busIdList, busTracks };
}

function solvePuzzle(data) {
  const departure = data["departure"];
  const busIdList = data["busIdList"];
  const earliestDepartureList = busIdList.map(busId => {
    const nearestLoop = Math.ceil(departure / busId);
    const earliestDeparture = nearestLoop * busId;
    return earliestDeparture;
  });

  const earliestBusIndex =  earliestDepartureList.indexOf(Math.min(...earliestDepartureList));
  const earliestBusArrival = earliestDepartureList[earliestBusIndex];
  const earliestBusId = busIdList[earliestBusIndex];

  const waitTime = earliestBusArrival - departure;  
  return waitTime * earliestBusId;
}

function solvePuzzle2(data) {
  const busTracks = data["busTracks"];
  const busList = busTracks.map((busId, index) => { return { busId , offset: index}; })
                           .filter(item => item["busId"] !== "x")
                           .map(item => { return { busId: parseInt(item["busId"]) , offset: item["offset"]}; });
  const firstBus = busList.shift(); 

  let multiplier = firstBus["busId"];
  let timestamp = 0;

  // console.log("First Bus:", firstBus);

  busList.forEach(currentBus => {    
    while(true) {      
      if((timestamp + currentBus["offset"]) % currentBus["busId"] === 0) {
        // console.log("MATCH:", currentBus, { timestamp, multiplier });
        multiplier *= currentBus["busId"];
        break;
      }
      timestamp += multiplier;
    }    
  });

  return timestamp;
}

function bruteForce(data) {
  const busTracks = data["busTracks"];
  const busIndexList = busTracks.map((item, index) => index).filter(item => busTracks[item] !== "x");

  const firstBus = busTracks[busIndexList[0]];

  let i = 0;
  let isFound = false;
  while(!isFound) {
    i++;

    // Brute Force
    const departure = firstBus * i;
    const projectedDeparture = busIndexList.map(busIndex => departure + busIndex);
    const validDepature = projectedDeparture.map((timestamp, index) => timestamp % busTracks[busIndexList[index]] === 0);
    isFound = validDepature.every(value => value === true);
  }
  
  const timestamp = firstBus*i;
  return timestamp;
}