import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LockIcon, MailIcon, ShieldCheckIcon } from "lucide-react";

function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <Card className="w-full max-w-md bg-gray-900/60 border border-gray-800 backdrop-blur-xl">
        <div className="p-6 space-y-6">
          <div className="space-y-2 text-center">
            <ShieldCheckIcon className="w-10 h-10 mx-auto text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <MailIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  className="pl-10 bg-gray-800/50 border-gray-700 focus:border-primary"
                  placeholder="name@example.com"
                  type="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  className="pl-10 bg-gray-800/50 border-gray-700 focus:border-primary"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign in
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AdminLoginPage;
