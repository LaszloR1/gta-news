import {writeFileSync, readdirSync, readFileSync} from "node:fs";

let folder = "article"
let articles = readdirSync(`./${folder}`);

for (const article of articles) {
    let files = readdirSync(`./${folder}/${article}`).filter(f => f.endsWith(".json"));

    for (const file of files) {
        let location = `./${folder}/${article}/${file}`;

        try {
            let data = JSON.parse(readFileSync(location, "utf-8"));
            writeFileSync(location, JSON.stringify(data, null, 4));
        } catch (error) {
            console.log(`Couldn't PrettyPrint ${location}! Probably invalid JSON.`);
        }
    }

    console.log(`PrettyPrinted: ${article}`);
}

console.log("PrettyPrinting done!");