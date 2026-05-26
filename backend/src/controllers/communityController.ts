import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JsonStorage } from '../storage/jsonStorage';

const communityDb = new JsonStorage('community');

export const getPosts = (req: Request, res: Response) => {
  res.json(communityDb.readAll());
};

export const createPost = (req: any, res: Response) => {
  const newPost = {
    id: uuidv4(),
    userId: req.user.id,
    authorName: req.user.firstName || 'Member',
    ...req.body,
    createdAt: new Date().toISOString()
  };
  res.status(201).json(communityDb.insert(newPost));
};
