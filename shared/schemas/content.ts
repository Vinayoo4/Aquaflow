export interface Content {
  id: string;
  type: 'guide' | 'article' | 'recipe';
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  requiredTierId: string | null; // null = public
  createdAt: string;
  updatedAt: string;
}
