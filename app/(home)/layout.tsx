import { Navbar } from "@/components/home/navbar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <div className="flex flex-col ">
        <Navbar />
        {children}
      </div>
    </>
  );
}
