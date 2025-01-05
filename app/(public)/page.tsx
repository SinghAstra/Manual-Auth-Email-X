"use client";

import Features from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { features } from "@/config/features";

export default function Home() {
  return (
    <main className="flex flex-col pt-16">
      <Hero />
      <Features features={features} />
    </main>
  );
}
