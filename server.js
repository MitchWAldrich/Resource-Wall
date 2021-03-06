// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const cookieSession = require("cookie-session");

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// COOKIE SESSION
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");

const createResourceRoutes = require("./routes/create");
const resourceRoutes = require("./routes/resource");
const homeRoutes = require("./routes/home");
const myResourcesRoutes = require("./routes/my-resources");
const searchRoutes = require("./routes/search");

const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const logoutRoutes = require("./routes/logout");


const resourcesRoutes = require("./routes/resources-router");
const searchedResourcesRoutes = require("./routes/searched-router");

// api database routes
app.use("/api/resources", resourcesRoutes(db));
app.use("/api/users", usersRoutes(db));
app.use("/api/search", searchedResourcesRoutes(db));

// route to create a new resource
app.use("/create", createResourceRoutes(db));

// route to the expanded resource
app.use("/resource", resourceRoutes(db));

// route to searched resources by category
app.use("/search", searchRoutes(db));

/* Route for /my-resources */
app.use("/my-resources", myResourcesRoutes(db));

// Route to dashboard page displaying all resources
app.use("/home", homeRoutes(db));

/* Route for /register aka sign up page */
app.use("/register", registerRoutes(db));

/* Route for /login */
app.use("/login", loginRoutes(db));

/* Route for /logout */
app.use("/logout", logoutRoutes(db));

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
