"use client";

import type React from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { MainNavLayout } from "@/components/navigation/mainNavLayout";
import { canAccessRoute } from "@/lib/permissions";
import { Toaster } from "@/components/ui/toaster";

interface MainNavLayoutProps {
  children: React.ReactNode;
}

export function ContentProvider({ children }: MainNavLayoutProps) {
   
  return <MainNavLayout>{children}</MainNavLayout>;
}
