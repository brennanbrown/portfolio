const express = require("express");

const router = express.Router();

// This method allows arguments to be passed 
// from the application down to the route as function parameters. 
module.exports = params => {
    const {
        projectService,
        blogService,
        creativeService
    } = params;

    router.get("/", async (request, response, next) => {

        // Using cookies to track the amount of visitors,
        // specific to a given user.
        if (!request.session.visitcount) {
            request.session.visitcount = 0;
        }

        request.session.visitcount += 1;
        console.log(`Number of visits: ${request.session.visitcount}`);

        try {
            const project = await projectService.getList();
            const blog = await blogService.getList();
            const creative = await creativeService.getList();
            return response.render("layout", {
                pageTitle: "Portfolio",
                template: "index",
                project,
                blog,
                creative
            });
        } catch (err) {
            return next(err);
        }
    });

    return router;
};