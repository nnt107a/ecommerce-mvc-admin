"use strict";
const ProductService = require("../services/product.service");
const AccessService = require("../services/access.service");
const CategoryService = require("../services/category.service");
const ManufacturerService = require("../services/manufacturer.service");
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
      const avatar = await AccessService.getAvatar(req.session.userId);

      // Render the index page with the random products
      res.render("index.ejs", {
        page: "home",
        avatar,
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
    const product_type = req.query.product_type || "";
    const product_brand = req.query.brand || "";
    const sortBy = req.query.sortBy || "";

    try {
      const {products, totalPages} = await ProductService.getShopProducts(limit, skip, searchQuery, product_type, product_brand, sortBy);

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        // If the request is an AJAX request, return JSON data
        return res.json({ products, totalPages, currentPage, sortBy });
      } else {
        const avatar = await AccessService.getAvatar(req.session.userId);
        const productTypes = await CategoryService.getCategoryName();
        const brands = await ManufacturerService.getManufacturerName();
        // Otherwise, render the shop view
        res.render("shop.ejs", {
          page: "shop",
          avatar,
          isAuthenticated: req.isAuthenticated(),
          products,
          totalPages,
          currentPage,
          searchQuery,
          product_type,
          product_brand,
          productTypes,
          brands,
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
  async getRevenueReport(req, res) {
    const { timeRange } = req.query;

    try {
        const report = await ProductService.getRevenueReport(timeRange);
        res.send(report);
    } catch (error) {
        console.error('Error fetching revenue report:', error);
        res.status(500).send('Failed to fetch revenue report');
    }
  }
  async getTopRevenueProducts(req, res) {
    const { timeRange } = req.query;

    try {
        const report = await ProductService.getTopRevenueProducts(timeRange);
        res.json(report);
    } catch (error) {
        console.error('Error fetching top revenue products:', error);
        res.status(500).send('Failed to fetch top revenue products');
    }
  }
}
module.exports = new ProductController();
