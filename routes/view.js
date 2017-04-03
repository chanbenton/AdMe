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
          knex("users")
            .join('shared_links', 'users.id', '=', 'shared_links.users_id')
            .select('users.role','users.name','users.email','shared_links.click_count','shared_links.cost')
            //.groupBy('products.id','shared_links.id','users.id')
            .then((rows) => {
              let moolah = 0;
              rows.forEach( function(value, index){
                moolah += value.click_count * value.cost
              })
              let templateVars = {
                products: results.reverse(),
                loggedUser: user.role,
                name: user.name,
                email: user.email,
                moolah: moolah
              }
              res.render("userAds", templateVars);
            })
        });
    })
  });

  routes.get("/advertiser/payouts", (req, res) => {
    knex("users").select("*").where("id", '=', req.session.userId ).then((users) => {
      knex("users")
        .join("shared_links", "users.id", "=", "shared_links.users_id")
        .join("products", "products.id", "=", "shared_links.products_id")
        .select("users.name", "shared_links.products_id", "shared_links.click_count", "shared_links.cost", "shared_links.platform")
        .where("creator_uid", "=", req.session.userId)
        .then((results) => {
          console.log(results);
          let templateVars = {
            details: results
          }
          res.render("advPayout",templateVars)
        })
    })
  })

  routes.get("/advertiser/stats", (req, res) => {
    knex('products')
      .join("users", "products.creator_uid", "=", "users.id")
      .select("products.title", "products.desc", "products.img_path", "products.id AS id", "users.email", "users.name","users.role")
      .where("creator_uid", "=", req.session.userId)
      .then((products) => {
        let templateVars = {
          loggedUser: products[0].role,
          products: products.reverse(),
          name: products[0].name,
          email: products[0].email,
          moolah: 10
        }
        res.render("userstats", templateVars);
      })
  })

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
          })
      });
  });


  routes.get("/ads/:product_id", (req, res) => {

    let p_id = req.params.product_id;
    var count = [];
    var platfom = []
    knex("users").select("*").where("id", '=', req.session.userId ).then((users) => {
      console.log('users',users);
      if(users[0].role == 'User'){
        knex("products")
          .select("*")
          .where("id", "=", p_id)
          .then((results) => {
            let product = results[0];
            let templateVars = {
              loggedUser: users[0].role,
              product: product
             }
             if (results.length > 0){
               res.render("product-page", templateVars);
             } else {
               res.sendStatus(500);
             }
          })
      } else {
          let user = users[0];
          knex("products")
            .join('shared_links', 'products.id', '=', 'shared_links.products_id' )
            .join('users', 'users.id', '=', 'shared_links.users_id')
            .select("*")
            .where( 'shared_links.products_id', '=', p_id)
            .then((results) => {
              console.log('Inside Results',results.length);
              if(results.length == 0){
                knex("products")
                  .select("*")
                  .where("id", "=", p_id)
                  .then((results) => {
                    console.log("inside", results);
                    let product = results[0];
                    let templateVars = {
                      ads: 0,
                      labels: 0,
                      loggedUser: user.role,
                       product: product
                     }
                     if (results.length > 0){
                       res.render("product-page", templateVars);
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
                res.render("product-page", templateVars);
              } else {
                res.sendStatus(500);
              }
          });
        }
      });
  });

  routes.post("/delete/:product_id", (req, res) => {
    console.log(req.params.product_id);
    knex('shared_links')
      .where('products_id', req.params.product_id)
      .del()
      .then((results) => {
        knex('products')
          .where('id', req.params.product_id)
          .del()
          .then((rows) => {
            console.log("Row deleted");
            res.redirect("/view")
          })
      })
  })

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
