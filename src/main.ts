import { Guard } from "./Guard.ts";
import { Prison } from "./Prison.ts";
import { Config } from "./Config.ts";
import { Strategy } from "./Strategy.ts";

const simulate = (run: number, strategy: Strategy) => {
  // create prison with inmates
  const prison = new Prison(config.PROBLEM_COUNT);

  // create guard to setup problem and supervise inmates
  const guard = new Guard();

  // create sheets, shuffle and distribute them into boxes
  const sheets = guard.createNumberSheets(config.PROBLEM_COUNT);
  guard.shuffleSheets(sheets);
  guard.distributeSheets(sheets, prison.room);

  // set the strategy
  prison.inmates.forEach((inmate) => {
    inmate.useStrategy(strategy);
  });

  // execute the strategy for each inmate
  const result = prison.inmates.map((inmate) =>
    guard.superviseBoxOpening(prison.room, inmate)
  );

  // calculate the amount of fails and successes
  const fails = result.reduce((acc, success) => (success ? acc : acc + 1), 0);
  const sucesses = config.PROBLEM_COUNT - fails;

  console.info(`${run} Stats:\nSuccess => ${sucesses}\nFails => ${fails}\n`);

  return fails / config.PROBLEM_COUNT;
};

// load args from cli
const config = new Config();

// current simulation running
let runNumber = 0;

// Overall Failrate of each inmate
let overallFailRate = 0;

// Overall Fail count
let overallFails = 0;

while (runNumber < config.SIMULATION_COUNT) {
  runNumber = runNumber + 1;

  const failRate = simulate(runNumber, config.STRATEGY);

  overallFailRate = overallFailRate + failRate;

  if (failRate > 0) {
    overallFails = overallFails + 1;
  }
}

console.log("Fail Rate per Inmate:", overallFailRate / config.SIMULATION_COUNT);

console.log("Overall Fail Rate:", overallFails / config.SIMULATION_COUNT);
