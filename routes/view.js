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

  routes.get("/:product_id", (req, res) => {

    let p_id = req.params.product_id;
    let u_id = req.session.userId;

    knex("products").select("*").where({id: p_id})
      .then((results) => {
        if (results.length === 0) {
          res.sendStatus(500);
          return;
        }
        let product = results[0];
        let empty_id = {id: null};
        if (u_id) {
          knex.raw(`INSERT INTO shared_links (products_id, users_id, platform, cost, click_count)
            VALUES (${p_id}, ${u_id}, 'FB', 1.10, 0), (${p_id} ,${u_id}, 'TW', 0.5, 0)
            ON CONFLICT ("products_id", "users_id", "platform") DO NOTHING`)
          .then (() => {
            knex("shared_links").select("id").where({products_id: p_id, users_id: u_id})
              .then((sl_list) => {
                console.log(sl_list[0], sl_list[1]);
                let templateVars = {
                  product: product,
                  path: "/view",
                  shareFb: sl_list[0],
                  shareTw: sl_list[1],
                  user: 1
                }
                res.render("productPage", templateVars);
            });
          });
        } else {
          let templateVars = {
              product: product,
              path: "/view",
              shareFb: empty_id,
              shareTw: empty_id,
              user: 0
          }
          res.render("productPage", templateVars);
        }
    });
  });

  return routes;
}

  //       let facebook_url = "http://www.facebook.com/dialog/feed/?app_id="
  //       let app_id = 267633323688936;
  //       let name = product.title;
  //       let picture = "http%3A%2F%2Fimage.ibb.co%2Fm8x55a%2Fsolution.jpg"
  //       let desc = product.desc;
  //       let fb_path = `facebook_url${app_id}&name={name}&link=http%3A%2F%2Fwww.google.ca&picture=${picture}&description=${desc}&redirect_uri=http%3A%2F%2Fwww.google.ca`

  // });
