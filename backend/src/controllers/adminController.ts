import { Request, Response } from 'express';
import { usersDb, contentDb, plansDb, auditDb } from '../storage/db';

export const getStats = (req: Request, res: Response) => {
  const usersCount = usersDb.readAll().length;
  const contentCount = contentDb.readAll().length;
  const plansCount = plansDb.readAll().length;
  res.json({ usersCount, contentCount, plansCount });
};

export const getAuditLogs = (req: Request, res: Response) => {
  res.json(auditDb.readAll().reverse().slice(0, 50));
};
