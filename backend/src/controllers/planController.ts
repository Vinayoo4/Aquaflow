import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { plansDb } from '../storage/db';

export const getMyPlans = (req: any, res: Response) => {
  const userId = req.user.id;
  const plans = plansDb.readAll().filter((p: any) => p.userId === userId);
  res.json(plans);
};

export const createPlan = (req: any, res: Response) => {
  const newPlan = {
    id: uuidv4(),
    userId: req.user.id,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.status(201).json(plansDb.insert(newPlan));
};

export const updatePlan = (req: any, res: Response) => {
  const plan: any = plansDb.readById(req.params.id as string);
  if (!plan) return res.status(404).json({ error: 'Not found' });
  if (plan.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const updated = plansDb.update(req.params.id as string, { ...req.body, updatedAt: new Date().toISOString() });
  res.json(updated);
};

export const deletePlan = (req: any, res: Response) => {
  const plan: any = plansDb.readById(req.params.id as string);
  if (!plan) return res.status(404).json({ error: 'Not found' });
  if (plan.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  plansDb.delete(req.params.id as string);
  res.json({ success: true });
};
