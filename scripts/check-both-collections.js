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

async function checkBothCollections() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Check portfolioitems (no underscore)
    const PortfolioItems = mongoose.model('PortfolioItemsNoUnderscore', new mongoose.Schema({}, { strict: false, collection: 'portfolioitems' }));
    const itemsNoUnderscore = await PortfolioItems.find({}).lean();
    console.log('=== portfolioitems (no underscore) ===');
    console.log('Total:', itemsNoUnderscore.length);
    itemsNoUnderscore.forEach(item => {
      console.log(`\n- ID: ${item._id}`);
      console.log(`  Slug: ${item.slug}`);
      console.log(`  Published: ${item.isPublished}`);
      console.log(`  Featured: ${item.isFeatured}`);
      console.log(`  Title (RO): ${item.localeContent?.ro?.title || 'N/A'}`);
    });

    // Check portfolio_items (with underscore)
    const PortfolioItemsUnderscore = mongoose.model('PortfolioItemsWithUnderscore', new mongoose.Schema({}, { strict: false, collection: 'portfolio_items' }));
    const itemsWithUnderscore = await PortfolioItemsUnderscore.find({}).lean();
    console.log('\n\n=== portfolio_items (with underscore) ===');
    console.log('Total:', itemsWithUnderscore.length);

    if (itemsNoUnderscore.length > 0 && itemsWithUnderscore.length === 0) {
      console.log('\n⚠️  ISSUE FOUND:');
      console.log('Items exist in "portfolioitems" but app is looking at "portfolio_items"');
      console.log('\nSOLUTION: Copy items from portfolioitems to portfolio_items');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkBothCollections();
