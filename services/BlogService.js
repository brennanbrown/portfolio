const fs = require("fs");
const util = require("util");

/**
 * We want to use async/await with fs.readFile - util.promisfy gives us that
 */
const readFile = util.promisify(fs.readFile);

/**
 * Logic for fetching blog information
 */
class BlogService {
    /**
     * Constructor
     * @param {*} datafile Path to a JSOn file that contains the blog data
     */
    constructor(datafile) {
        this.datafile = datafile;
    }

    /**
     * Get a list of blog posts
     */
    async getList() {
        const data = await this.getData();
        return data.map(blog => {
            return {
                name: blog.name,
                topic: blog.topic,
                date: blog.date,
                end: blog.end,
                description: blog.description,
                hyperlink: blog.hyperlink,
                artwork: blog.artwork
            };
        });
    }

    /**
     * Fetches blog data from the JSON file provided to the constructor
     */
    async getData() {
        const data = await readFile(this.datafile, "utf8");
        // if (!data) return [];
        return JSON.parse(data).blog;
    }
}

module.exports = BlogService;