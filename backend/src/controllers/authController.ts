import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { usersDb } from '../storage/db';
import { hashPassword, verifyPassword, generateToken } from '../auth/auth';

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const existingUsers = usersDb.readAll();
  if (existingUsers.find((u: any) => u.email === email)) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  const passwordHash = await hashPassword(password);
  const newUser = {
    id: uuidv4(),
    email,
    passwordHash,
    role: 'member',
    firstName: firstName || '',
    lastName: lastName || '',
    tierId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  usersDb.insert(newUser);
  const token = generateToken({ id: newUser.id, role: newUser.role, tierId: newUser.tierId });
  res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, role: newUser.role, firstName: newUser.firstName } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const users = usersDb.readAll();
  const user: any = users.find((u: any) => u.email === email);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken({ id: user.id, role: user.role, tierId: user.tierId });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName } });
};

export const me = (req: any, res: Response) => {
  const users = usersDb.readAll();
  const user: any = users.find((u: any) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, tierId: user.tierId } });
};
