import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Campeonatos | QuadraHub" };

export default async function CampeonatosPage() {
  const supabase = await createClient();

  const { data: championships } = await supabase
    .from("championships")
    .select("*, teams(count)")
    .in("status", ["open", "in_progress"])
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">🏐 Campeonatos</h1>
        <p className="text-sm text-text-secondary mt-1">
          Campeonatos disponíveis para inscrição
        </p>
      </div>

      {(!championships || championships.length === 0) ? (
        <div className="text-center py-16 rounded-xl"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <p className="text-4xl mb-3">🏆</p>
          <p className="font-semibold">Nenhum campeonato disponível</p>
          <p className="text-sm text-text-secondary mt-1">Volte em breve!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {championships.map((champ) => {
            const teamCount = Array.isArray(champ.teams)
              ? champ.teams.length
              : (champ.teams as unknown as { count: number })?.count ?? 0;
            const isOpen = champ.status === "open";

            return (
              <Link key={champ.id} href={`/campeonatos/${champ.id}`}
                className="rounded-xl p-5 transition-all duration-200 hover:scale-[1.01]"
                style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{champ.name}</h3>
                  {champ.is_official && (
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--color-primary-glow)", color: "var(--color-primary)" }}>
                      ⭐ Oficial
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary">
                  {champ.city}, {champ.state}
                </p>
                <div className="flex gap-4 mt-3 text-xs text-text-secondary">
                  <span>👥 {teamCount}/{champ.max_teams}</span>
                  <span>{champ.category}</span>
                  <span className="font-semibold" style={{ color: isOpen ? "var(--color-success)" : "var(--color-warning)" }}>
                    {isOpen ? "Inscrições abertas" : "Em andamento"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
