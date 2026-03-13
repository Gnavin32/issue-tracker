import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all issues for the logged-in tenant
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const issues = await prisma.issue.findMany({
      where: { tenantId: req.user!.tenantId },
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Create a new issue
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { title, description, priority } = req.body;
  try {
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        priority,
        tenantId: req.user!.tenantId,
        userId: req.user!.userId
      }
    });
    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Update an issue
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  const { status, priority, title, description } = req.body;
  try {
    const issue = await prisma.issue.findFirst({
      where: { id, tenantId: req.user!.tenantId }
    });

    if (!issue) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    const updated = await prisma.issue.update({
      where: { id },
      data: { status, priority, title, description }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Delete an issue
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  try {
    const issue = await prisma.issue.findFirst({
      where: { id, tenantId: req.user!.tenantId }
    });

    if (!issue) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    await prisma.issue.delete({ where: { id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;