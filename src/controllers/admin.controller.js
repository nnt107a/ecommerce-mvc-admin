"use strict";

const CustomerService = require("../services/customer.service");
const AccessService = require("../services/access.service");
const { hashId } = require("../utils/hash");
class AdminController {
    getAccount = async (req, res) => {
        const result = await CustomerService.getAllUser();
        const avatar = await AccessService.getAvatar(req.session.userId);
        console.log('result = ', result);
        return res.render("account.ejs", {
        page: "account",
        avatar,
        isAuthenticated: req.isAuthenticated(),
        accounts: result,
        hashId,
        });
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
