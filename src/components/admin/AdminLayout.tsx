import type { ReactNode } from "react";
import { AdminNavbar } from "./AdminNavbar";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory text-charcoal flex flex-col font-sans">
      <AdminNavbar />
      <main className="flex-1 container-px py-8 sm:py-10 mx-auto max-w-7xl w-full">
        {children}
      </main>
      <footer className="border-t border-border bg-linen/30 py-4 text-center text-xs text-muted">
        Fragrances by D'Ruaa • Administration & Product Management Portal
      </footer>
    </div>
  );
}
