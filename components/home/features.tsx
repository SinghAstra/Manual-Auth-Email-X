import { Card } from "@/components/ui/card";
import { ColorVariant, Feature } from "@/interfaces/feature";
import React from "react";
import { FadeInUp } from "../animation/fade-in-up";
import { siteConfig } from "@/config/site";

const colorMap: Record<ColorVariant, string> = {
  "stats-blue":
    "bg-primary/20 text-primary from-primary/0 to-primary/5 hover:shadow-primary/10",
  "stats-purple":
    "bg-stats-purple/20 text-stats-purple from-stats-purple/0 to-stats-purple/5 hover:shadow-stats-purple/10",
  "stats-pink":
    "bg-stats-pink/20 text-stats-pink from-stats-pink/0 to-stats-pink/5 hover:shadow-stats-pink/10",
  "stats-orange":
    "bg-stats-orange/20 text-stats-orange from-stats-orange/0 to-stats-orange/5 hover:shadow-stats-orange/10",
};

interface FeaturesProps {
  features: Feature[];
}

interface FeatureCardProps {
  feature: Feature;
}

function FeatureCard({ feature }: FeatureCardProps) {
  const colorClasses = colorMap[feature.colorClass] || colorMap["stats-blue"];
  const [bgClass, textClass, fromClass, toClass, shadowClass] =
    colorClasses.split(" ");

  return (
    <Card
      className={`group relative h-full p-6 bg-card/50 backdrop-blur-sm border-gray-800 transition-all duration-300 ease-in-out hover:shadow-lg ${shadowClass} hover:-translate-y-1`}
    >
      <div className="relative z-10">
        <div
          className={`mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg ${bgClass} transition-colors duration-300`}
        >
          <feature.icon
            className={`h-6 w-6 ${textClass} group-hover:scale-110 transition-transform duration-300`}
          />
        </div>
        <h3
          className={`text-xl font-semibold mb-3 ${textClass} transition-colors duration-300`}
        >
          {feature.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
      <div
        className={`absolute inset-0 bg-gradient-to-br ${fromClass} ${toClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`}
      />
    </Card>
  );
}

export function Features({ features }: FeaturesProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 leading-tight tracking-tighter">
            Powerful Features
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {siteConfig.headline}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            return (
              <FadeInUp delay={index * 0.2} key={index}>
                <FeatureCard feature={feature} />
              </FadeInUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
