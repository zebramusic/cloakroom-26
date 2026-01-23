const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local for MONGODB_URI
const envPath = path.join(__dirname, '..', '.env.local');
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const uriMatch = envContent.match(/MONGODB_URI=(.+)/);
  if (uriMatch) {
    MONGODB_URI = uriMatch[1].trim();
  }
}

async function checkPortfolio() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Check all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('=== AVAILABLE COLLECTIONS ===');
    collections.forEach(c => console.log(`  - ${c.name}`));
    console.log('');

    const PortfolioItem = mongoose.model('PortfolioItem', new mongoose.Schema({}, { strict: false, collection: 'portfolio_items' }));

    const allItems = await PortfolioItem.find({}).lean();
    console.log('=== ALL PORTFOLIO ITEMS ===');
    console.log('Total items:', allItems.length);
    
    if (allItems.length > 0) {
      allItems.forEach(item => {
        console.log(`\n- ID: ${item._id}`);
        console.log(`  Slug: ${item.slug}`);
        console.log(`  Published: ${item.isPublished}`);
        console.log(`  Featured: ${item.isFeatured}`);
        console.log(`  Title (RO): ${item.localeContent?.ro?.title || 'N/A'}`);
        console.log(`  Cover Image: ${item.coverImageId || 'None'}`);
      });
    }

    const publishedItems = await PortfolioItem.find({ isPublished: true }).lean();
    console.log(`\n=== PUBLISHED ITEMS: ${publishedItems.length} ===`);

    const featuredItems = await PortfolioItem.find({ isPublished: true, isFeatured: true }).lean();
    console.log(`=== FEATURED ITEMS: ${featuredItems.length} ===\n`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkPortfolio();
