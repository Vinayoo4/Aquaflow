const http = require('http');

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data ? JSON.parse(data) : null
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(body);
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('Running API Tests...');
  let adminToken = '';
  let memberToken = '';
  let premiumGuideId = '';

  try {
    // 1. POST /api/auth/login with wrong credentials (expect 401)
    console.log('Testing login with wrong credentials...');
    const wrongLogin = await request('POST', '/auth/login', JSON.stringify({ email: 'admin@saltedhash.com', password: 'wrong' }));
    if (wrongLogin.statusCode !== 401) throw new Error(`Expected 401, got ${wrongLogin.statusCode}`);
    console.log('✅ Login with wrong credentials passed (401).');

    // 2. POST /api/auth/login with correct credentials (expect 200 + token)
    console.log('Testing login with correct credentials (Admin)...');
    const adminLogin = await request('POST', '/auth/login', JSON.stringify({ email: 'admin@saltedhash.com', password: 'Admin@1234' }));
    if (adminLogin.statusCode !== 200 || !adminLogin.data.token) throw new Error('Admin login failed');
    adminToken = adminLogin.data.token;
    console.log('✅ Admin login passed (200 + token).');

    console.log('Testing login with correct credentials (Member)...');
    const memberLogin = await request('POST', '/auth/login', JSON.stringify({ email: 'member@saltedhash.com', password: 'Member@1234' }));
    if (memberLogin.statusCode !== 200 || !memberLogin.data.token) throw new Error('Member login failed');
    memberToken = memberLogin.data.token;
    console.log('✅ Member login passed (200 + token).');

    // 3. GET /api/content (expect array of guides)
    console.log('Testing GET /api/content...');
    const contentList = await request('GET', '/content');
    if (contentList.statusCode !== 200 || !Array.isArray(contentList.data)) throw new Error('Failed to fetch content array');

    // Find a premium guide from seed data (Admin login gets all in theory, but GET /content returns all public summaries)
    // Actually GET /content returns public and premium summaries
    const premiumGuide = contentList.data.find(g => g.requiredTierId !== null);
    if (!premiumGuide) throw new Error('No premium guide found in seed data');
    premiumGuideId = premiumGuide.id;
    console.log('✅ GET /api/content passed (200).');

    // 4. GET /api/content/:id for a premium guide without token (expect 403 or gated response)
    console.log('Testing GET /api/content/:id for premium guide without token...');
    const gatedContent = await request('GET', `/content/${premiumGuideId}`);
    if (gatedContent.statusCode !== 403) throw new Error(`Expected 403 for premium content without token, got ${gatedContent.statusCode}`);
    console.log('✅ Gated content endpoint passed (403).');

    // 5. POST /api/plans with auth token (expect 201)
    console.log('Testing POST /api/plans with token...');
    const newPlan = {
      id: `test-plan-${Date.now()}`,
      title: 'Test API Plan',
      type: 'garden',
      items: []
    };
    const createPlan = await request('POST', '/plans', JSON.stringify(newPlan), memberToken);
    // backend might return 201 or 200 for upsert
    if (createPlan.statusCode !== 201 && createPlan.statusCode !== 200) throw new Error(`Expected 201 or 200, got ${createPlan.statusCode}`);
    console.log('✅ POST /api/plans passed.');

    // 6. GET /api/admin/stats with admin token (expect 200)
    console.log('Testing GET /api/admin/stats with admin token...');
    const adminStats = await request('GET', '/admin/stats', null, adminToken);
    if (adminStats.statusCode !== 200) throw new Error(`Expected 200, got ${adminStats.statusCode}`);
    console.log('✅ Admin stats with admin token passed (200).');

    // 7. GET /api/admin/stats with member token (expect 403)
    console.log('Testing GET /api/admin/stats with member token...');
    const memberStats = await request('GET', '/admin/stats', null, memberToken);
    if (memberStats.statusCode !== 403) throw new Error(`Expected 403, got ${memberStats.statusCode}`);
    console.log('✅ Admin stats with member token passed (403).');

    console.log('\n🎉 All API tests passed successfully!');
  } catch (err) {
    console.error('\n❌ Test failed:', err.message || err);
    process.exit(1);
  }
};

runTests();
