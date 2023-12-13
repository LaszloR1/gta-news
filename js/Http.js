export class Http {
    /**
     * @type {RequestInit}
     */
    static options = {
        method: "GET",
        headers: {
            "Cookie": "AutoLoginCheck=1;",
            "Host": "prod.cloud.rockstargames.com",
            "User-Agent": "Chrome/119.0.0.0",
        },
        redirect: "follow",
    };

    /**
     * @param {string} url
     * @return {Promise<string>}
     */
    static async FetchJson(url) {
        let result = await fetch(url, Http.options);

        return await result.text();
    }

    /**
     * @param {string} url
     * @return {Promise<Headers>}
     */
    static async FetchHeaders(url) {
        const options = {...Http.options, ...{method: "HEAD"}};
        const result = await fetch(url, options);

        return result.headers;
    }

    /**
     * @param {string} url
     * @return {Promise<Int8Array>}
     */
    static async FetchData(url) {
        let result = await fetch(url, Http.options);

        return new Int8Array(await result.arrayBuffer());
    }
}