import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { communityDb } from '../storage/db';

export const getPosts = (req: Request, res: Response) => {
  res.json(communityDb.readAll());
};

export const getPostById = (req: Request, res: Response) => {
  const post = communityDb.readById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }
  res.json(post);
};

export const createPost = (req: any, res: Response) => {
  const newPost = {
    id: uuidv4(),
    title: req.body.title,
    body: req.body.body,
    authorId: req.user.id,
    replies: [],
    replyCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.status(201).json(communityDb.insert(newPost));
};

export const createReply = (req: any, res: Response) => {
  const post: any = communityDb.readById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  const newReply = {
    id: uuidv4(),
    body: req.body.body,
    authorId: req.user.id,
    createdAt: new Date().toISOString()
  };

  if (!post.replies) post.replies = [];
  post.replies.push(newReply);
  post.replyCount = post.replies.length;
  post.updatedAt = new Date().toISOString();

  communityDb.update(req.params.id, post);

  res.status(201).json(newReply);
};
