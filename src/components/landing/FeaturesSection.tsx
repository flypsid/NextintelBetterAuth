import React from "react";
import { useTranslations } from "next-intl";
import { AnimatedGroup } from "@/components/ui/AnimatedGroup";
import { TextEffect } from "@/components/ui/TextEffect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconPhoto,
  IconSearch,
  IconTrendingUp,
  IconBulb,
  IconBell,
  IconTarget,
} from "@tabler/icons-react";
import { Variants } from "framer-motion";

const transitionVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 20,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const features = [
  {
    icon: IconPhoto,
    key: "aiThumbnails",
    gradient: "from-blue-500 to-purple-600",
  },
  {
    icon: IconSearch,
    key: "thumbnailExplorer",
    gradient: "from-green-500 to-teal-600",
  },
  {
    icon: IconTrendingUp,
    key: "outlierDetection",
    gradient: "from-orange-500 to-red-600",
  },
  {
    icon: IconBulb,
    key: "aiScriptGenerator",
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    icon: IconBell,
    key: "trendAlerts",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: IconTarget,
    key: "performanceOptimizer",
    gradient: "from-indigo-500 to-blue-600",
  },
];

export function FeaturesSection() {
  const t = useTranslations("NextintelBetterAuth.features");

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            },
            item: transitionVariants,
          }}
          className="text-center mb-16"
        >
          <TextEffect
            per="word"
            preset="slide"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Powerful AI Features for Content Creators
          </TextEffect>
          <TextEffect
            per="word"
            preset="slide"
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to create viral content and grow your audience
            across all platforms
          </TextEffect>
        </AnimatedGroup>

        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3,
                },
              },
            },
            item: transitionVariants,
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.key}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 relative">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-foreground" />
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {t(`${feature.key}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground leading-relaxed">
                    {t(`${feature.key}.description`)}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </AnimatedGroup>
      </div>
    </section>
  );
}
