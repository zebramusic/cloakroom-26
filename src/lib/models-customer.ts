import mongoose, { Schema, Document, Model } from 'mongoose';

// ==================== CUSTOMER (Separate from Admin Users) ====================

export interface ICustomer extends Document {
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  name: string;
  companyName?: string;
  phone?: string;
  cui?: string;
  vatNumber?: string;
  billingAddress?: {
    street: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
  };
  shippingAddresses?: Array<{
    label: string;
    street: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    _id?: mongoose.Types.ObjectId;
  }>;
  localePreference: 'ro' | 'en';
  lastLogin?: Date;
  deletionRequestedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, index: true },
  emailVerificationExpires: { type: Date },
  passwordResetToken: { type: String, index: true },
  passwordResetExpires: { type: Date },
  name: { type: String, required: true },
  companyName: { type: String },
  phone: { type: String },
  cui: { type: String },
  vatNumber: { type: String },
  billingAddress: {
    street: String,
    city: String,
    county: String,
    postalCode: String,
    country: { type: String, default: 'RO' }
  },
  shippingAddresses: [{
    label: String,
    street: String,
    city: String,
    county: String,
    postalCode: String,
    country: { type: String, default: 'RO' },
    isDefault: { type: Boolean, default: false }
  }],
  localePreference: { type: String, enum: ['ro', 'en'], default: 'ro' },
  lastLogin: { type: Date },
  deletionRequestedAt: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

// ==================== CONVERSATION THREADS ====================

export interface IConversationThread extends Document {
  type: 'order_support' | 'general_support';
  customerId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  status: 'open' | 'closed';
  subject: string;
  lastMessageAt: Date;
  unreadByCustomer: number;
  unreadByAdmin: number;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationThreadSchema = new Schema<IConversationThread>({
  type: { type: String, enum: ['order_support', 'general_support'], required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open', index: true },
  subject: { type: String, required: true },
  lastMessageAt: { type: Date, default: Date.now, index: true },
  unreadByCustomer: { type: Number, default: 0 },
  unreadByAdmin: { type: Number, default: 0 },
}, { timestamps: true });

export const ConversationThread: Model<IConversationThread> = mongoose.models.ConversationThread || mongoose.model<IConversationThread>('ConversationThread', ConversationThreadSchema);

// ==================== MESSAGES ====================

export interface IMessage extends Document {
  threadId: mongoose.Types.ObjectId;
  senderType: 'customer' | 'admin';
  senderId: mongoose.Types.ObjectId;
  body: string;
  attachments: Array<{
    filename: string;
    path: string;
    mimeType: string;
    size: number;
  }>;
  readByCustomerAt?: Date;
  readByAdminAt?: Date;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  threadId: { type: Schema.Types.ObjectId, ref: 'ConversationThread', required: true, index: true },
  senderType: { type: String, enum: ['customer', 'admin'], required: true },
  senderId: { type: Schema.Types.ObjectId, required: true },
  body: { type: String, required: true },
  attachments: [{
    filename: String,
    path: String,
    mimeType: String,
    size: Number,
  }],
  readByCustomerAt: { type: Date },
  readByAdminAt: { type: Date },
}, { timestamps: true });

export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
