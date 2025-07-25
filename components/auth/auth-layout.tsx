import type React from "react";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
