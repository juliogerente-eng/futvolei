"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  userName: string;
  userRole: string;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "📊", roles: ["athlete", "organizer", "admin"] },
  { href: "/ranking", label: "Ranking", icon: "🏆", roles: ["athlete", "organizer", "admin"] },
  { href: "/campeonatos", label: "Campeonatos", icon: "🏐", roles: ["athlete", "organizer", "admin"] },
  { href: "/organizar", label: "Organizar", icon: "📋", roles: ["organizer", "admin"] },
  { href: "/admin", label: "Admin", icon: "⚙️", roles: ["admin"] },
];

export default function Navbar({ userName, userRole }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(userRole)
  );

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav
      className="sticky top-0 z-50 glass"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="gradient-text">Quadra</span>
              <span>Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {filteredItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: isActive ? "var(--color-primary-glow)" : "transparent",
                    color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/perfil"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: "var(--color-primary-glow)",
                  color: "var(--color-primary)",
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{userName.split(" ")[0]}</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm px-3 py-1.5 rounded-lg transition-colors"
              style={{
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border)",
              }}
            >
              Sair
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: "var(--color-text)" }}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden animate-fade-in"
          style={{
            background: "var(--color-card)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <div className="px-4 py-3 space-y-1">
            {filteredItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium"
                  style={{
                    background: isActive ? "var(--color-primary-glow)" : "transparent",
                    color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <hr style={{ borderColor: "var(--color-border)" }} />
            <Link
              href="/perfil"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              👤 Perfil
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm w-full"
              style={{ color: "var(--color-error)" }}
            >
              🚪 Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
