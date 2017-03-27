"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const cookieSession = require('cookie-session');

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
var bcrypt        = require("bcrypt");



const usersRoutes = require("./routes/users");
const viewRoutes = require("./routes/view");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
const saltRounds = 10;
app.use(cookieSession({
  name: 'session',
  keys: ['user_id'],
}));

app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/view", viewRoutes(knex));

//******************GET REQUESTS::******************

// Home page


// Ad creation page
app.get("/ad/create", (req, res) => {
  let templateVariable = {path: "/ad/create"};
  res.render("createads", templateVariable);
});

app.post("/ad/create", (req, res) => {
  knex('products').insert([{
    img_path: req.body.imgPath,
    title: req.body.adTitle,
    desc: req.body.adDesc
  }])
  .then(function(resp){
    res.send("Ad Created and Added to DB")
  })
})

// Get request Register




// POST REQUESTS Login Register





// Stats and previous ads page for advertisers

app.get("/users/:id/ads", (req, res) => {
 var count = [];
 var platfom = []
 knex
     .select('click_count', 'platform')
     .from('shared_links')
     .then((results) => {
       console.log("This should be an array I think", results)
       for (var i = 0; i < results.length; i++){
        count.push(results[i].click_count)
        platfom.push(results[i].platform);
        console.log("HELLO", count);
        console.log("HELLO ARRAY OF OBJECTS", platfom);
       }
       console.log("this is the real count", count);
       let templateVariable = {
         path: "/users/:id/ads",
         ads: count,
         labels: JSON.stringify(platfom)
       }
       console.log("PLEASE WORK",templateVariable.labels)
       res.render("advads", templateVariable);
      });
});

app.get("/users/:id/stats", (req, res) => {
  let templateVariable = {path: "/users/:id/stats"};
  res.render("userstats", templateVariable);
});



//******************POST REQUESTS::******************




app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
