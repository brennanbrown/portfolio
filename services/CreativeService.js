const fs = require("fs");
const util = require("util");

/**
 * We want to use async/await with fs.readFile - util.promisfy gives us that
 */
const readFile = util.promisify(fs.readFile);

/**
 * Logic for fetching creative work information
 */
class CreativeService {
    /**
     * Constructor
     * @param {*} datafile Path to a JSOn file that contains the creative work data
     */
    constructor(datafile) {
        this.datafile = datafile;
    }

    /**
     * Get a list of creative works
     */
    async getList() {
        const data = await this.getData();
        return data.map(creative => {
            return {
                name: creative.name,
                topic: creative.topic,
                date: creative.date,
                end: creative.end,
                description: creative.description,
                hyperlink: creative.hyperlink,
                artwork: creative.artwork
            };
        });
    }

    /**
     * Fetches creative data from the JSON file provided to the constructor
     */
    async getData() {
        const data = await readFile(this.datafile, "utf8");
        // if (!data) return [];
        return JSON.parse(data).creative;
    }
}

module.exports = CreativeService;