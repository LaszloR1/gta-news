import {Http} from "./Http.js";
import {Article} from "./Article.js";
import {IO} from "./IO.js";

export class News {
    /**
     * @type {string}
     */
    static Url = "https://prod.cloud.rockstargames.com/titles/gta5/{PLATFORM}/news/news.json";

    /**
     * @type {string[]}
     */
    static Platforms = ["xboxone", "xboxsx", "ps4", "ps5", "pcros"];

    /**
     * @return {Promise<void>}
     */
    static async Fetch() {
        IO.CreatePathIfNotExist("./article");
        let articles = await this.GetArticles();
        let cache = IO.GetCache();

        for (const [id, data] of Object.entries(articles)) {
            if (cache.has(id)) continue;

            await Article.Fetch(id, data);

            cache.add(id);
        }

        IO.CreateFile(IO.cache, JSON.stringify(Array.from(cache)));
    }

    /**
     * @return {Promise<Map<string, object>>}
     */
    static async GetArticles(){
        let articles = new Map();

        for (const platform of this.Platforms) {
            const url = this.Url.replace("{PLATFORM}", platform);
            const news = JSON.parse(await Http.FetchJson(url));

            for (const item of news) {
                let id = item["gm.evt"]["d"]["k"];

                articles[id] = item;
            }
        }

        return articles;
    }
}