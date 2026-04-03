"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User, Championship } from "@/types/database";

export default function AdminPanel({
  users,
  championships,
}: {
  users: User[];
  championships: Championship[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"users" | "championships">("users");
  const supabase = createClient();

  const toggleUserActive = async (userId: string, isActive: boolean) => {
    await supabase.from("users").update({ is_active: !isActive }).eq("id", userId);
    router.refresh();
  };

  const toggleOfficial = async (champId: string, isOfficial: boolean) => {
    await supabase.from("championships").update({ is_official: !isOfficial }).eq("id", champId);
    router.refresh();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">⚙️ Painel Admin</h1>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--color-bg)" }}>
        {[
          { id: "users" as const, label: "👥 Usuários", count: users.length },
          { id: "championships" as const, label: "🏆 Campeonatos", count: championships.length },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 py-2 rounded-md text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? "var(--color-card)" : "transparent",
              color: tab === t.id ? "var(--color-text)" : "var(--color-text-secondary)",
            }}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Users */}
      {tab === "users" && (
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 text-text-secondary">Nome</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 text-text-secondary hidden sm:table-cell">Email</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 text-text-secondary">Tipo</th>
                <th className="text-center text-xs font-semibold uppercase tracking-wider px-4 py-3 text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td className="px-4 py-3 text-sm font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: u.role === "admin" ? "var(--color-error-bg)" : u.role === "organizer" ? "var(--color-primary-glow)" : "var(--color-success-bg)",
                        color: u.role === "admin" ? "var(--color-error)" : u.role === "organizer" ? "var(--color-primary)" : "var(--color-success)",
                      }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleUserActive(u.id, (u as unknown as { is_active: boolean }).is_active !== false)}
                      className="text-xs px-3 py-1 rounded-full font-medium transition-all"
                      style={{
                        background: (u as unknown as { is_active: boolean }).is_active !== false ? "var(--color-success-bg)" : "var(--color-error-bg)",
                        color: (u as unknown as { is_active: boolean }).is_active !== false ? "var(--color-success)" : "var(--color-error)",
                      }}>
                      {(u as unknown as { is_active: boolean }).is_active !== false ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Championships */}
      {tab === "championships" && (
        <div className="space-y-3">
          {championships.map((champ) => (
            <div key={champ.id} className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
              <div>
                <h3 className="font-semibold">{champ.name}</h3>
                <p className="text-xs text-text-secondary">{champ.city}, {champ.state} • {champ.status}</p>
              </div>
              <button onClick={() => toggleOfficial(champ.id, champ.is_official)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: champ.is_official ? "var(--color-primary)" : "var(--color-bg)",
                  color: champ.is_official ? "var(--color-bg)" : "var(--color-text-secondary)",
                  border: champ.is_official ? "none" : "1px solid var(--color-border)",
                }}>
                {champ.is_official ? "⭐ Oficial" : "Marcar Oficial"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
