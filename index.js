import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import { format } from 'date-fns';

const path = "./data.json";

const isValidDate = (date) => {
  const now = format(new Date(), 'yyyy-MM-dd');
  const startDate = moment("2023-01-01");
  const endDate = moment(now);
  return date.isBetween(startDate, endDate, null, "[]");
};


const markCommit = async (date) => {
  const data = { date: date.toISOString() };
  await jsonfile.writeFile(path, data);

  const git = simpleGit();
  await git.add([path]);
  await git.commit(date.toISOString(), { "--date": date.toISOString() });
};

const makeCommits = async (n) => {
  const git = simpleGit();

  for (let i = 0; i < n; i++) {
    const randomWeeks = random.int(0, 54 * 2);
    const randomDays = random.int(0, 6);

    const randomDate = moment("2023-01-01")
      .add(randomWeeks, "weeks")
      .add(randomDays, "days");

    if (isValidDate(randomDate)) {
      console.log(`Creating commit: ${randomDate.toISOString()}`);
      await markCommit(randomDate);
    } else {
      console.log(`Invalid date: ${randomDate.toISOString()}, skipping...`);
    }
  }

  console.log("Pushing all commits...");
  await git.push();
};

makeCommits(20000);