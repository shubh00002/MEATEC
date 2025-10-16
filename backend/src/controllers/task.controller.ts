import { Request, Response } from 'express';
import prisma from '../config/db';

// CHANGE: The type for userId is now a string
type AuthRequest = Request & { user?: { userId: string } };

/** GET /api/tasks  →  fetch all tasks for the logged-in user */
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      // No change needed here, it works as is
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (err: any) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
};

/** POST /api/tasks  →  create a new task */
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });

    const task = await prisma.task.create({
      // No change needed here, it works as is
      data: { title, description, userId: req.user!.userId }
    });
    res.status(201).json(task);
  } catch (err: any) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};

/** PUT /api/tasks/:id  →  update an existing task */
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // id is already a string
    const { title, description, status } = req.body;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user!.userId)
      return res.status(404).json({ message: 'Task not found or unauthorized' });

    const updated = await prisma.task.update({
      where: { id }, // Pass the string id directly
      data: { title, description, status }
    });

    res.json(updated);
  } catch (err: any) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
};

/** DELETE /api/tasks/:id  →  delete a task */
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // id is already a string
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user!.userId)
      return res.status(404).json({ message: 'Task not found or unauthorized' });

    await prisma.task.delete({ where: { id } }); // Pass the string id directly
    res.json({ message: 'Task deleted' });
  } catch (err: any) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
};
