export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'member' | 'guest';
  firstName: string;
  lastName: string;
  tierId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'> & { password?: string };
