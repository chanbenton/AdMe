"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/register/user", (req, res) => {
    let templateVariable = {path: "/register/user"};
    res.render("registeruser", templateVariable)
  });

  router.get("/register/advertiser", (req, res) => {
    let templateVariable = {path: "/register/advertiser"};
    res.render("registeradvertiser",templateVariable)
  });

  router.post("/register/user", (req, res) => {
    knex('users').insert({
      name: req.body.userName,
      email: req.body.userEmail,
      password: req.body.userPassword,
      role: 'User'
    }, 'id')
    .then(function(resp){
      req.session.userId = resp[0];
      res.send("Registered User")
    })
  });

  router.post("/register/advertiser", (req, res) => {
    knex('users').insert({
      name: req.body.advName,
      email: req.body.advEmail,
      password: req.body.advPassword,
      role: 'Advertiser'
    }, 'id')
    .then(function(resp){
      req.session.userId = resp[0];
      res.send("Registered Adv")
    })
  });

  router.get("/", (req, res) => {
    let templateVariable = {path: "/"};
    res.render("index", templateVariable);
  });

  router.post("/login", (req, res) => {
    knex('users').where({
        email: req.body.loginEmail,
        password: req.body.loginPassword
    })
    .asCallback(function(err, rows){
      req.session.userId = rows[0].id
      if(rows[0].role == 'User'){
        res.redirect('/view')
      } else {
        res.render('createads')
      }
    })
  })

  return router;
}
