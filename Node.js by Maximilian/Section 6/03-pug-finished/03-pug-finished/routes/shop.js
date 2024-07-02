const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  const products = adminData.products;
  //render methd accepts 2 args (1) view file_name (2) data that replace placeholders in .pug file
  // passing an extra attribute 'path' for making active link
  res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
});

module.exports = router;
