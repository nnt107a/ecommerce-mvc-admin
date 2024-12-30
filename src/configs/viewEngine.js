const express = require("express");
const path = require("path");

const configViewEngine = (app) => {
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("view engine", "ejs");

  const staticPaths = [
    "css",
    "img",
    "js",
    "lib",
    "mail",
    "scss",
    "partials",
    "assets",
  ];

  staticPaths.forEach((staticPath) => {
    app.use(
      `/${staticPath}`,
      express.static(path.join(__dirname, `../views/${staticPath}`))
    );
    app.use(
      `/products-list-by-key/${staticPath}`,
      express.static(path.join(__dirname, `../views/${staticPath}`))
    );
    app.use(
      `/detail/${staticPath}`,
      express.static(path.join(__dirname, `../views/${staticPath}`))
    );
    app.use(
      `/order/${staticPath}`,
      express.static(path.join(__dirname, `../views/${staticPath}`))
    );
  });
};

module.exports = configViewEngine;
