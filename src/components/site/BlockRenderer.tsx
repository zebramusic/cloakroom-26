import { HeroBlock } from "./blocks/HeroBlock";
import { FeatureGridBlock } from "./blocks/FeatureGridBlock";
import { CTABlock } from "./blocks/CTABlock";

interface BlockRendererProps {
  blocks: any[];
  locale: string;
}

// Transform migration format to block component format
function transformBlockData(block: any, locale: string) {
  // If block has data property, use it directly (new format)
  if (block.data) {
    return block.data;
  }

  // Otherwise, transform from migration format (content[locale])
  if (!block.content || !block.content[locale]) {
    return null;
  }

  const content = block.content[locale];

  switch (block.type) {
    case "hero":
      return {
        headline: content.title,
        subheadline: content.subtitle,
        primaryCta: content.ctaText
          ? {
              text: content.ctaText,
              href: content.ctaLink || "#",
            }
          : undefined,
        secondaryCta: content.secondaryText
          ? {
              text: content.secondaryText,
              href: content.secondaryLink || "#",
            }
          : undefined,
        backgroundImage: content.backgroundImage,
        alignment: content.alignment || "center",
      };

    case "cta":
      return {
        headline: content.title,
        description: content.subtitle,
        primaryCta: content.primaryText
          ? {
              text: content.primaryText,
              href: content.primaryLink || "#",
            }
          : undefined,
        secondaryCta: content.secondaryText
          ? {
              text: content.secondaryText,
              href: content.secondaryLink || "#",
            }
          : undefined,
        backgroundColor: content.backgroundColor,
      };

    case "featureGrid":
      return {
        headline: content.title,
        subheadline: content.subtitle,
        features: content.features,
        columns: content.columns || 3,
      };

    default:
      return content;
  }
}

export function BlockRenderer({ blocks, locale }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-16">
      {blocks.map((block, index) => {
        // Filter by visibility
        if (block.visibility === "hidden") {
          return null;
        }

        const transformedData = transformBlockData(block, locale);

        if (!transformedData) {
          return null;
        }

        switch (block.type) {
          case "hero":
            return (
              <HeroBlock
                key={block.id || index}
                data={transformedData}
                locale={locale}
              />
            );
          case "featureGrid":
            return (
              <FeatureGridBlock
                key={block.id || index}
                data={transformedData}
                locale={locale}
              />
            );
          case "cta":
            return (
              <CTABlock
                key={block.id || index}
                data={transformedData}
                locale={locale}
              />
            );
          default:
            console.warn(`Unknown block type: ${block.type}`);
            return null;
        }
      })}
    </div>
  );
}
