import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {siteConfig.name}
    </div>
  );
}
