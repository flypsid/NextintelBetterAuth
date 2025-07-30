"use client";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function FooterSection() {
  const t = useTranslations("Navbar");
  const links = [
    { name: t("about"), href: "#link" },
    { name: t("features"), href: "#link" },
    { name: t("pricing"), href: "#link" },
    { name: t("contact"), href: "/contact" },
  ];

  return (
    <footer className="border-b bg-white py-12 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-6">
          <div className="flex items-center gap-2 order-last md:order-first w-full md:w-auto justify-center md:justify-start">
            <Image
              src="/images/logo.png"
              alt="NextintelBetterAuth Logo"
              width={20}
              height={20}
              className=""
              priority
            />
            <span className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} NextintelBetterAuth, All rights
              reserved
            </span>
          </div>
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last w-full md:w-auto">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-primary block duration-150"
              >
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
