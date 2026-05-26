import { JsonStorage } from './jsonStorage';

export const usersDb = new JsonStorage<any>('users');
export const contentDb = new JsonStorage<any>('content');
export const membershipDb = new JsonStorage<any>('membership');
export const plansDb = new JsonStorage<any>('plans');
export const downloadsDb = new JsonStorage<any>('downloads');
export const auditDb = new JsonStorage<any>('audit');
