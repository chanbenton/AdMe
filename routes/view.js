"use strict";

const express = require('express');
const routes = express.Router();

module.exports = (knex) => {

  routes.get("/", (req, res) => {
    knex("users").select("*").where("id", '=', req.session.userId ).then((users) => {
      var user = users[0];
      knex("products")
        .select("*")
        .then((results) => {
          let templateVars = {
            products: results.reverse(),
            loggedUser: user.role
          }

          res.render("userAds", templateVars);
        });
    })
  });


  routes.get("/stats", (req, res) => {
    knex('products')
      .join('shared_links', 'products.id', '=', 'shared_links.products_id')
      .distinct('products.id')
      .select("products.title", "products.desc", "products.img_path", "products.id AS id")
      .where('shared_links.users_id', '=', req.session.userId)
      .then((rows) => {
        knex("users")
          .join('shared_links', 'users.id', '=', 'shared_links.users_id')
          .select('users.role','users.name','users.email','shared_links.click_count','shared_links.cost')
          //.groupBy('products.id','shared_links.id','users.id')
          .then((results) => {
            let moolah = 0;
            results.forEach( function(value, index){
              moolah += value.click_count * value.cost
            })
            let templateVars = {
              name: results[0].name,
              email: results[0].email,
              moolah: moolah,
              products: rows.reverse(),
              loggedUser: results[0].role
            }
            res.render("userstats", templateVars);
          });
      });
  });


  routes.get("/ads/:product_id", (req, res) => {

    let p_id = req.params.product_id;
    var count = [];
    var platfom = []
    knex("users").select("*").where("id", '=', req.session.userId ).then((users) => {
      if(users[0].role == 'User'){
        knex("products")
          .select("*")
          .where("id", "=", p_id)
          .then((results) => {
            let product = results[0];
            let templateVars = {
              loggedUser: users.role,
               product: product
             }
             if (results.length > 0){
               res.render("productPage", templateVars);
             } else {
               res.sendStatus(500);
             }
          })
        }

      let user = users[0];
      knex("products")
        .join('shared_links', 'products.id', '=', 'shared_links.products_id' )
        .join('users', 'users.id', '=', 'shared_links.users_id')
        .select("*")
        .where( 'shared_links.products_id', '=', p_id)
        .then((results) => {
          if(results.length == 0){
            knex("products")
              .select("*")
              .where("id", "=", p_id)
              .then((results) => {
                let product = results[0];
                let templateVars = {
                  loggedUser: users.role,
                   product: product
                 }
                 if (results.length > 0){
                   res.render("productPage", templateVars);
                 } else {
                   res.sendStatus(500);
                 }
              })
            }
          for (var i = 0; i < results.length; i++){
           count.push(results[i].click_count)
           platfom.push(results[i].platform);
          }
          let product = results[0];
          let facebook_url = "http://www.facebook.com/dialog/feed/?app_id="
          let app_id = 267633323688936;
          let name = product.title;
          let picture = "http%3A%2F%2Fimage.ibb.co%2Fm8x55a%2Fsolution.jpg"
          let desc = product.desc;
          let fb_path = `facebook_url${app_id}&name={name}&link=http%3A%2F%2Fwww.google.ca&picture=${picture}&description=${desc}&redirect_uri=http%3A%2F%2Fwww.google.ca`

          let templateVars = {
            loggedUser: user.role,
            labels: JSON.stringify(platfom),
            ads: count,
            product: product,
            path: fb_path,
            path2: "asdf"
          }
          if (results.length > 0){
            res.render("productPage", templateVars);
          } else {
            res.sendStatus(500);
          }
        });
      });
  });

  // routes.get("/:product_id/share/fb", (req, res) => {
  //   let p_id = req.params.product_id;
  //   let userId = req.session.user_id;
  //   // INSERT INTO shared_links (id,products_id, users_id, platform, cost, click_count) VALUES
  //   knex
  //     .raw(`INSERT INTO shared_links (products_id, users_id, platform, cost, click_count) VALUES (${p_id},${userId}?,FB,1.10,0) ON CONFLICT ("products_id", "users_id", "platform")
  //   DO NOTHING`)
  //     .then((result) => {

  //     });
  // });

  // routes.get("/:product_id/share/tw", (req, res) => {
  //   var p_id = req.params.product_id;
  //   knex("products")
  //     .select("*")
  //     .where({ id: p_id })
  //     .then((results) => {
  //       let templateVars = {
  //         product: results[0],
  //         path: "asdf"
  //       }
  //       console.log(results[0]);
  //       if (results.length > 0){
  //         res.render("productPage", templateVars);
  //       } else {
  //         res.sendStatus(500);
  //       }

  //     });
  // });


  return routes;
}
