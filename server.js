"use strict";

require('dotenv').config();

const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();
const cookieSession = require('cookie-session');
const multer        = require('multer')
const knexConfig    = require("./knexfile");
const knex          = require("knex")(knexConfig[ENV]);
const morgan        = require('morgan');
const knexLogger    = require('knex-logger');
var bcrypt          = require("bcrypt");
const aws           = require('aws-sdk');




const usersRoutes = require("./routes/users");
const viewRoutes = require("./routes/view");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.

const saltRounds = 10;
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/ad_img/')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage})
app.use(cookieSession({
  name: 'session',
  keys: ['user_id'],
}));

app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/", usersRoutes(knex));
app.use("/view", viewRoutes(knex));


// Ad creation page
app.get("/ad/create", (req, res) => {
  knex('users')
    .select('role')
    .where({
      id: req.session.userId
    })
    .then(function(resp){
      console.log(resp);
      let templateVariable = {
        loggedUser: resp[0]
      };
      res.render("createads", templateVariable);
    })
});

app.post("/ad/create", upload.single('Image'), (req, res) => {
  console.log(req.file.filename);

  knex('products').insert([{
      img_path: req.file.filename,
      title: req.body.adTitle,
      desc: req.body.adDesc,
      creator_uid: req.session.userId
    }])
    .then(function(resp) {
      res.send("Ad Created and Added to DB")
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
       for (var i = 0; i < results.length; i++){
        count.push(results[i].click_count)
        platfom.push(results[i].platform);
       }
       let templateVariable = {
         loggedUser: 'Advertiser',
         ads: count,
         labels: JSON.stringify(platfom)
       }
       res.render("advads", templateVariable);

      });
});

//.raw('SELECT cost, click_count, cost*click_count AS money_earned FROM shared_links WHERE users_id = req.session.userId')

app.get("/view/stats", (req, res) => {
console.log("DOES THIS WORL??")
  knex('users')
              .join('shared_links', 'users.id', '=', 'shared_links.users_id')
              //.join('products', 'users.id', '=', 'shared_links.users_id')
              .select('users.name', 'users.email', 'shared_links.cost', 'shared_links.click_count')
              .where('users.id', '=', req.session.userId)

              .then((results) => {
                console.log(results)
                console.log("THE FOLLOWING SHOULD BE THE AMOUNT OF MONEY EARNED", results);

                var money = results[0].cost*results[0].click_count;
                console.log(money);

                let templateVariable = {
                 path: "/view/stats",
                 name: results[0].name,
                 email: results[0].email,
                 moolah: money
                };
                res.render("userstats" ,templateVariable);
      })
});

app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3({
    accessKeyId: "AKIAICCDE5LICDU2A2HA",
    secretAccessKey: "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",
    region: 'ca-central-1'
  });
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
   Bucket: 'admeimagebucket1',
   Key: fileName,
   Expires: 60,
   ContentType: fileType,
   ACL: 'public-read'
 };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://admeimagebucket1.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
