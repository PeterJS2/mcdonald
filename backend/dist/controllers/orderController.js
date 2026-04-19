"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.createOrder = exports.getOrders = void 0;
const Order_1 = require("../models/Order");
const OrderItem_1 = require("../models/OrderItem");
const Product_1 = require("../models/Product");
const database_1 = __importDefault(require("../config/database"));
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.Order.findAll({
            include: [{ model: OrderItem_1.OrderItem, include: [Product_1.Product] }],
            order: [['createdAt', 'DESC']],
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getOrders = getOrders;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.default.transaction();
    try {
        const { items, total_price } = req.body;
        const order = yield Order_1.Order.create({ total_price }, { transaction: t });
        for (const item of items) {
            yield OrderItem_1.OrderItem.create({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
            }, { transaction: t });
        }
        yield t.commit();
        const completedOrder = yield Order_1.Order.findByPk(order.id, {
            include: [OrderItem_1.OrderItem]
        });
        res.status(201).json(completedOrder);
    }
    catch (error) {
        yield t.rollback();
        res.status(400).json({ error: error.message });
    }
});
exports.createOrder = createOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const [updated] = yield Order_1.Order.update({ status }, { where: { id } });
        if (updated) {
            const updatedOrder = yield Order_1.Order.findByPk(id);
            return res.json(updatedOrder);
        }
        throw new Error('Order not found');
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
});
exports.updateOrderStatus = updateOrderStatus;
