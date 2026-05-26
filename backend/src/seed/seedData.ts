import { usersDb, contentDb, membershipDb } from '../storage/db';
import { hashPassword } from '../auth/auth';
import { v4 as uuidv4 } from 'uuid';

export const runSeed = async () => {
  console.log('Seeding data...');

  const memberships = membershipDb.readAll();
  if (memberships.length === 0) {
    membershipDb.insert({
      id: 'tier-1',
      name: 'Urban Gardening Club',
      description: 'Access to premium gardening guides and community.',
      price: 9.99,
      features: ['Premium Guides', 'Monthly QA'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  const users = usersDb.readAll();
  if (users.length === 0) {
    const adminHash = await hashPassword('admin123');
    usersDb.insert({
      id: uuidv4(),
      email: 'admin@saltedhash.com',
      passwordHash: adminHash,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      tierId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const memberHash = await hashPassword('member123');
    usersDb.insert({
      id: uuidv4(),
      email: 'member@example.com',
      passwordHash: memberHash,
      role: 'member',
      firstName: 'Sample',
      lastName: 'Member',
      tierId: 'tier-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  const content = contentDb.readAll();
  if (content.length === 0) {
    contentDb.insert({
      id: uuidv4(),
      type: 'guide',
      title: 'Getting Started with Balcony Tomatoes',
      slug: 'getting-started-balcony-tomatoes',
      excerpt: 'Learn the basics of growing tomatoes in small spaces.',
      body: 'Tomatoes need plenty of sunlight. Start with a 5-gallon container...',
      tags: ['gardening', 'tomatoes', 'urban'],
      isPublished: true,
      publishedAt: new Date().toISOString(),
      requiredTierId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    contentDb.insert({
      id: uuidv4(),
      type: 'guide',
      title: 'Advanced Pruning Techniques',
      slug: 'advanced-pruning-techniques',
      excerpt: 'Maximize your yield with proper pruning.',
      body: 'Identify suckers and remove them early in the season...',
      tags: ['gardening', 'advanced'],
      isPublished: true,
      publishedAt: new Date().toISOString(),
      requiredTierId: 'tier-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  console.log('Seed complete.');
};
