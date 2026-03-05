import mongoose, { Schema, Document, Model } from 'mongoose';

// Re-export site models
export * from './models/site';

// ==================== USER & AUTH ====================

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'manager' | 'support' | 'editor' | 'customer';
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'support', 'editor', 'customer'],
    default: 'customer' 
  },
  phone: String,
  avatarUrl: String,
  isActive: { type: Boolean, default: true },
  emailVerified: Date,
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// ==================== QUOTES ====================

export interface IQuote extends Document {
  quoteNumber: string;
  eventType: string;
  eventName?: string;
  startDate: Date;
  endDate?: Date;
  estimatedParticipants: number;
  location: string;
  notes?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany?: string;
  clientRole?: string;
  needsCloakroom: boolean;
  needsVip: boolean;
  needsBackstage: boolean;
  needsBagCheck: boolean;
  needsInfrastructure: boolean;
  constraints?: string;
  budgetRange?: string;
  referralSource?: string;
  status: 'new' | 'in-review' | 'offer-sent' | 'negotiation' | 'booked' | 'completed' | 'cancelled';
  totalPrice?: number;
  internalNotes?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>({
  quoteNumber: { type: String, required: true, unique: true },
  eventType: { type: String, required: true },
  eventName: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  estimatedParticipants: { type: Number, required: true, min: 100, max: 12000 },
  location: { type: String, required: true },
  notes: String,
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  clientCompany: String,
  clientRole: String,
  needsCloakroom: { type: Boolean, default: false },
  needsVip: { type: Boolean, default: false },
  needsBackstage: { type: Boolean, default: false },
  needsBagCheck: { type: Boolean, default: false },
  needsInfrastructure: { type: Boolean, default: false },
  constraints: String,
  budgetRange: String,
  referralSource: String,
  status: { 
    type: String, 
    enum: ['new', 'in-review', 'offer-sent', 'negotiation', 'booked', 'completed', 'cancelled'],
    default: 'new'
  },
  totalPrice: Number,
  internalNotes: String,
  respondedAt: Date,
}, { timestamps: true });

export const Quote: Model<IQuote> = mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);

// ==================== PARTNERS ====================

export interface IPartner extends Document {
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  description?: string;
  isActive: boolean;
  orderNumber: number;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new Schema<IPartner>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logo: String,
  website: String,
  contactEmail: String,
  contactPhone: String,
  description: String,
  isActive: { type: Boolean, default: true },
  orderNumber: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Partner: Model<IPartner> = mongoose.models.Partner || mongoose.model<IPartner>('Partner', PartnerSchema);

// ==================== PRODUCTS ====================

export interface IProductVariant {
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface IProduct extends Document {
  name: string; // Kept for backwards compatibility, will use localeContent.ro.name
  slug: string;
  description?: string; // Kept for backwards compatibility
  shortDescription?: string; // Kept for backwards compatibility
  localeContent: {
    ro: {
      name: string;
      description?: string;
      shortDescription?: string;
    };
    en: {
      name: string;
      description?: string;
      shortDescription?: string;
    };
  };
  category: string;
  subcategory?: string;
  basePrice: number;
  compareAtPrice?: number;
  taxRate: number; // VAT rate as decimal (0.19 = 19%)
  images: {
    url: string;
    alt?: string;
    is_primary?: boolean;
  }[];
  variants: IProductVariant[];
  trackInventory?: boolean;
  lowStockThreshold?: number;
  isReturnable?: boolean;
  stock: number;
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit?: string;
  };
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true }, // Backwards compatibility
  slug: { type: String, required: true, unique: true },
  description: String, // Backwards compatibility
  shortDescription: String, // Backwards compatibility
  localeContent: {
    ro: {
      name: { type: String, required: true },
      description: String,
      shortDescription: String,
    },
    en: {
      name: { type: String, default: '' },
      description: String,
      shortDescription: String,
    },
  },
  category: { type: String, required: true },
  subcategory: String,
  basePrice: { type: Number, required: true },
  compareAtPrice: Number,
  taxRate: { type: Number, default: 0.21 }, // Default 21% VAT for Romania
  images: [{
    url: { type: String, required: true },
    alt: String,
    is_primary: { type: Boolean, default: false },
  }],
  variants: [{
    sku: String,
    name: String,
    price: Number,
    compareAtPrice: Number,
    stock: Number,
    attributes: Schema.Types.Mixed,
  }],
  trackInventory: { type: Boolean, default: true },
  lowStockThreshold: { type: Number, default: 5 },
  isReturnable: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  sku: { type: String, required: true, unique: true },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: "cm" },
  },
  tags: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  metaTitle: String,
  metaDescription: String,
}, { timestamps: true });

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

// ==================== ORDERS ====================

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  sku: string;
  variantId?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId?: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId; // Link to Customer collection for claiming
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  deliveryFee?: number;
  codFee?: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentIntentId?: string;
  shippingMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', index: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    variantId: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  }],
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  codFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: { type: String, required: true },
  paymentIntentId: String,
  shippingMethod: { type: String, required: true },
  trackingNumber: String,
  notes: String,
}, { timestamps: true });

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

// ==================== CATEGORIES ====================

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: mongoose.Types.ObjectId;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  parentId: { type: Schema.Types.ObjectId, ref: 'Category' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

// ==================== BLOG ====================

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: string;
  authorId?: mongoose.Types.ObjectId;
  featuredImage?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  viewCount: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  featuredImage: String,
  category: { type: String, required: true },
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  publishedAt: Date,
  viewCount: { type: Number, default: 0 },
  metaTitle: String,
  metaDescription: String,
}, { timestamps: true });

export const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

// ==================== FAQ ====================

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  locale: 'ro' | 'en';
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  locale: { type: String, enum: ['ro', 'en'], default: 'ro' },
}, { timestamps: true });

export const FAQ: Model<IFAQ> = mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);

// ==================== PORTFOLIO ====================

export interface IPortfolioItem extends Document {
  slug: string;
  localeContent: {
    ro: {
      title: string;
      excerpt: string;
      body: string;
    };
    en: {
      title: string;
      excerpt: string;
      body: string;
    };
  };
  eventMeta: {
    eventType?: string;
    location?: string;
    startsAt?: Date;
    endsAt?: Date;
  };
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  isFeatured: boolean;
  orderIndex: number;
  coverImageId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioItemSchema = new Schema<IPortfolioItem>({
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  localeContent: {
    ro: {
      title: { type: String, required: true },
      excerpt: { type: String, required: true },
      body: { type: String, default: '' },
    },
    en: {
      title: { type: String, default: '' },
      excerpt: { type: String, default: '' },
      body: { type: String, default: '' },
    },
  },
  eventMeta: {
    eventType: String,
    location: String,
    startsAt: Date,
    endsAt: Date,
  },
  tags: [{ type: String, trim: true }],
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  isFeatured: { type: Boolean, default: false },
  orderIndex: { type: Number, default: 0 },
  coverImageId: { type: Schema.Types.ObjectId, ref: 'PortfolioImage' },
}, { timestamps: true, collection: 'portfolio_items' });

// Indexes (slug index is automatic from unique: true in schema)
PortfolioItemSchema.index({ isPublished: 1, isFeatured: 1, orderIndex: 1 });
PortfolioItemSchema.index({ tags: 1 });
PortfolioItemSchema.index({ 'localeContent.ro.title': 'text', 'localeContent.en.title': 'text' });

export const PortfolioItem: Model<IPortfolioItem> = mongoose.models.PortfolioItem || mongoose.model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema);

export interface IPortfolioImage extends Document {
  portfolioItemId: mongoose.Types.ObjectId;
  variants: {
    thumbUrl: string;
    mediumUrl: string;
    originalUrl: string;
  };
  width?: number;
  height?: number;
  altText: {
    ro: string;
    en: string;
  };
  caption: {
    ro: string;
    en: string;
  };
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioImageSchema = new Schema<IPortfolioImage>({
  portfolioItemId: { type: Schema.Types.ObjectId, ref: 'PortfolioItem', required: true },
  variants: {
    thumbUrl: { type: String, required: true },
    mediumUrl: { type: String, required: true },
    originalUrl: { type: String, required: true },
  },
  width: Number,
  height: Number,
  altText: {
    ro: { type: String, default: '' },
    en: { type: String, default: '' },
  },
  caption: {
    ro: { type: String, default: '' },
    en: { type: String, default: '' },
  },
  orderIndex: { type: Number, default: 0 },
}, { timestamps: true, collection: 'portfolio_images' });

// Indexes
PortfolioImageSchema.index({ portfolioItemId: 1, orderIndex: 1 });

export const PortfolioImage: Model<IPortfolioImage> = mongoose.models.PortfolioImage || mongoose.model<IPortfolioImage>('PortfolioImage', PortfolioImageSchema);
