import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { auditDb } from '../storage/db';

export const logAdminAction = (req: any, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  res.send = function (data) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        auditDb.insert({
          id: uuidv4(),
          userId: req.user?.id || 'system',
          userRole: req.user?.role || 'system',
          action: req.method,
          path: req.originalUrl,
          timestamp: new Date().toISOString()
        });
      }
    }
    return originalSend.apply(res, arguments as any);
  };
  next();
};
