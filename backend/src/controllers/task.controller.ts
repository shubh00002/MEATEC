import { Request, Response } from 'express';
import prisma from '../config/db';

/**  GET /api/tasks  →  fetch all tasks for the logged-in user */
export const getTasks = async (req: Request & { user?: { userId: number } }, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (err: any) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
};

/**  POST /api/tasks  →  create a new task */
export const createTask = async (req: Request & { user?: { userId: number } }, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });

    const task = await prisma.task.create({
      data: { title, description, userId: req.user!.userId }
    });
    res.status(201).json(task);
  } catch (err: any) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};

/**  PUT /api/tasks/:id  →  update an existing task */
export const updateTask = async (req: Request & { user?: { userId: number } }, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const existing = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!existing || existing.userId !== req.user!.userId)
      return res.status(404).json({ message: 'Task not found or unauthorized' });

    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, description, status }
    });

    res.json(updated);
  } catch (err: any) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
};

/**  DELETE /api/tasks/:id  →  delete a task */
export const deleteTask = async (req: Request & { user?: { userId: number } }, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!existing || existing.userId !== req.user!.userId)
      return res.status(404).json({ message: 'Task not found or unauthorized' });

    await prisma.task.delete({ where: { id: Number(id) } });
    res.json({ message: 'Task deleted' });
  } catch (err: any) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
};
