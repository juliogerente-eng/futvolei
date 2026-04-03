import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Meus Campeonatos | QuadraHub" };

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "Rascunho", color: "var(--color-text-secondary)" },
  open: { label: "Aberto", color: "var(--color-success)" },
  in_progress: { label: "Em andamento", color: "var(--color-warning)" },
  finished: { label: "Finalizado", color: "var(--color-info)" },
};

export default async function OrganizarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: championships } = await supabase
    .from("championships")
    .select("*, teams(count)")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">📋 Meus Campeonatos</h1>
          <p className="text-sm text-text-secondary mt-1">Gerencie seus campeonatos</p>
        </div>
        <Link
          href="/organizar/novo"
          className="px-4 py-2.5 rounded-lg font-semibold text-sm transition-all"
          style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}
        >
          + Novo Campeonato
        </Link>
      </div>

      {(!championships || championships.length === 0) ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
        >
          <p className="text-4xl mb-3">🏆</p>
          <p className="font-semibold">Nenhum campeonato ainda</p>
          <p className="text-sm text-text-secondary mt-1">Crie seu primeiro campeonato!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {championships.map((champ) => {
            const status = STATUS_LABELS[champ.status] || STATUS_LABELS.draft;
            const teamCount = Array.isArray(champ.teams)
              ? champ.teams.length
              : (champ.teams as unknown as { count: number })?.count ?? 0;

            return (
              <Link
                key={champ.id}
                href={`/organizar/${champ.id}`}
                className="rounded-xl p-5 transition-all duration-200 hover:scale-[1.01]"
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{champ.name}</h3>
                      {champ.is_official && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: "var(--color-primary-glow)", color: "var(--color-primary)" }}>
                          ⭐ Oficial
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                      {champ.city}, {champ.state} • {champ.category} • {champ.format === "grupos_mata_mata" ? "Grupos + Mata-mata" : "Eliminatória"}
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ color: status.color, background: `${status.color}15` }}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="flex gap-6 mt-3 text-sm text-text-secondary">
                  <span>👥 {teamCount}/{champ.max_teams} duplas</span>
                  {champ.start_date && (
                    <span>📅 {new Date(champ.start_date).toLocaleDateString("pt-BR")}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
