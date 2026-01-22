import { Check, Star, Zap, Shield, Clock, Users } from "lucide-react";

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FeatureGridBlockProps {
  data: {
    title?: string;
    subtitle?: string;
    features: Feature[];
    columns?: 2 | 3 | 4;
  };
  locale: string;
}

const iconMap: Record<string, any> = {
  check: Check,
  star: Star,
  zap: Zap,
  shield: Shield,
  clock: Clock,
  users: Users,
};

export function FeatureGridBlock({ data, locale }: FeatureGridBlockProps) {
  const columns = data.columns || 3;
  const gridClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {(data.title || data.subtitle) && (
          <div className="text-center mb-12">
            {data.title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${gridClass} gap-8`}>
          {data.features.map((feature) => {
            const Icon = iconMap[feature.icon] || Check;

            return (
              <div
                key={feature.id}
                className="flex flex-col items-start gap-4 p-6 border rounded-lg hover:border-primary transition-colors"
              >
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
