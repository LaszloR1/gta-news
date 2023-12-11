import {readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync} from "node:fs";

export class IO {
    /**
     * @type {string}
     */
    static cache = "./cache.json";

    /**
     * @param {string} path
     */
    static CreatePathIfNotExist(path) {
        let folders = path.split("/");

        let fullPath = "";

        for (const folder of folders) {
            fullPath = fullPath + folder + "/";

            if (existsSync(fullPath)) continue;

            mkdirSync(fullPath);
        }
    }

    /**
     * @param {string} path
     * @param {string|Int8Array} data
     */
    static CreateFile(path, data) {
        writeFileSync(path, data);
    }

    /**
     * @param {string} file
     * @returns {Set<string>}
     */
    static GetCache(file){
        if (!existsSync(file)) return new Set();

        return new Set(readdirSync(file));
    }

    /**
     * @param {object} object
     * @return {string}
     * @constructor
     */
    static JsonStringify(object) {
        return JSON.stringify(object, null, 4);
    }
}