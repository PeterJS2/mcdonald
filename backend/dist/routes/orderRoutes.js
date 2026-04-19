"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
// Customer can create order without login (kiosk)
router.post('/', orderController_1.createOrder);
// Admin & Kasir can manage orders
router.get('/', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(['admin', 'kasir']), orderController_1.getOrders);
router.patch('/:id/status', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(['admin', 'kasir']), orderController_1.updateOrderStatus);
exports.default = router;
