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
     * @param {string} id ID of the event
     * @param {object} data Metadata object
     */
    static async Fetch(id, data) {
        let articles = await this.GetLocalizedContent(id);
        let images = await this.GetImages(articles);

        if (!articles.size && !images.size) {
            console.log(`Article: "${id}" contains images or text. Skipping.`);

            return;
        }

        this.CreateFolder(id);
        this.SaveArticles(id, articles);
        this.SaveImages(id, images);
        this.SaveMetadata(id, data);
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

            try {
                articles.set(language, JSON.parse(await Http.FetchJson(urlLocalized)));
            } catch(error) {
                console.log(`Localization: "${language}" does not exist on Article: "${id}"`);
            }

        }

        return articles;
    }

    /**
     * @param {Map<string, object>} articles
     * @return {Map<string, Int8Array>}
     */
    static async GetImages(articles) {
        let urls = new Set();

        for (const [language, article] of articles) {
            if (!("image" in article)) continue;
            if (!("path" in article["image"])) continue;
            if (!article["image"]["path"]) continue;

            urls.add(article["image"]["path"]);

            if (!("landscape" in article)) continue;
            if (!("path" in article["landscape"])) continue;
            if (!article["landscape"]["path"]) continue;

            urls.add(article["landscape"]["path"]);
        }

        let images = new Map();

        for (const url of urls) {
            let imageUrl = this.UrlImage.replace("{IMAGE}", url);
            let imageName = url.split("/").pop();
            let imageData = await Http.FetchData(imageUrl);

            images.set(imageName, imageData);
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
        for (const [language, article] of articles) {
            IO.CreateFile(`./article/${id}/${language}.json`, IO.JsonStringify(article));
        }
    }

    /**
     * @param {string} id
     * @param {Map<string, Int8Array>} images
     */
    static SaveImages(id, images) {
        for (const [name, data] of images) {
            IO.CreateFile(`./article/${id}/${name}`, data);
        }
    }

    /**
     * @param {string} id
     * @param {object} data
     */
    static SaveMetadata(id, data) {
        IO.CreateFile(`./article/${id}/meta.json`, IO.JsonStringify(data));
    }
}