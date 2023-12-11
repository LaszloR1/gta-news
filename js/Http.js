export class Http {
    /**
     * @type {RequestInit}
     */
    static options = {
        method: "GET",
        headers: {
            "Cookie": "AutoLoginCheck=1;",
            "Host": "prod.cloud.rockstargames.com.com",
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
     * @return {Promise<Int8Array>}
     */
    static async FetchData(url) {
        let result = await fetch(url, Http.options);

        return new Int8Array(await result.arrayBuffer());
    }
}