import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', getCategories);
router.post('/', authMiddleware, roleMiddleware(['admin']), createCategory);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateCategory);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteCategory);

export default router;
