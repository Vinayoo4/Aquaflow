import { usersDb, contentDb, membershipDb, downloadsDb, plansDb } from '../storage/db';
import { hashPassword } from '../auth/auth';
import { v4 as uuidv4 } from 'uuid';

export const runSeed = async () => {
  console.log('Seeding data...');

  // Membership Tiers
  const memberships = membershipDb.readAll();
  if (memberships.length === 0) {
    membershipDb.insert({
      id: 'tier-1',
      name: 'Urban Gardening Club',
      description: 'Access to premium gardening guides, community forum, and exclusive resources.',
      price: 9.99,
      features: [
        'Premium Gardening Guides',
        'Monthly Q&A Sessions',
        'Community Forum Access',
        'Downloadable Resources',
        'Seasonal Planting Calendar',
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // Admin & Demo Users
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
    const memberId = uuidv4();
    usersDb.insert({
      id: memberId,
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

  // Content / Guides
  const content = contentDb.readAll();
  if (content.length === 0) {
    contentDb.insert({
      id: uuidv4(),
      type: 'guide',
      title: 'Getting Started with Balcony Tomatoes',
      slug: 'getting-started-balcony-tomatoes',
      excerpt: 'Learn the basics of growing delicious tomatoes in small urban spaces. From container selection to harvesting.',
      body: `Growing tomatoes on a balcony is one of the most rewarding urban gardening experiences. Here's everything you need to know to get started.

## Choosing Your Containers
Tomatoes need plenty of room for their roots. Start with a 5-gallon container at minimum. Ensure your pots have drainage holes — tomatoes hate sitting in water.

## Soil Selection
Use a high-quality potting mix, not garden soil. Look for a mix that includes perlite or vermiculite for drainage and peat moss or coconut coir for moisture retention.

## Sunlight Requirements
Tomatoes are sun-lovers. They need at least 6-8 hours of direct sunlight daily. If your balcony is shaded, consider growing cherry tomatoes, which are more tolerant of partial shade.

## Watering Schedule
Consistency is key. Water deeply when the top inch of soil feels dry. In hot weather, this may mean daily watering. Always water at the base to prevent leaf diseases.

## Feeding Your Plants
Tomatoes are heavy feeders. Use a balanced, slow-release fertilizer when planting, then switch to a phosphorus-rich fertilizer once flowers appear to encourage fruit development.

## Support Structures
As your tomato plants grow, they'll need support. Use cages, stakes, or a trellis system to keep plants upright and improve air circulation.

## Harvesting
Pick tomatoes when they're fully colored and slightly soft to the touch. Regular harvesting encourages more fruit production.

Happy growing!`,
      tags: ['gardening', 'tomatoes', 'urban', 'beginner'],
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
      excerpt: 'Maximize your yield with proper pruning techniques. Learn to identify suckers, manage growth, and improve air circulation.',
      body: `Pruning is one of the most important skills for maximizing your garden's productivity. Proper pruning leads to larger fruits, better air circulation, and reduced disease pressure.

## Why Prune?
Pruning directs the plant's energy into fruit production rather than leaf growth. It also improves air circulation, reducing the risk of fungal diseases.

## Identifying Suckers
Suckers are small shoots that grow in the crotch between the stem and a branch. Remove them early when they're small and easy to pinch off.

## The Two Schools: Determinate vs Indeterminate
Determinate (bush) tomatoes need minimal pruning — just remove suckers below the first flower cluster. Indeterminate (vining) tomatoes benefit from more aggressive pruning.

## When to Prune
Prune in the morning when plants are turgid. Use clean, sharp pruners. Remove no more than 1/3 of the plant's foliage at a time.

## The Missouri Pruning Method
For indeterminate varieties, pinch off just the tip of the sucker, leaving a few leaves. This provides some photosynthesis while controlling growth.

## Beyond Tomatoes
These same principles apply to peppers, eggplants, and many other garden vegetables.

Master these techniques and you'll see a dramatic improvement in your harvest quality and quantity.`,
      tags: ['gardening', 'advanced', 'pruning', 'techniques'],
      isPublished: true,
      publishedAt: new Date().toISOString(),
      requiredTierId: 'tier-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    contentDb.insert({
      id: uuidv4(),
      type: 'guide',
      title: 'Herbal Remedies for Common Ailments',
      slug: 'herbal-remedies-common-ailments',
      excerpt: 'Discover natural remedies using herbs you can grow in your own urban garden.',
      body: `Nature provides powerful medicine right in your backyard. Here's a guide to growing and using common medicinal herbs.

## Peppermint for Digestion
Easy to grow in containers, peppermint tea soothes digestive issues. Steep fresh leaves in hot water for 5-7 minutes.

## Lavender for Stress Relief
Lavender's calming aroma makes it perfect for sleep support. Dry the flowers for sachets or steep for tea.

## Echinacea for Immune Support
This beautiful purple coneflower boosts immune function. Use the roots and flowers to make a tea at the first sign of a cold.

## Calendula for Skin
Calendula flowers make a soothing salve for minor cuts and skin irritations. Infuse the petals in carrier oil for a week.

## Growing Your Medicine Cabinet
Most medicinal herbs are easy to grow in containers on a balcony or windowsill. They need well-draining soil and at least 4-6 hours of sunlight.

Always consult with a healthcare provider before using herbal remedies, especially if you're taking medications.`,
      tags: ['herbal', 'remedies', 'health', 'wellness'],
      isPublished: true,
      publishedAt: new Date().toISOString(),
      requiredTierId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    contentDb.insert({
      id: uuidv4(),
      type: 'guide',
      title: 'Seasonal Planting Calendar',
      slug: 'seasonal-planting-calendar',
      excerpt: 'A comprehensive guide to what to plant and when, organized by season and climate zone.',
      body: `Knowing when to plant is half the battle in gardening. This guide helps you plan your growing season.

## Spring (March-May)
Start seeds indoors: Tomatoes, peppers, eggplants (8 weeks before last frost)
Direct sow: Peas, spinach, lettuce, carrots, radishes
Transplant: Broccoli, cabbage, cauliflower

## Summer (June-August)
Plant heat-lovers: Basil, beans, corn, cucumbers, melons, squash
Succession plant: Lettuce, radishes, beans (every 2-3 weeks)
Harvest: Berries, tomatoes, peppers, zucchini

## Fall (September-November)
Cool-season crops: Broccoli, Brussels sprouts, kale, carrots
Garlic planting: Plant cloves 4-6 weeks before ground freezes
Cover crops: Winter rye, hairy vetch for soil building

## Winter (December-February)
Indoor projects: Start planning, order seeds, build indoor herb garden
Force bulbs: Paperwhites, amaryllis for winter blooms
Maintain: Clean and sharpen tools, organize seed storage

## Climate Zone Adjustments
Adjust these dates based on your local frost dates. Your county extension service can provide specific recommendations for your area.

Keep a garden journal to track your specific microclimate patterns year after year.`,
      tags: ['seasonal', 'planning', 'calendar', 'organization'],
      isPublished: true,
      publishedAt: new Date().toISOString(),
      requiredTierId: 'tier-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // Seed sample plans
  const plans = plansDb.readAll();
  if (plans.length === 0) {
    const sampleUserId = users.length > 0 ? users[0].id : 'sample-user';
    plansDb.insert({
      id: uuidv4(),
      userId: sampleUserId,
      title: 'Spring Balcony Garden',
      type: 'garden',
      description: 'Plan for my spring container garden on the balcony',
      items: [
        'Buy 5-gallon containers for tomatoes',
        'Purchase organic potting mix',
        'Start tomato seeds indoors (March 15)',
        'Set up drip irrigation system',
        'Install trellis for cucumbers',
        'Plant herb garden in window boxes',
      ],
      isDraft: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    plansDb.insert({
      id: uuidv4(),
      userId: sampleUserId,
      title: 'Weekly Meal Prep',
      type: 'meal',
      description: 'Farm-to-table meal planning with garden-fresh ingredients',
      items: [
        'Harvest tomatoes and basil on Sunday',
        'Make fresh pesto for the week',
        'Prepare vegetable stir-fry for Monday dinner',
        'Pack garden salads for lunch',
        'Freeze extra herbs in olive oil',
      ],
      isDraft: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // Seed download resources
  const downloads = downloadsDb.readAll();
  if (downloads.length === 0) {
    downloadsDb.insert({
      id: uuidv4(),
      title: 'Urban Garden Starter Checklist',
      description: 'A complete checklist of everything you need to start your urban garden.',
      category: 'checklist',
      downloadUrl: '#',
      requiredTierId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    downloadsDb.insert({
      id: uuidv4(),
      title: 'Monthly Garden Planner Template',
      description: 'Plan your gardening activities month by month with this customizable template.',
      category: 'template',
      downloadUrl: '#',
      requiredTierId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    downloadsDb.insert({
      id: uuidv4(),
      title: 'Companion Planting Guide',
      description: 'Know which plants grow well together and which to keep apart.',
      category: 'guide',
      downloadUrl: '#',
      requiredTierId: 'tier-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    downloadsDb.insert({
      id: uuidv4(),
      title: 'Seasonal Harvest Calendar',
      description: 'Know when to expect your harvest based on your planting schedule.',
      category: 'calendar',
      downloadUrl: '#',
      requiredTierId: 'tier-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  console.log('Seed complete.');
};