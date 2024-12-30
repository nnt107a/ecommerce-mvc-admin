"use strict";
const ProductService = require("../services/product.service");
const AccessService = require("../services/access.service");
const { product } = require("../models/product.model");
class ProductController {
  getCart = async (req, res) => {
    const avatar = await AccessService.getAvatar(req.session.userId);
    return res.render("cart.ejs", {
      page: "cart",
      avatar,
      isAuthenticated: req.isAuthenticated(),
    });
  };
  getHome = async (req, res) => {
    try {
      const products = await ProductService.getRandomProducts(4);
      const latestProducts = await ProductService.getLatestProducts(4);

      const avatar = await AccessService.getAvatar(req.session.userId);

      // Render the index page with the random products
      res.render("index.ejs", {
        page: "home",
        avatar,
        featuredProducts: products,
        latestProducts: latestProducts,
        isAuthenticated: req.isAuthenticated(),
      });
    } catch (error) {
      console.error(error);
      res.redirect("./home");
    }
  };
  getContact = async (req, res) => {
    const avatar = await AccessService.getAvatar(req.session.userId);
    return res.render("contact.ejs", {
      page: "contact",
      avatar,
      isAuthenticated: req.isAuthenticated(),
    });
  };
  getShop = async (req, res) => {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (currentPage - 1) * limit;
    const searchQuery = req.query.search || "";
    const price = req.query.price || "";
    const color = req.query.color || "";
    const size = req.query.size || "";
    const gender = req.query.gender || "";
    const sortBy = req.query.sortBy || "";

    try {
      const {products, totalPages} = await ProductService.getShopProducts(limit, skip, searchQuery, price, color, size, gender, sortBy);

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        // If the request is an AJAX request, return JSON data
        return res.json({ products, totalPages, currentPage, sortBy });
      } else {
        const avatar = await AccessService.getAvatar(req.session.userId);
        // Otherwise, render the shop view
        res.render("shop.ejs", {
          page: "shop",
          avatar,
          isAuthenticated: req.isAuthenticated(),
          products,
          totalPages,
          currentPage,
          searchQuery,
          price,
          color,
          size,
          gender,
          sortBy,
        });
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  };
  getDetail = async (req, res) => {
    const product = await ProductService.getProductById(req.params.id);
    const relatedProducts = await ProductService.getRelatedProducts(
      product.type,
      product._id,
      4
    );
    const avatar = await AccessService.getAvatar(req.session.userId);
    return res.render("detail.ejs", {
      productId: req.params.id,
      product: product,
      relatedProducts: relatedProducts,
      page: "detail",
      avatar,
      isAuthenticated: req.isAuthenticated(),
    });
  };
  getAllProduct = async (req, res) => {
    const products = await ProductService.getAllProducts();
    console.log(products[0]);
    // return res.render("shop.ejs", {
    //   products: products,
    //   isAuthenticated: req.isAuthenticated(),
    // });
    return res.json({ products: products });
  };
}
module.exports = new ProductController();
