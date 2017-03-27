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
          path: "/view"
        }
        res.render("userAds", templateVars);
      });
  });
  return routes;
}

  // food.post("/inventory", (req, res) => {
  //   let userId = req.session.user_id;
  //   if (!userId) {
  //     return res.redirect("/");
  //   }

  //   let curFood = req.body["food-item"];
  //   knex.select("id").from("ingredients").where({ name: curFood })
  //     .then((result) => {
  //       return knex('inventory')
  //         .where({
  //           userId: userId,
  //           ingId: result[0].id
  //         })
  //         .update({
  //           pend: 0,
  //           qty: 1
  //         })
  //     })
  //     .then(() => {
  //       res.status(200).send();
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       res.sendStatus(500);
  //     });
  // });
