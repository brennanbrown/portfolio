const fs = require("fs");
const util = require("util");

/**
 * We want to use async/await with fs.readFile - util.promisfy gives us that
 */
const readFile = util.promisify(fs.readFile);

/**
 * Logic for fetching project information
 */
class ProjectService {
    /**
     * Constructor
     * @param {*} datafile Path to a JSOn file that contains the project data
     */
    constructor(datafile) {
        this.datafile = datafile;
    }

    /**
     * Get a list of projects
     */
    async getList() {
        const data = await this.getData();
        return data.map(project => {
            return {
                name: project.name,
                language: project.language,
                image: project.image,
                date: project.date,
                description: project.description,
                hyperlink: project.hyperlink,
                source: project.source,
                docs: project.docs,
                visibility: project.visibility
            };
        });
    }

    /**
     * Fetches project data from the JSON file provided to the constructor
     */
    async getData() {
        const data = await readFile(this.datafile, "utf8");
        // if (!data) return [];
        return JSON.parse(data).project;
    }
}

module.exports = ProjectService;