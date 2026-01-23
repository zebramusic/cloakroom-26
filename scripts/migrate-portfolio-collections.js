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

async function migrateCollections() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Source: portfolioitems (no underscore)
    const PortfolioItemsSource = mongoose.model('PortfolioItemsSource', new mongoose.Schema({}, { strict: false, collection: 'portfolioitems' }));
    const sourceItems = await PortfolioItemsSource.find({}).lean();
    console.log(`Found ${sourceItems.length} items in "portfolioitems"`);

    // Target: portfolio_items (with underscore)
    const PortfolioItemsTarget = mongoose.model('PortfolioItemsTarget', new mongoose.Schema({}, { strict: false, collection: 'portfolio_items' }));
    
    // Clear target first
    await PortfolioItemsTarget.deleteMany({});
    console.log('Cleared "portfolio_items" collection');

    // Copy items
    if (sourceItems.length > 0) {
      await PortfolioItemsTarget.insertMany(sourceItems);
      console.log(`✓ Copied ${sourceItems.length} items to "portfolio_items"\n`);
      
      sourceItems.forEach(item => {
        console.log(`  - ${item.localeContent?.ro?.title || 'Untitled'} (${item.slug})`);
      });
    }

    // Now check portfolio images collection
    const PortfolioImagesSource = mongoose.model('PortfolioImagesSource', new mongoose.Schema({}, { strict: false, collection: 'portfolioimages' }));
    const sourceImages = await PortfolioImagesSource.find({}).lean();
    console.log(`\nFound ${sourceImages.length} images in "portfolioimages"`);

    if (sourceImages.length > 0) {
      const PortfolioImagesTarget = mongoose.model('PortfolioImagesTarget', new mongoose.Schema({}, { strict: false, collection: 'portfolio_images' }));
      await PortfolioImagesTarget.deleteMany({});
      await PortfolioImagesTarget.insertMany(sourceImages);
      console.log(`✓ Copied ${sourceImages.length} images to "portfolio_images"`);
    }

    console.log('\n✅ Migration complete!');
    console.log('\nNOTE: Old collections "portfolioitems" and "portfolioimages" still exist.');
    console.log('You can delete them manually if everything works correctly.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

migrateCollections();
