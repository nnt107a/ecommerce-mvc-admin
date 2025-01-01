"use strict";
const OrderService = require("../services/order.service");
const CartService = require("../services/cart.service");
const AccessService = require("../services/access.service");
const { hashId } = require("../utils/hash");
class OrderController {
    getOrder = async (req, res) => {
        const status = req.query.status || '';
        const sort = req.query.sort || '';
        const orders = await OrderService.getAllOrders(status, sort);
        const avatar = await AccessService.getAvatar(req.session.userId);
        console.log('result = ', orders);
        return res.render("order.ejs", {
        page: "order",
        avatar,
        isAuthenticated: req.isAuthenticated(),
        orders: orders,
        hashId,
        status,
        sort,
        });
    }
    checkout = async (req, res) => {
        const price = parseFloat(req.body.price);
        
        const products = await CartService.getUserCart(req.session.userId);

        const avatar = await AccessService.getAvatar(req.session.userId);
        return res.render("checkout.ejs", {
            page: "checkout",
            avatar,
            isAuthenticated: req.isAuthenticated(),
            price,
            products,
        });
    }
    createOrder = async (req, res) => {
        const {price, fullName, email, phoneNumber, address} = req.body;
        const products = await CartService.getUserCart(req.session.userId);
        const userId = req.session.userId;
        const result = await OrderService.createUserOrder(userId, fullName, address, phoneNumber, email, price, products);  
        await CartService.clearUserCart(req.session.userId);
        res.redirect("/home");
    }
    getDetail = async (req, res) => {
        const order = await OrderService.getOrderById(req.params.id);
        const avatar = await AccessService.getAvatar(req.session.userId);
        console.log(order);
        return res.render("order-detail.ejs", {
          orderId: req.params.id,
          cart: order.order_products,
          totalPrice: order.totalPrice,
          page: "detail",
          avatar,
          isAuthenticated: req.isAuthenticated(),
        });
    };
    updateOrderStatus = async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        try {
            await OrderService.updateOrderStatus(id, status);
            res.json({ success: true });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ success: false, message: 'Failed to update order status' });
        }
    };
}
module.exports = new OrderController();