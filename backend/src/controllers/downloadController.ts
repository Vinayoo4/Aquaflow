import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { downloadsDb } from '../storage/db';

export const getAllDownloads = (req: any, res: Response) => {
  const allDownloads = downloadsDb.readAll();
  const userTierId = req.user?.tierId || null;
  const userRole = req.user?.role || 'guest';

  if (userRole === 'admin') {
    return res.json(allDownloads);
  }

  const visible = allDownloads.filter((d: any) => {
    if (d.requiredTierId === null) return true;
    return d.requiredTierId === userTierId;
  });

  res.json(visible);
};

export const createDownload = (req: Request, res: Response) => {
  const newDownload = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.status(201).json(downloadsDb.insert(newDownload));
};
