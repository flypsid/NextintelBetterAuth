import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatedGroup } from "@/components/ui/AnimatedGroup";
import { Variants } from "framer-motion";
import { TextEffect } from "@/components/ui/TextEffect";
import { useTranslations } from "next-intl";
import MagicButton from "@/components/ui/MagicButton";

const transitionVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 12,
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

export function HeroSection() {
  const t = useTranslations("HeroSection");
  return (
    <>
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  },
                },
              }}
              className="absolute inset-0 -z-20"
            >
              <Image
                src="/images/hero-bg.webp"
                alt="background"
                className="w-full h-full opacity-35"
                width={1920}
                height={1080}
              />
            </AnimatedGroup>
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
            />
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={{ item: transitionVariants }}>
                  <Link
                    href="#link"
                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-lg border p-1 px-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                  >
                    <span className="bg-slate-900 text-white rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">
                      {t("announcement.badge")}
                    </span>
                    <span className="text-foreground text-sm">
                      {t("announcement.text")}
                    </span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>

                  <h1 className="mt-8 mx-auto text-balance text-4xl md:text-5xl lg:mt-16 xl:text-[4.5rem] whitespace-pre-line ">
                    <TextEffect per="word" preset="slide">
                      {t("title")}
                    </TextEffect>
                  </h1>
                  <TextEffect
                    per="word"
                    preset="slide"
                    className="mx-auto mt-8 max-w-2xl text-balance text-lg"
                  >
                    {t("subtitle")}
                  </TextEffect>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    item: transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div key={1}>
                    <Link href="/register">
                      <MagicButton
                        title={t("getStarted")}
                        icon={<Sparkles className="size-4" />}
                        position="right"
                      />
                    </Link>
                  </div>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                item: {
                  hidden: { opacity: 0, filter: "blur(4px)", y: 20 },
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
                },
              }}
            >
              <div className="relative mx-auto mt-8 sm:mt-12 md:mt-16 lg:mt-20 overflow-hidden px-2">
                <div
                  aria-hidden
                  className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-2xl sm:max-w-4xl lg:max-w-6xl overflow-hidden rounded-xl sm:rounded-2xl border p-2 sm:p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Image
                    className="bg-background aspect-video sm:aspect-15/8 relative rounded-lg sm:rounded-2xl w-full border border-border/25 dark:border-transparent"
                    src="/images/heroimg.webp"
                    alt="app screen"
                    width={2700}
                    height={1440}
                    priority
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
    </>
  );
}
