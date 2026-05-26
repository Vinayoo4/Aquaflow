import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { membershipDb } from '../storage/db';

export const getAllTiers = (req: Request, res: Response) => {
  res.json(membershipDb.readAll());
};

export const createTier = (req: Request, res: Response) => {
  const newTier = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.status(201).json(membershipDb.insert(newTier));
};

export const updateTier = (req: Request, res: Response) => {
  const updated = membershipDb.update(req.params.id as string, { ...req.body, updatedAt: new Date().toISOString() });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
};
