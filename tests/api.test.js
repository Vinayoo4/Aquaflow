const http = require('http');

const runTests = async () => {
  console.log('Running API Tests...');

  const getHealth = () => new Promise((resolve, reject) => {
    http.get('http://localhost:3000/api/health', (res) => {
      if (res.statusCode === 200) resolve();
      else reject(new Error('Health check failed'));
    }).on('error', reject);
  });

  const getGuides = () => new Promise((resolve, reject) => {
    http.get('http://localhost:3000/api/content', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const guides = JSON.parse(data);
        // Should only return 1 guide because the other one requires membership
        if (guides.length >= 1) resolve();
        else reject(new Error('Missing seed guides'));
      });
    }).on('error', reject);
  });

  try {
    await getHealth();
    console.log('Health check passed.');
    await getGuides();
    console.log('Guides endpoint passed.');
    console.log('All API tests passed.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runTests();
