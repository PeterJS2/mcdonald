import { Router } from 'express';
import { getOrders, createOrder, updateOrderStatus } from '../controllers/orderController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

// Customer can create order without login (kiosk)
router.post('/', createOrder);

// Admin & Kasir can manage orders
router.get('/', authMiddleware, roleMiddleware(['admin', 'kasir']), getOrders);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin', 'kasir']), updateOrderStatus);

export default router;
