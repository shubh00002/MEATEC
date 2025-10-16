import { Router } from 'express';
import protect from '../middleware/auth.middleware';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller';

const router = Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
