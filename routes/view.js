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
        console.log(results);
        let templateVars = {
          products: results.reverse(),
          path: "/view"
        }
        res.render("userAds", templateVars);
      });
  });

  routes.get("/stats", (req, res) => {
      // let userId = req.session_userId
      // if (!userId)
    knex("products")
      .join('shared_links', 'products.id', '=', 'shared_links.products_id')
      .select("*")
      .where('shared_links.users_id', '=', req.session.userId)
      .then((results) => {
        console.log(results);
        let templateVars = {
          products: results.reverse(),
          path: "/view/stats"
        }
        res.render("userstats", templateVars);
      });
  });

  return routes;
}
