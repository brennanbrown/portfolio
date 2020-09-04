const express = require("express");

const router = express.Router();

// This method allows arguments to be passed 
// from the application down to the route as function parameters. 
module.exports = () => {
    router.get("/", async (request, response, next) => {

        // Using cookies to track the amount of visitors,
        // specific to a given user.
        if (!request.session.visitcount) {
            request.session.visitcount = 0;
        }

        request.session.visitcount += 1;
        console.log(`Number of visits: ${request.session.visitcount}`);

        try {
            return response.render("layout", {
                pageTitle: "Brennan K. Brown",
                template: "index",
            });
        } catch (err) {
            return next(err);
        }
    });

    return router;
};