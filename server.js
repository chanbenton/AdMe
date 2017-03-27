"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
// const cookieSession = require('cookie-session');

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');


const usersRoutes = require("./routes/users");
const viewRoutes = require("./routes/view");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.

// app.use(cookieSession({
//   name: 'session',
//   keys: ['user_id'],

//   // Cookie Options
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }));

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
app.get("/", (req, res) => {
  let templateVariable = {path: "/"};
  res.render("index", templateVariable);
});

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
app.get("/register/user", (req, res) => {
  let templateVariable = {path: "/register/user"};
  res.render("registeruser", templateVariable)
})

app.get("/register/advertiser", (req, res) => {
  let templateVariable = {path: "/register/advertiser"};
  res.render("registeradvertiser",templateVariable)
})

// POST REQUESTS Login Register
app.post("/register/user", (req, res) => {
  knex('users').insert([{
    name: req.body.userName,
    email: req.body.userEmail,
    password: req.body.userPassword,
    role: 'User'
  }])
  .then(function(resp){
    res.send("Registered User")
  })
})

app.post("/register/advertiser", (req, res) => {
  knex('users').insert([{
    name: req.body.advName,
    email: req.body.advEmail,
    password: req.body.advPassword,
    role: 'Advertiser'
  }])
  .then(function(resp){
    res.send("Registered Adv")
  })
})

app.post("/login", (req, res) => {
  knex('users').where({
      email: req.body.loginEmail,
      password: req.body.loginPassword
  })
  .asCallback(function(err, rows){
    console.log(rows);
  })
})

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


app.get("/users/:id/stats", (req, res) => {
  let templateVariable = {path: "/users/:id/stats"};
  res.render("userstats", templateVariable);
});



//******************POST REQUESTS::******************

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
