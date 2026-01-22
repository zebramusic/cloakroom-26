import mongoose, { Schema, Document, Model } from 'mongoose';

// ==================== SITE NAVIGATION ====================

export interface INavigationItem {
  id: string;
  type: 'link' | 'dropdown';
  label: string;
  href?: string;
  visibility: 'public' | 'logged_in_customer' | 'hidden';
  orderIndex: number;
  children?: INavigationItem[];
}

export interface ISiteNavigation extends Document {
  key: string; // 'main' | 'footer-secondary' etc
  localeData: {
    ro: {
      items: INavigationItem[];
    };
    en: {
      items: INavigationItem[];
    };
  };
  status: 'draft' | 'published';
  version: number;
  createdBy: mongoose.Types.ObjectId;
  publishedAt?: Date;
  publishedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NavigationItemSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['link', 'dropdown'], required: true },
  label: { type: String, required: true },
  href: String,
  visibility: { 
    type: String, 
    enum: ['public', 'logged_in_customer', 'hidden'],
    default: 'public'
  },
  orderIndex: { type: Number, default: 0 },
  children: [{ type: Schema.Types.Mixed }], // Recursive
}, { _id: false });

const SiteNavigationSchema = new Schema<ISiteNavigation>({
  key: { type: String, required: true },
  localeData: {
    ro: {
      items: [NavigationItemSchema],
    },
    en: {
      items: [NavigationItemSchema],
    },
  },
  status: { 
    type: String, 
    enum: ['draft', 'published'],
    default: 'draft'
  },
  version: { type: Number, default: 1 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  publishedAt: Date,
  publishedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

SiteNavigationSchema.index({ key: 1, status: 1 });
SiteNavigationSchema.index({ key: 1, version: -1 });

export const SiteNavigation: Model<ISiteNavigation> = 
  mongoose.models.SiteNavigation || mongoose.model<ISiteNavigation>('SiteNavigation', SiteNavigationSchema);

// ==================== SITE FOOTER ====================

export interface IFooterLink {
  id: string;
  label: string;
  href: string;
  orderIndex: number;
}

export interface IFooterColumn {
  id: string;
  title: string;
  links: IFooterLink[];
  orderIndex: number;
}

export interface ISiteFooter extends Document {
  key: string; // 'main'
  localeData: {
    ro: {
      columns: IFooterColumn[];
      contact: {
        address: string;
        phone: string;
        email: string;
        businessHours: string;
      };
      social: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        twitter?: string;
      };
      legal: IFooterLink[];
      copyright: string;
    };
    en: {
      columns: IFooterColumn[];
      contact: {
        address: string;
        phone: string;
        email: string;
        businessHours: string;
      };
      social: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        twitter?: string;
      };
      legal: IFooterLink[];
      copyright: string;
    };
  };
  status: 'draft' | 'published';
  version: number;
  createdBy: mongoose.Types.ObjectId;
  publishedAt?: Date;
  publishedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FooterLinkSchema = new Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  href: { type: String, required: true },
  orderIndex: { type: Number, default: 0 },
}, { _id: false });

const FooterColumnSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  links: [FooterLinkSchema],
  orderIndex: { type: Number, default: 0 },
}, { _id: false });

const SiteFooterSchema = new Schema<ISiteFooter>({
  key: { type: String, required: true },
  localeData: {
    ro: {
      columns: [FooterColumnSchema],
      contact: {
        address: String,
        phone: String,
        email: String,
        businessHours: String,
      },
      social: {
        facebook: String,
        instagram: String,
        linkedin: String,
        twitter: String,
      },
      legal: [FooterLinkSchema],
      copyright: String,
    },
    en: {
      columns: [FooterColumnSchema],
      contact: {
        address: String,
        phone: String,
        email: String,
        businessHours: String,
      },
      social: {
        facebook: String,
        instagram: String,
        linkedin: String,
        twitter: String,
      },
      legal: [FooterLinkSchema],
      copyright: String,
    },
  },
  status: { 
    type: String, 
    enum: ['draft', 'published'],
    default: 'draft'
  },
  version: { type: Number, default: 1 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  publishedAt: Date,
  publishedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

SiteFooterSchema.index({ key: 1, status: 1 });
SiteFooterSchema.index({ key: 1, version: -1 });

export const SiteFooter: Model<ISiteFooter> = 
  mongoose.models.SiteFooter || mongoose.model<ISiteFooter>('SiteFooter', SiteFooterSchema);

// ==================== SITE PAGES & BLOCKS ====================

export type BlockType = 
  | 'hero' 
  | 'featureGrid' 
  | 'cta';

export interface IContentBlock {
  id: string;
  type: BlockType;
  data: any; // Typed per block type (validated with Zod)
  visibility: 'public' | 'hidden';
  orderIndex: number;
}

export interface ISitePage extends Document {
  key: string; // 'home' | 'services' | 'industries' | 'pricing' | 'about' | 'contact' | 'legal-terms' | 'legal-privacy' | 'legal-cookies' | 'blog-index'
  slug: string; // URL slug
  localeData: {
    ro: {
      headline?: string;
      intro?: string;
      blocks: IContentBlock[];
      seo: {
        title: string;
        description: string;
        ogImage?: string;
        canonical?: string;
      };
    };
    en: {
      headline?: string;
      intro?: string;
      blocks: IContentBlock[];
      seo: {
        title: string;
        description: string;
        ogImage?: string;
        canonical?: string;
      };
    };
  };
  status: 'draft' | 'published';
  version: number;
  createdBy: mongoose.Types.ObjectId;
  publishedAt?: Date;
  publishedBy?: mongoose.Types.ObjectId;
  previewToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContentBlockSchema = new Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['hero', 'featureGrid', 'cta'],
    required: true 
  },
  data: { type: Schema.Types.Mixed, required: true },
  visibility: { 
    type: String, 
    enum: ['public', 'hidden'],
    default: 'public'
  },
  orderIndex: { type: Number, default: 0 },
}, { _id: false });

const SitePageSchema = new Schema<ISitePage>({
  key: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['home', 'services', 'industries', 'pricing', 'about', 'contact', 'legal-terms', 'legal-privacy', 'legal-cookies', 'blog-index']
  },
  slug: { type: String, required: true },
  localeData: {
    ro: {
      headline: String,
      intro: String,
      blocks: [ContentBlockSchema],
      seo: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        ogImage: String,
        canonical: String,
      },
    },
    en: {
      headline: String,
      intro: String,
      blocks: [ContentBlockSchema],
      seo: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        ogImage: String,
        canonical: String,
      },
    },
  },
  status: { 
    type: String, 
    enum: ['draft', 'published'],
    default: 'draft'
  },
  version: { type: Number, default: 1 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  publishedAt: Date,
  publishedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  previewToken: String,
}, { timestamps: true });

// Compound indexes only (unique constraint on key field already creates single index)
SitePageSchema.index({ slug: 1 });
SitePageSchema.index({ status: 1 });
SitePageSchema.index({ key: 1, status: 1 });

export const SitePage: Model<ISitePage> = 
  mongoose.models.SitePage || mongoose.model<ISitePage>('SitePage', SitePageSchema);

// ==================== MEDIA ASSETS ====================

export interface IMediaAsset extends Document {
  url: string;
  storageKey: string;
  folder: string; // 'site' | 'home' | 'seo' | 'pages' etc
  filename: string;
  mimeType: string;
  size: number;
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
  tags: string[];
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>({
  url: { type: String, required: true },
  storageKey: { type: String, required: true },
  folder: { type: String, default: 'site' },
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
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
  tags: [String],
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

MediaAssetSchema.index({ folder: 1, createdAt: -1 });
MediaAssetSchema.index({ tags: 1 });
MediaAssetSchema.index({ mimeType: 1 });

export const MediaAsset: Model<IMediaAsset> = 
  mongoose.models.MediaAsset || mongoose.model<IMediaAsset>('MediaAsset', MediaAssetSchema);

// ==================== AUDIT LOG ====================

export interface IAuditLog extends Document {
  entityType: 'siteNavigation' | 'siteFooter' | 'sitePage' | 'mediaAsset';
  entityId: mongoose.Types.ObjectId;
  entityKey?: string; // key field for nav/footer/page
  action: 'create' | 'update' | 'delete' | 'publish' | 'rollback';
  userId: mongoose.Types.ObjectId;
  userName: string;
  userRole: string;
  before?: any;
  after?: any;
  metadata?: any;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  entityType: { 
    type: String, 
    enum: ['siteNavigation', 'siteFooter', 'sitePage', 'mediaAsset'],
    required: true 
  },
  entityId: { type: Schema.Types.ObjectId, required: true },
  entityKey: String,
  action: { 
    type: String, 
    enum: ['create', 'update', 'delete', 'publish', 'rollback'],
    required: true 
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userRole: { type: String, required: true },
  before: Schema.Types.Mixed,
  after: Schema.Types.Mixed,
  metadata: Schema.Types.Mixed,
}, { timestamps: true });

AuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLog: Model<IAuditLog> = 
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
