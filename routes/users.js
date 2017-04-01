"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/register/user", (req, res) => {
  let templateVars = {
      loggedUser: 'notLogged'
    }
    console.log(templateVars);
    res.render("registeruser", templateVars)
  });

  router.get("/register/advertiser", (req, res) => {
  let templateVars = {
      loggedUser: 'notLogged'
    }
    res.render("registeradvertiser", templateVars)
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
      res.redirect("/view")
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
      res.redirect("/view")
    })
  });

  router.get("/", (req, res) => {
    let templateVariable = {path: "/"};
    res.render("index");
  });

  router.post("/login", (req, res) => {

    knex('users').where({
        email: req.body.loginEmail,
        password: req.body.loginPassword
    })
    .asCallback(function(err, rows){
      req.session.userId = rows[0].id
      res.redirect('/view')
    });
  });

  router.post("/logout", (req,res) =>{
    req.session = null;
    res.redirect("/");
  })


  return router;
}
