import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', getProducts);
router.post('/', authMiddleware, roleMiddleware(['admin']), createProduct);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteProduct);

export default router;
