"use strict";

const express = require('express');
const routes = express.Router();

module.exports = (knex) => {
  routes.get("/", (req, res) => {
      // let userId = req.session_userId
      // if (!userId)
    knex("products")
      .select("*")
      .then((results) => {
        let templateVars = {
          products: results,
          path: "asdf"
        }

        res.render("userAds", templateVars);
      });
  });
  
  routes.get("/:product_id", (req, res) => {
    var p_id = req.params.product_id;
    knex("products")
      .select("*")
      .where({ id: p_id })
      .then((results) => {
        let templateVars = {
          product: results[0],
          path: "asdf"
        }
        console.log(results[0]);
        if (results.length > 0){
          res.render("productPage", templateVars);
        } else {
          res.sendStatus(500);
        }

      });
  });

  return routes;
}