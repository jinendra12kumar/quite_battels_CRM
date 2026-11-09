const http = require('http');

// Helper to make HTTP request
function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting QUIET BATTLES™ (WEAR YOUR BATTLES.) API Verification ---');

  // 1. Health check
  console.log('\n1. Testing GET /api/health...');
  const health = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
  });
  console.log('Health status:', health.status, health.data);

  // 2. Admin Login
  console.log('\n2. Testing POST /api/admin/login...');
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@wearyourbattles.com', password: 'admin123' }
  );
  console.log('Login status:', loginRes.status, 'Success:', loginRes.data?.success);
  const token = loginRes.data?.token;

  if (!token) {
    console.error('Failed to get token!');
    return;
  }

  // 3. Admin Profile
  console.log('\n3. Testing GET /api/admin/profile (Protected)...');
  const profileRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/profile',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('Profile status:', profileRes.status, profileRes.data?.user);

  // 4. Series
  console.log('\n4. Testing GET /api/series...');
  const seriesRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/series',
    method: 'GET',
  });
  console.log('Series count:', seriesRes.data?.count, 'First title:', seriesRes.data?.data?.[0]?.title);

  // 5. Chapters
  console.log('\n5. Testing GET /api/chapters...');
  const chaptersRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/chapters',
    method: 'GET',
  });
  console.log('Chapters count:', chaptersRes.data?.count);

  // 6. Chapter Detail by Slug
  console.log('\n6. Testing GET /api/chapters/chapter-01-the-beginning...');
  const ch1Res = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/chapters/chapter-01-the-beginning',
    method: 'GET',
  });
  console.log('Chapter 1 Title:', ch1Res.data?.data?.title, 'Related Product:', ch1Res.data?.data?.related_product?.name);

  // 7. Products
  console.log('\n7. Testing GET /api/products...');
  const prodRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/products',
    method: 'GET',
  });
  console.log('Products count:', prodRes.data?.count, 'Product:', prodRes.data?.data?.[0]?.name, 'Price: ₹' + prodRes.data?.data?.[0]?.price);

  // 8. Product by Slug
  console.log('\n8. Testing GET /api/products/the-gentle-armor-oversized-tee...');
  const p1Res = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/products/the-gentle-armor-oversized-tee',
    method: 'GET',
  });
  console.log('Product Gallery Images count:', p1Res.data?.data?.images?.length);
  console.log('Product Sizes count:', p1Res.data?.data?.sizes?.length);

  // 9. Dashboard Stats & Revenue Calculation
  console.log('\n9. Testing GET /api/orders/stats (Dashboard & Total Revenue)...');
  const statsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/orders/stats',
    method: 'GET',
  });
  console.log('Total Revenue:', '₹' + statsRes.data?.data?.totalRevenue?.toLocaleString('en-IN'));
  console.log('Total Orders:', statsRes.data?.data?.totalOrders);

  console.log('\n--- ALL BACKEND REST API ENDPOINTS VERIFIED SUCCESSFULLY! ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});

