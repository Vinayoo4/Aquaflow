import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { contentDb } from '../storage/db';

export const getAllContent = (req: any, res: Response) => {
  const allContent = contentDb.readAll();
  const userRole = req.user?.role || 'guest';

  // If admin, return everything
  if (userRole === 'admin') {
    return res.json(allContent);
  }

  // Otherwise filter published only, but return summaries for all (even gated)
  // This allows the frontend to show gated content with padlocks
  const visible = allContent.filter((c: any) => {
    return c.isPublished;
  }).map((c: any) => {
    const summary = { ...c };
    const userTierId = req.user?.tierId || null;
    if (summary.requiredTierId && summary.requiredTierId !== userTierId) {
      delete summary.body;
    }
    return summary;
  });

  res.json(visible);
};

export const getContentById = (req: any, res: Response) => {
  const content: any = contentDb.readById(req.params.id as string);
  if (!content) return res.status(404).json({ error: 'Not found' });

  const userRole = req.user?.role || 'guest';
  const userTierId = req.user?.tierId || null;

  if (userRole !== 'admin') {
    if (!content.isPublished) return res.status(404).json({ error: 'Not found' });
    if (content.requiredTierId && content.requiredTierId !== userTierId) {
      return res.status(403).json({ error: 'Membership required' });
    }
  }

  res.json(content);
};

export const createContent = (req: Request, res: Response) => {
  const newContent = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const inserted = contentDb.insert(newContent);
  res.status(201).json(inserted);
};

export const updateContent = (req: Request, res: Response) => {
  const updates = { ...req.body, updatedAt: new Date().toISOString() };
  const updated = contentDb.update(req.params.id as string, updates);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
};

export const deleteContent = (req: Request, res: Response) => {
  const success = contentDb.delete(req.params.id as string);
  if (!success) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
};
