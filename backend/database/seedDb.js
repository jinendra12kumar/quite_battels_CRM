require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  console.log('Seeding Wear Your Battles database...');

  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

  try {
    const connection = await mysql.createConnection({
      host: DB_HOST || 'localhost',
      user: DB_USER || 'root',
      password: DB_PASSWORD || '',
      database: DB_NAME || 'wear_your_battles',
      port: Number(DB_PORT) || 3306,
    });

    console.log('Connected to MySQL. Cleaning existing records for clean seed...');

    // Disable FK checks temporarily for clean truncated seed
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('DROP TABLE IF EXISTS order_items');
    await connection.query('DROP TABLE IF EXISTS orders');
    await connection.query('TRUNCATE TABLE product_sizes');
    await connection.query('TRUNCATE TABLE product_images');
    await connection.query('TRUNCATE TABLE products');
    await connection.query('TRUNCATE TABLE chapters');
    await connection.query('TRUNCATE TABLE series');
    await connection.query('TRUNCATE TABLE admin_users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // 1. Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@wearyourbattles.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    await connection.execute(
      `INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      ['Creative Director', adminEmail, passwordHash, 'superadmin']
    );
    console.log(`Admin user created: ${adminEmail}`);

    // 2. Seed Series 01
    const [seriesResult] = await connection.execute(
      `INSERT INTO series (title, slug, tagline, description, cover_image, status, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'SERIES 01 – THE GENTLE ARMOR™',
        'series-01-the-gentle-armor',
        'Armor is not forged from iron alone. It is woven from intention, memory, and silence.',
        'An inaugural narrative collection examining the quiet resilience of everyday survival. Crafted with heavyweight Japanese drape fabrics and architectural proportions, Series 01 redefines modern garments as intimate shields against modern vulnerability.',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop',
        'published',
        1,
      ]
    );
    const seriesId = seriesResult.insertId;
    console.log(`Series created with ID: ${seriesId}`);

    // 3. Seed 5 Chapters
    const chaptersData = [
      {
        number: 1,
        title: 'CHAPTER 01 – THE BEGINNING',
        slug: 'chapter-01-the-beginning',
        subtitle: 'The Genesis of Vulnerability',
        description: 'Before strength can be built, vulnerability must be acknowledged. A study in raw canvas, drop-shoulder silhouettes, and unyielding intention.',
        content: `In the quiet before dawn, we assemble the pieces of who we intend to be.

The Beginning is not marked by fanfare or spectacle. It arrives in the quiet breath before the first step into the unknown. It is the realization that armor is not meant to hide who you are, but to preserve the sacred center while you fight battles nobody else can see.

Every stitch in this chapter was constructed around the philosophy of protective volume: generous chest room, dropped shoulder seamlines that contour naturally without rigidity, and a bespoke French terry weave that holds structural form while breathing like second skin.

We wear our scars not as apologies, but as medals of perseverance.`,
        cover_image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
        secondary_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
        design_philosophy: 'Heavyweight organic cotton drape engineered to offer spatial protection without restriction. A boxy silhouette that creates a serene personal territory for the wearer.',
        sort_order: 1,
      },
      {
        number: 2,
        title: 'CHAPTER 02 – SILENT STRENGTH',
        slug: 'chapter-02-silent-strength',
        subtitle: 'The Power of Stillness',
        description: 'True resilience does not need to roar. It endures in silence, composed in charcoal gradients and disciplined lines.',
        content: `Silence is not absence; it is concentrated presence.

Chapter 02 investigates the discipline of restraint. Where noise demands attention, quiet command earns reverence. The garments here speak through subtle geometric cuts, concealed seam pockets, and tactile contrasts between matte and brushed textures.

When chaos swirls outside, the body requires an emotional sanctuary. This silhouette grounds the posture, balancing weight evenly through tailored drapes that cascade without unnecessary embellishment.`,
        cover_image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200&auto=format&fit=crop',
        secondary_image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200&auto=format&fit=crop',
        design_philosophy: 'Monochrome discipline meets fluid motion. Garments that absorb light rather than reflect it, producing an aura of understated resolve.',
        sort_order: 2,
      },
      {
        number: 3,
        title: 'CHAPTER 03 – THE WEIGHT WE CARRY',
        slug: 'chapter-03-the-weight-we-carry',
        subtitle: 'Bearing Burden with Grace',
        description: 'Every individual carries invisible weights. Garments engineered to shoulder the burden with structured grace.',
        content: `What does a burden look like when you no longer run from it?

Chapter 03 confronts the heavy loads we shoulder in our careers, relationships, and private thoughts. Rather than masking the strain, we engineered garments that honor weight through density. 

Employing dense 380 GSM textiles, reinforced shoulder bands, and dual-layer hems, this chapter physically reflects how weight, when distributed properly, turns into anchoring stability.`,
        cover_image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop',
        secondary_image: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=1200&auto=format&fit=crop',
        design_philosophy: 'High-density knit construction that provides structural containment and tactile reassurance through every demanding day.',
        sort_order: 3,
      },
      {
        number: 4,
        title: 'CHAPTER 04 – FINDING BALANCE',
        slug: 'chapter-04-finding-balance',
        subtitle: 'Equilibrium in Motion',
        description: 'Harmonizing masculine structure and feminine fluidity. Asymmetry that reveals beauty in imperfection.',
        content: `Equilibrium is not static; it is an ongoing dance of micro-adjustments.

In Chapter 04, we explore asymmetric hemlines, offset button closures, and split seam details. Perfection is an illusion; harmony is reality. By accepting the shifting tides of daily life, the wearer moves effortlessly between high-pressure environments and quiet moments of reflection.`,
        cover_image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1200&auto=format&fit=crop',
        secondary_image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
        design_philosophy: 'Tension and release. Asymmetric drape lines that celebrate non-conformity while preserving timeless elegance.',
        sort_order: 4,
      },
      {
        number: 5,
        title: 'CHAPTER 05 – BECOMING WHOLE',
        slug: 'chapter-05-becoming-whole',
        subtitle: 'The Convergence of Trials',
        description: 'The culmination of all trials. Every scar integrated into an elevated, unified identity of modern grace.',
        content: `You do not become whole by erasing the past. You become whole by wearing it.

The final chapter of Series 01 marks the synthesis of every trial endured. Here, all signature construction motifs converge: the protective oversized collar, the raw-edged blind stitch, and the deep obsidian dyeing process.

To wear your battles is to realize you survived them all. You stand complete.`,
        cover_image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop',
        secondary_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
        design_philosophy: 'Total integration. Ultra-matte finishes with architectural precision, concluding the narrative arc with quiet triumph.',
        sort_order: 5,
      },
    ];

    const chapterIds = [];
    for (const chap of chaptersData) {
      const [res] = await connection.execute(
        `INSERT INTO chapters (series_id, chapter_number, title, slug, subtitle, description, content, cover_image, secondary_image, design_philosophy, sort_order, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          seriesId,
          chap.number,
          chap.title,
          chap.slug,
          chap.subtitle,
          chap.description,
          chap.content,
          chap.cover_image,
          chap.secondary_image,
          chap.design_philosophy,
          chap.sort_order,
          'published',
        ]
      );
      chapterIds.push(res.insertId);
    }
    console.log(`Created 5 chapters with IDs:`, chapterIds);

    // 4. Seed Demonstration Product (Connected to Chapter 01)
    const [prodResult] = await connection.execute(
      `INSERT INTO products (chapter_id, name, slug, tagline, description, details, composition, care_instructions, price, stock, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        chapterIds[0], // Chapter 01
        'THE GENTLE ARMOR – OVERSIZED TEE',
        'the-gentle-armor-oversized-tee',
        'Subtle weight. Architectural drape. Your daily shield.',
        'An uncompromising oversized silhouette cut from our proprietary 320 GSM French terry cotton. Featuring dropped shoulders, a reinforced 1.25" rib collar that retains shape perpetually, and blind-stitched hems for a seamless, floating profile. Designed to serve as an emotional sanctuary and tangible armor for the modern world.',
        '• Proprietary 320 GSM compact loopback French terry\n• Architectural dropped-shoulder cut with generous boxy drape\n• High-density tonal embroidery of brand motto on inner collar\n• Pre-shrunk and silicone-washed for broken-in softness from day one\n• Handcrafted in limited artisanal batches',
        '100% Combed Heavyweight Organic Cotton (320 GSM)',
        'Machine wash cold inside-out on delicate cycle. Lay flat to dry away from direct sunlight. Cool iron if desired. Do not bleach or dry clean.',
        1999.00,
        70,
        'published',
      ]
    );
    const productId = prodResult.insertId;
    console.log(`Created demonstration product with ID: ${productId}`);

    // 5. Seed Product Images
    const productImages = [
      {
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
        caption: 'Front Studio View - The Gentle Armor Oversized Tee in Deep Obsidian',
        is_primary: 1,
        sort_order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop',
        caption: 'Back Silhouette View - Dropped shoulder contour and drape',
        is_primary: 0,
        sort_order: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
        caption: 'Lifestyle Editorial - The Gentle Armor in natural architectural light',
        is_primary: 0,
        sort_order: 3,
      },
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
        caption: 'Macro Detail - 320 GSM French Terry weave and blind seam stitch',
        is_primary: 0,
        sort_order: 4,
      },
    ];

    for (const img of productImages) {
      await connection.execute(
        `INSERT INTO product_images (product_id, image_url, caption, is_primary, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [productId, img.url, img.caption, img.is_primary, img.sort_order]
      );
    }
    console.log('Seeded 4 product images');

    // 6. Seed Product Sizes (XS, S, M, L, XL, XXL)
    const sizes = [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 14 },
      { size: 'M', stock: 22 },
      { size: 'L', stock: 16 },
      { size: 'XL', stock: 10 },
      { size: 'XXL', stock: 5 },
    ];

    for (const s of sizes) {
      await connection.execute(
        `INSERT INTO product_sizes (product_id, size, stock) VALUES (?, ?, ?)`,
        [productId, s.size, s.stock]
      );
    }
    console.log('Seeded 6 product sizes (XS to XXL)');

    // 7. Seed Initial Orders for Revenue Calculation
    // Ensure table exists in case schema wasn't rerun
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`orders\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`order_code\` VARCHAR(50) NOT NULL UNIQUE,
        \`customer_name\` VARCHAR(150) NOT NULL,
        \`customer_email\` VARCHAR(150) NOT NULL,
        \`customer_phone\` VARCHAR(50) DEFAULT NULL,
        \`shipping_address\` TEXT NOT NULL,
        \`city\` VARCHAR(100) NOT NULL,
        \`postal_code\` VARCHAR(50) NOT NULL,
        \`total_amount\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        \`status\` ENUM('confirmed', 'processing', 'dispatched', 'delivered') NOT NULL DEFAULT 'confirmed',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`order_items\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`order_id\` INT NOT NULL,
        \`product_id\` INT DEFAULT NULL,
        \`product_name\` VARCHAR(255) NOT NULL,
        \`size\` VARCHAR(10) NOT NULL,
        \`quantity\` INT NOT NULL DEFAULT 1,
        \`unit_price\` DECIMAL(10,2) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    const initialOrders = [
      {
        code: 'QB-839102',
        name: 'Aiden Vance',
        email: 'aiden.vance@atelier.com',
        phone: '+91 98765 43210',
        address: '42 Obsidian Boulevard, High-Rise 7',
        city: 'Mumbai',
        postalCode: '400001',
        total: 3998.00,
        status: 'delivered',
        items: [{ size: 'L', qty: 2, price: 1999.00 }],
      },
      {
        code: 'QB-521940',
        name: 'Sarah Jenkins',
        email: 'sarah.j@monochrome.io',
        phone: '+91 98111 22334',
        address: '15 Kalaroop Enclave',
        city: 'New Delhi',
        postalCode: '110001',
        total: 1999.00,
        status: 'delivered',
        items: [{ size: 'M', qty: 1, price: 1999.00 }],
      },
      {
        code: 'QB-941028',
        name: 'Marcus Sterling',
        email: 'marcus@arch.studio',
        phone: '+91 99000 88776',
        address: '88 Residency Road, Richmond Town',
        city: 'Bengaluru',
        postalCode: '560025',
        total: 5997.00,
        status: 'dispatched',
        items: [{ size: 'XL', qty: 3, price: 1999.00 }],
      },
      {
        code: 'QB-104928',
        name: 'Elena Rostova',
        email: 'elena@couture.fr',
        phone: '+91 97654 32109',
        address: 'B-10 Park Street, Heritage Manor',
        city: 'Kolkata',
        postalCode: '700016',
        total: 1999.00,
        status: 'processing',
        items: [{ size: 'S', qty: 1, price: 1999.00 }],
      },
      {
        code: 'QB-731920',
        name: 'David Chen',
        email: 'david.chen@nomad.com',
        phone: '+91 98220 11223',
        address: 'Villa 12, Jubilee Hills Sector 3',
        city: 'Hyderabad',
        postalCode: '500033',
        total: 3998.00,
        status: 'confirmed',
        items: [{ size: 'M', qty: 2, price: 1999.00 }],
      },
    ];

    let totalSeedRevenue = 0;
    for (const ord of initialOrders) {
      const [ordRes] = await connection.execute(
        `INSERT INTO orders (order_code, customer_name, customer_email, customer_phone, shipping_address, city, postal_code, total_amount, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ord.code, ord.name, ord.email, ord.phone, ord.address, ord.city, ord.postalCode, ord.total, ord.status]
      );
      totalSeedRevenue += ord.total;

      for (const it of ord.items) {
        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, product_name, size, quantity, unit_price)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [ordRes.insertId, productId, 'THE GENTLE ARMOR – OVERSIZED TEE', it.size, it.qty, it.price]
        );
      }
    }
    console.log(`Seeded ${initialOrders.length} initial orders with total revenue: ₹${totalSeedRevenue.toLocaleString('en-IN')}`);

    console.log('\n===============================================');
    console.log('DATABASE SEEDED SUCCESSFULLY!');
    console.log(`Admin Email: ${adminEmail}`);
    console.log(`Admin Password: ${adminPassword}`);
    console.log('Series: SERIES 01 – THE GENTLE ARMOR™');
    console.log('Chapters: 5 seeded');
    console.log('Product: THE GENTLE ARMOR – OVERSIZED TEE (₹1,999.00)');
    console.log('===============================================\n');

    await connection.end();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

