import "./admin.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "hifi — Admin CMS" };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
