import {IO} from "./IO.js";
import {Http} from "./Http.js";

export class Schedule {
    /**
     * @type {string}
     */
    static Url = "https://prod.cloud.rockstargames.com/global/sc/events/eventschedule-game-{LANGUAGE}.json";

    /**
     * @type {string[]}
     */
    static Languages = ["en", "de", "es", "es", "fr", "it", "ja", "ko", "pt", "pl", "ru", "zh", "zh-Hans"];

    /**
     * @type {string}
     */
    static Folder = "./schedule";

    /**
     * @return {Promise<void>}
     */
    static async Fetch() {
        IO.CreatePathIfNotExist(this.Folder);
        let cache = IO.GetCache(this.Folder);

        let [lastModifiedUnix, schedules] = await this.GetSchedules(cache);

        if (!schedules.size || lastModifiedUnix === 0) {
            console.log("Schedule has not been updated. Skipping.");

            return;
        }

        console.log(`Found a new schedule! Saving it with id: ${lastModifiedUnix}!`);

        this.SaveSchedules(lastModifiedUnix, schedules);

    }
    /**
     * @param {Set<string>} cache
     * @returns {Promise<Array<number|Map<string, object>>>}
     */
    static async GetSchedules(cache) {
        let schedules = new Map();

        const preflight = this.Url.replace("{LANGUAGE}", "en");
        const headers = await Http.FetchHeaders(preflight);
        const lastModifiedUnix = new Date(headers.get("Last-Modified")).getTime() / 1000;

        if (cache.has(lastModifiedUnix.toString())) return [0, schedules];

        for (const language of this.Languages) {
            const url = this.Url.replace("{LANGUAGE}", language);

            try {
                schedules.set(language, JSON.parse(await Http.FetchJson(url)));
            } catch(error) {
                console.log(`Localization: "${language}" does not exist on event-schedule.`);
            }
        }

        return [lastModifiedUnix, schedules];
    }

    /**
     * @param {int} lastModified
     * @param {Map<string, object>} schedules
     */
    static SaveSchedules(lastModified, schedules) {
        IO.CreatePathIfNotExist(`${this.Folder}/${lastModified}`);

        for (const [language, schedule] of schedules) {
            IO.CreateFile(`${this.Folder}/${lastModified}/eventschedule-game-${language}.json`, IO.JsonStringify(schedule));
        }
    }
}