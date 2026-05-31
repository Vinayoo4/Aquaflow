import { usersDb, contentDb, membershipDb, plansDb, downloadsDb, communityDb } from '../storage/db';
import { hashPassword } from '../auth/auth';
import { v4 as uuidv4 } from 'uuid';

export const runSeed = async () => {
  console.log('Seeding data...');

  const memberships = membershipDb.readAll();
  if (memberships.length === 0) {
    membershipDb.insert({
      id: 'basic-tier-id',
      name: 'Basic Member',
      description: 'Free basic access.',
      price: 0,
      features: ['Basic Guides'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    membershipDb.insert({
      id: 'premium-tier-id',
      name: 'Premium Member',
      description: 'Access to premium guides, community, and downloads.',
      price: 5.00,
      features: ['Premium Guides', 'Community', 'Downloads'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  let adminId = '';
  let memberId = '';
  const users = usersDb.readAll();
  if (users.length === 0) {
    const adminHash = await hashPassword('Admin@1234');
    adminId = uuidv4();
    usersDb.insert({
      id: adminId,
      email: 'admin@saltedhash.com',
      passwordHash: adminHash,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      tierId: 'premium-tier-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const memberHash = await hashPassword('Member@1234');
    memberId = uuidv4();
    usersDb.insert({
      id: memberId,
      email: 'member@saltedhash.com',
      passwordHash: memberHash,
      role: 'member',
      firstName: 'Sample',
      lastName: 'Member',
      tierId: 'premium-tier-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } else {
    adminId = users.find(u => u.role === 'admin')?.id || '';
    memberId = users.find(u => u.role === 'member')?.id || '';
  }

  const content = contentDb.readAll();
  if (content.length === 0) {
    contentDb.insert({
      id: uuidv4(),
      type: 'guide',
      title: 'Getting Started with Balcony Tomatoes',
      slug: 'getting-started-balcony-tomatoes',
      excerpt: 'Learn the basics of growing tomatoes in small spaces.',
      body: '## Tomato Growing\n\nTomatoes need plenty of sunlight. Start with a 5-gallon container...',
      tags: ['gardening', 'tomatoes', 'urban'],
      categoryId: 'gardening',
      isPublished: true,
      publishedAt: new Date().toISOString(),
      requiredTierId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: adminId,
      readTime: 5
    });

    contentDb.insert({
      id: uuidv4(),
      type: 'guide',
      title: 'Advanced Pruning Techniques',
      slug: 'advanced-pruning-techniques',
      excerpt: 'Maximize your yield with proper pruning.',
      body: '## Pruning Guide\n\nIdentify suckers and remove them early in the season...',
      tags: ['gardening', 'advanced'],
      categoryId: 'gardening',
      isPublished: true,
      publishedAt: new Date().toISOString(),
      requiredTierId: 'premium-tier-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: adminId,
      readTime: 8
    });

    contentDb.insert({
      id: uuidv4(),
      type: 'guide',
      title: 'Healing Herbs for Beginners',
      slug: 'healing-herbs-beginners',
      excerpt: 'Grow your own medicinal herbs.',
      body: '## Medicinal Herbs\n\nMint, chamomile, and lavender are great to start with...',
      tags: ['herbal', 'health'],
      categoryId: 'herbal',
      isPublished: true,
      publishedAt: new Date().toISOString(),
      requiredTierId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: adminId,
      readTime: 4
    });

    contentDb.insert({
      id: uuidv4(),
      type: 'guide',
      title: 'Vegan Meal Staples',
      slug: 'vegan-meal-staples',
      excerpt: 'Essential ingredients for a plant-based diet.',
      body: '## Pantry Staples\n\nStock up on beans, lentils, and fresh greens...',
      tags: ['food', 'vegan'],
      categoryId: 'food',
      isPublished: true,
      publishedAt: new Date().toISOString(),
      requiredTierId: 'premium-tier-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: adminId,
      readTime: 6
    });

    contentDb.insert({
      id: uuidv4(),
      type: 'guide',
      title: 'Sunday Meal Prep Strategy',
      slug: 'sunday-meal-prep',
      excerpt: 'Save time during the week by prepping on Sunday.',
      body: '## Meal Prep\n\nCook grains in bulk and chop veggies in advance...',
      tags: ['meal-prep', 'planning'],
      categoryId: 'meal-prep',
      isPublished: true,
      publishedAt: new Date().toISOString(),
      requiredTierId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: adminId,
      readTime: 7
    });
  }

  const plans = plansDb.readAll();
  if (plans.length === 0) {
    plansDb.insert({
      id: uuidv4(),
      userId: memberId,
      type: 'meal',
      title: 'Weekly Family Meal Plan',
      items: [
        { id: uuidv4(), day: 'Monday', meal: 'breakfast', value: 'Oatmeal' },
        { id: uuidv4(), day: 'Monday', meal: 'lunch', value: 'Salad' },
        { id: uuidv4(), day: 'Monday', meal: 'dinner', value: 'Pasta' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    plansDb.insert({
      id: uuidv4(),
      userId: memberId,
      type: 'garden',
      title: 'Spring Garden Tasks',
      items: [
        { id: uuidv4(), plantName: 'Tomatoes', action: 'water', scheduledDate: new Date().toISOString().split('T')[0], done: false }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  const downloads = downloadsDb.readAll();
  if (downloads.length === 0) {
    downloadsDb.insert({
      id: 'calendar',
      title: 'Gardening Calendar PDF',
      description: 'A year-round printable calendar for your garden.',
      fileType: 'pdf',
      fileSize: 102400, // 100 KB
      requiredTierId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    downloadsDb.insert({
      id: 'template',
      title: 'Meal Prep Template',
      description: 'A printable weekly meal prep worksheet.',
      fileType: 'pdf',
      fileSize: 51200, // 50 KB
      requiredTierId: 'premium-tier-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  const posts = communityDb.readAll();
  if (posts.length === 0) {
    const post1Id = uuidv4();
    communityDb.insert({
      id: post1Id,
      title: 'Best tips for aphids?',
      body: 'I am seeing a lot of aphids on my roses. Any natural remedies?',
      authorId: adminId,
      replies: [
        {
          id: uuidv4(),
          body: 'Neem oil works wonders!',
          authorId: memberId,
          createdAt: new Date().toISOString()
        }
      ],
      replyCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const post2Id = uuidv4();
    communityDb.insert({
      id: post2Id,
      title: 'What to plant in October?',
      body: 'Getting ready for fall gardening. Suggestions?',
      authorId: memberId,
      replies: [
        {
          id: uuidv4(),
          body: 'Garlic and onions are great right now.',
          authorId: adminId,
          createdAt: new Date().toISOString()
        }
      ],
      replyCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  console.log('Seed complete.');
};
