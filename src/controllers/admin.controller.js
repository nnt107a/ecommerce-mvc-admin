"use strict";

const CustomerService = require("../services/customer.service");
const AccessService = require("../services/access.service");
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
            const avatar = await AccessService.getAvatar(req.session.userId);
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
        const avatar = await AccessService.getAvatar(req.session.userId);
        console.log(account);
        return res.render("account-detail.ejs", {
          sessionUserId: req.session.userId,
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
}
module.exports = new AdminController();
