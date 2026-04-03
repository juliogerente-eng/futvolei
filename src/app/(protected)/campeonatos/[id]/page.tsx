import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function CampeonatoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: championship } = await supabase
    .from("championships")
    .select("*")
    .eq("id", id)
    .single();

  if (!championship) notFound();

  const { data: teams } = await supabase
    .from("teams")
    .select("*, athlete1:users!teams_athlete1_id_fkey(name), athlete2:users!teams_athlete2_id_fkey(name)")
    .eq("championship_id", id);

  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .eq("championship_id", id)
    .order("round", { ascending: true });

  type TeamWithNames = {
    id: string;
    athlete1: { name: string } | null;
    athlete2: { name: string } | null;
    group_name: string | null;
  };

  const typedTeams = (teams || []) as unknown as TeamWithNames[];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{championship.name}</h1>
        <p className="text-sm text-text-secondary">
          {championship.city}, {championship.state} •{" "}
          {championship.format === "grupos_mata_mata" ? "Grupos + Mata-mata" : "Eliminatória"}
          {championship.is_official && " • ⭐ Oficial"}
        </p>
      </div>

      {/* Teams */}
      <div className="rounded-xl p-5"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
        <h2 className="font-semibold mb-3">👥 Duplas Inscritas ({typedTeams.length}/{championship.max_teams})</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {typedTeams.map((team, i) => (
            <div key={team.id} className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: "var(--color-bg)" }}>
              <span className="font-bold text-text-secondary w-6">#{i + 1}</span>
              <span className="text-sm">{team.athlete1?.name} & {team.athlete2?.name}</span>
              {team.group_name && (
                <span className="text-xs ml-auto px-2 py-0.5 rounded-full"
                  style={{ background: "var(--color-primary-glow)", color: "var(--color-primary)" }}>
                  Grupo {team.group_name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Matches */}
      {(matches || []).length > 0 && (
        <div className="rounded-xl p-5"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <h2 className="font-semibold mb-3">📊 Partidas</h2>
          <div className="space-y-2">
            {(matches || []).map((match) => {
              const team1 = typedTeams.find(t => t.id === match.team1_id);
              const team2 = typedTeams.find(t => t.id === match.team2_id);
              return (
                <div key={match.id} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: "var(--color-bg)" }}>
                  <span className={`flex-1 text-sm text-right ${match.winner_team_id === match.team1_id ? "font-bold" : ""}`}>
                    {team1?.athlete1?.name} & {team1?.athlete2?.name}
                  </span>
                  <span className="px-3 font-mono font-bold text-sm"
                    style={{ color: "var(--color-primary)" }}>
                    {match.score_team1 !== null ? `${match.score_team1} × ${match.score_team2}` : "vs"}
                  </span>
                  <span className={`flex-1 text-sm ${match.winner_team_id === match.team2_id ? "font-bold" : ""}`}>
                    {team2?.athlete1?.name} & {team2?.athlete2?.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
