import express from 'express';
import { verifyAuth } from '../middlewares/authMiddleware.js';
import {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    reorderTodos
} from '../controllers/todoController.js';

const router = express.Router();

// All todo routes require authentication
router.use(verifyAuth);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/reorder', reorderTodos);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
