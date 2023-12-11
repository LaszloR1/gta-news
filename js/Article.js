import {Http} from "./Http.js";
import {IO} from "./IO.js";

export class Article {
    /**
     * @type {string}
     */
    static UrlContent = `https://prod.cloud.rockstargames.com/global/sc/news/{ARTICLE}/{LANGUAGE}.json`;

    /**
     * @type {string}
     */
    static UrlImage = "https://prod.cloud.rockstargames.com/global/{IMAGE}";

    /**
     * @type {string[]}
     */
    static Languages = ["en", "de", "es", "es", "fr", "it", "ja", "ko", "pt", "pl", "ru", "zh", "zh-Hans"];

    /**
     * @type {string}
     */
    static id;

    /**
     * @param {string} id ID of the event
     * @param {object} meta Metadata object
     */
    static async Fetch(id, meta) {
        let articles = await this.GetLocalizedContent(id);
        let images = await this.GetAllImages(articles);

        this.CreateFolder(id);
        this.SaveArticles(id, articles);
        this.SaveImages(id, images);
    }

    /**
     * @param {string} id
     * @return {Map<string, object>}
     */
    static async GetLocalizedContent(id) {
        const url = this.UrlContent.replace("{ARTICLE}", id);
        let articles = new Map();

        for (const language of this.Languages) {
            const urlLocalized = url.replace("{LANGUAGE}", language);
            articles[language] = JSON.parse(await Http.FetchJson(urlLocalized));
        }

        return articles;
    }

    /**
     * @param {object} articles
     * @return {Map<string, Int8Array>}
     */
    static async GetAllImages(articles) {
        let urls = new Set();

        for (const article of Object.values(articles)) {
            urls.add(article["image"]["path"]);
        }


        let images = new Map();

        for (const url of urls) {
            let imageUrl = this.UrlImage.replace("{IMAGE}", url);
            let imageName = url.split("/").pop();

            images[imageName] = await Http.FetchData(imageUrl);
        }

        return images;
    }

    /**
     * @param {string} id
     */
    static CreateFolder(id) {
        IO.CreatePathIfNotExist("./article/"+id);
    }

    /**
     * @param {string} id
     * @param {Map<string, object>} articles
     */
    static SaveArticles(id, articles) {
        for (const [language, article] of Object.entries(articles)) {
            IO.CreateFile(`./article/${id}/${language}.json`, JSON.stringify(article));
        }
    }

    /**
     * @param {string} id
     * @param {Map<string, Int8Array>} images
     */
    static SaveImages(id, images) {
        for (const [name, data] of Object.entries(images)) {
            IO.CreateFile(`./article/${id}/${name}`, data);
        }
    }
}