const express = require("express");
const cors = require("cors");
const responseHelper = require("express-response-helper").helper();
const bodyParser = require("body-parser");
const db = require("./app/models/index.js");

const app = express();
const port = 3000;

const corsOptions = {
  origin: "http://localhost:3001"
};

app.use(cors(corsOptions));

// attach the middleware before any route definition
app.use(responseHelper);

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const user = await db.User.findAll();
  res.respond(user, 200);
});

app.get("/user", async (req, res) => {
  res.respond(await db.User.findAll(), 200);
});

require("./app/routes/auth.routes.js")(app);
require("./app/routes/user.routes.js")(app);

app.listen(port, () =>
  console.info(`Server running at http://127.0.0.1:${port}`)
);
