import { z } from 'zod';

// Base block schema
const baseBlockSchema = z.object({
  id: z.string().min(1),
  visibility: z.enum(['public', 'hidden']).default('public'),
  orderIndex: z.number().int().min(0),
});

// Hero Block
export const heroBlockSchema = baseBlockSchema.extend({
  type: z.literal('hero'),
  data: z.object({
    headline: z.string().min(1).max(200),
    subheadline: z.string().max(500).optional(),
    primaryCta: z.object({
      text: z.string().min(1),
      href: z.string().min(1),
      variant: z.enum(['default', 'secondary', 'outline']).default('default'),
    }).optional(),
    secondaryCta: z.object({
      text: z.string().min(1),
      href: z.string().min(1),
      variant: z.enum(['default', 'secondary', 'outline']).default('outline'),
    }).optional(),
    backgroundImage: z.string().optional(),
    alignment: z.enum(['left', 'center', 'right']).default('center'),
  }),
});

// Feature Grid Block
export const featureGridBlockSchema = baseBlockSchema.extend({
  type: z.literal('featureGrid'),
  data: z.object({
    title: z.string().max(200).optional(),
    subtitle: z.string().max(500).optional(),
    features: z.array(z.object({
      id: z.string().min(1),
      icon: z.string().optional(),
      title: z.string().min(1).max(100),
      description: z.string().max(500),
    })).min(1).max(12),
    columns: z.enum(['2', '3', '4']).default('3'),
  }),
});

// CTA Block
export const ctaBlockSchema = baseBlockSchema.extend({
  type: z.literal('cta'),
  data: z.object({
    headline: z.string().min(1).max(200),
    description: z.string().max(500).optional(),
    primaryCta: z.object({
      text: z.string().min(1),
      href: z.string().min(1),
      variant: z.enum(['default', 'secondary', 'outline']).default('default'),
    }),
    secondaryCta: z.object({
      text: z.string().min(1),
      href: z.string().min(1),
      variant: z.enum(['default', 'secondary', 'outline']).default('outline'),
    }).optional(),
    backgroundColor: z.string().optional(),
  }),
});

// Union of MVP block types
export const contentBlockSchema = z.discriminatedUnion('type', [
  heroBlockSchema,
  featureGridBlockSchema,
  ctaBlockSchema,
]);

export type HeroBlockData = z.infer<typeof heroBlockSchema>;
export type FeatureGridBlockData = z.infer<typeof featureGridBlockSchema>;
export type CTABlockData = z.infer<typeof ctaBlockSchema>;
export type ContentBlock = z.infer<typeof contentBlockSchema>;

// Validation helper
export function validateBlock(block: any): { valid: boolean; errors?: any } {
  const result = contentBlockSchema.safeParse(block);
  if (result.success) {
    return { valid: true };
  }
  return { valid: false, errors: result.error.format() };
}
