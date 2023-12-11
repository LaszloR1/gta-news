import {readFileSync, writeFileSync, existsSync, mkdirSync} from "node:fs";

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
     * @returns {Set<string>}
     */
    static GetCache(){
        if (!existsSync(this.cache)) return new Set();

        return new Set(JSON.parse(readFileSync(this.cache)));
    }
}