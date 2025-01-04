"use strict";

const CustomerService = require("../services/customer.service");
const AccessService = require("../services/access.service");
const CategoryService = require("../services/category.service");
const ManufacturerService = require("../services/manufacturer.service");
const ProductService = require("../services/product.service");
const { hashId } = require("../utils/hash");
class AdminController {
    getAccount = async (req, res) => {
        const currentPage = parseInt(req.query.currentPage) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (currentPage - 1) * limit;
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || '';
        const {accounts, totalPages} = await CustomerService.getAllUser(limit, skip, searchQuery, sortBy);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            // If the request is an AJAX request, return JSON data
            return res.json({ accounts, totalPages, currentPage, sortBy});
        } else {
            const avatar = await AccessService.getAvatar(req.user.id);
            return res.render("account.ejs", {
            page: "account",
            avatar,
            isAuthenticated: req.isAuthenticated(),
            accounts,
            hashId,
            searchQuery,
            sortBy,
            totalPages,
            currentPage,
            });
        }
    };
    getDetail = async (req, res) => {
        const account = await CustomerService.getUserById(req.params.id);
        const avatar = await AccessService.getAvatar(req.user.id);
        console.log(account);
        return res.render("account-detail.ejs", {
          sessionUserId: req.user.id,
          account: account,
          page: "detail",
          avatar,
          isAuthenticated: req.isAuthenticated(),
          hashId,
        });
    };
    updateStatus = async (req, res) => {
        const result = await CustomerService.updateStatus(req.params.id, req.body.status);
        return res.json(result);
    };
    getManageCateManu = async (req, res) => {
        const avatar = await AccessService.getAvatar(req.user.id);
        return res.render("manage-cate-manu.ejs", { page: "manage-cate-manu", avatar, isAuthenticated: req.isAuthenticated() });
    }
    addCategory = async (req, res) => {
        const result = await CategoryService.addCategory(req.body.categoryName);
        const avatar = await AccessService.getAvatar(req.user.id);
        return res.render("manage-cate-manu.ejs", { page: "manage-cate-manu", avatar, isAuthenticated: req.isAuthenticated() });
    }
    addManufacturer = async (req, res) => {
        const result = await ManufacturerService.addManufacturer(req.body.manufacturerName);
        const avatar = await AccessService.getAvatar(req.user.id);
        return res.render("manage-cate-manu.ejs", { page: "manage-cate-manu", avatar, isAuthenticated: req.isAuthenticated() });
    }
    getAddProduct = async (req, res) => {
        const avatar = await AccessService.getAvatar(req.user.id);
        const categories = await CategoryService.getCategoryName();
        const manufacturers = await ManufacturerService.getManufacturerName();
        return res.render("add-product.ejs", { page: "add-product", avatar, categories, manufacturers, isAuthenticated: req.isAuthenticated() });
    }
    addProduct = async (req, res) => {
        const result = await ProductService.addProduct(req.body);
        const avatar = await AccessService.getAvatar(req.user.id);
        const categories = await CategoryService.getCategoryName();
        const manufacturers = await ManufacturerService.getManufacturerName();
        return res.render("add-product.ejs", { page: "add-product", avatar, categories, manufacturers, isAuthenticated: req.isAuthenticated() });
    }
    getEditProduct = async (req, res) => {
        const avatar = await AccessService.getAvatar(req.user.id);
        const product = await ProductService.getProductById(req.params.id);
        const categories = await CategoryService.getCategoryName();
        const manufacturers = await ManufacturerService.getManufacturerName();
        res.render('edit-product.ejs', { page: "edit-product", avatar, product, categories, manufacturers, isAuthenticated: req.isAuthenticated() });
    }
    editProduct = async (req, res) => {
        const { product_name, product_thumb, product_description, product_price, product_color, product_size, product_quantity, product_type, product_attributes, product_status } = req.body;
        const result = await ProductService.findByIdAndUpdate(req.params.id, {
            product_name,
            product_thumb, // Convert comma separated URLs to array
            product_description,
            product_price,
            product_color,
            product_size,
            product_quantity,
            product_type,
            product_attributes,
            product_status
        });
        const avatar = await AccessService.getAvatar(req.user.id);
        const product = await ProductService.getProductById(req.params.id);
        const categories = await CategoryService.getCategoryName();
        const manufacturers = await ManufacturerService.getManufacturerName();
        res.render('edit-product.ejs', { page: "edit-product", avatar, product, categories, manufacturers, isAuthenticated: req.isAuthenticated() });
    }
}
module.exports = new AdminController();
