import {News} from "./js/News.js";
import {Schedule} from "./js/Schedule.js";

console.log("Fetching News...");
await News.Fetch();

console.log("Fetching schedule...");
await Schedule.Fetch();

console.log("Done!");