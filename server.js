/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const cookieSession = require("cookie-session");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const csp = require("helmet-csp");

// Adding business logic to the server.
const ProjectService = require("./services/ProjectService");
const BlogService = require("./services/BlogService");
const CreativeService = require("./services/CreativeService");

// Create instances of the above classes.
const projectService = new ProjectService("./data/project.json");
const blogService = new BlogService("./data/blog.json");
const creativeService = new CreativeService("./data/creative.json");

const routes = require("./routes");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "3000";

// Required if running through reverse proxy like NGINX
app.set("trust proxy", 1);
app.enable("trust proxy");

/**
 * Middleware
 */

// Solution taken from: https://stackoverflow.com/questions/8605720/how-to-force-ssl-https-in-express-js
function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

app.use(requireHTTPS);

// Solution taken from: https://mindthecode.com/blog/how-to-redirect-www-to-non-www-in-your-express-app
function redirectWwwTraffic(req, res, next) {
    if (req.headers.host.slice(0, 4) === "www.") {
        var newHost = req.headers.host.slice(4);
        return res.redirect(301, req.protocol + "://" + newHost + req.originalUrl);
    }
    next();
};

app.use(redirectWwwTraffic);

// Request the lifecycle, to fetch cookies that are sent with
// the headers that come from the client and parse them
// and also then set them on the request object.
app.use(
    cookieSession({
        name: "session",
        // Just example keys.
        keys: ["F56FsQQwE3r5", "htryhfgDSFG4"],
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

/**
 * Routes Definitions
 */

// Utilizing the EJS template
app.set("view engine", "ejs");
// Expects the template to be in the "views" folder
app.set("views", path.join(__dirname, "./views"));

app.locals.siteName = "Brennan K. Brown";

// Before routing handlers are defined, there needs to be
// "app.use" and the middleware called "express.static"
app.use(express.static(path.join(__dirname, "./src")));

app.use(
    "/",
    // Will pass down the service instances to the routes.
    routes({
        projectService: projectService,
        blogService: blogService,
        creativeService: creativeService,
    })
);

/**
 * Error Handling
 */

app.use(async (request, response, next) => {
    try {
        return next();
    } catch (err) {
        return next(err);
    }
});

app.use((request, response, next) => {
    try {
        return next();
    } catch (err) {
        return next(createError(404, "File not found"));
    }
});

app.use((err, request, response, next) => {
    response.locals.message = err.message;
    // Will log the error information and trace stack
    // to the developer, but not the user.
    console.error(err);
    const status = err.status || 500;
    response.locals.status = status;
    response.status(status);
    response.render("error");
});

/**
 * Content Security Policy
 */

app.use(
    csp({
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
                "'self'",
                "maxcdn.bootstrapcdn.com",
                "fonts.googleapis.com",
                "api.segment.io",
            ],
        },
    })
);

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Express Server is Listening on port ${port}!`);
});
