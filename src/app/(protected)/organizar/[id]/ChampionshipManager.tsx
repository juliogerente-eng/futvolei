"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Championship, Match } from "@/types/database";

interface TeamData {
  id: string;
  championship_id: string;
  athlete1_id: string;
  athlete2_id: string;
  group_name: string | null;
  seed: number | null;
  athlete1: { id: string; name: string; email: string } | null;
  athlete2: { id: string; name: string; email: string } | null;
}

type Tab = "teams" | "bracket" | "results";

export default function ChampionshipManager({
  championship,
  teams: initialTeams,
  matches: initialMatches,
}: {
  championship: Championship;
  teams: TeamData[];
  matches: Match[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("teams");
  const [teams] = useState(initialTeams);
  const [matches] = useState(initialMatches);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; email: string }[]>([]);
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  // Search athletes
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) { setSearchResults([]); return; }

    const { data } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("role", "athlete")
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);

    setSearchResults(data || []);
  };

  // Register team
  const handleRegisterTeam = async () => {
    if (selectedAthletes.length !== 2) {
      setMessage({ type: "error", text: "Selecione 2 atletas para formar a dupla." });
      return;
    }
    setLoading(true);

    const { error } = await supabase.from("teams").insert({
      championship_id: championship.id,
      athlete1_id: selectedAthletes[0],
      athlete2_id: selectedAthletes[1],
    });

    if (error) {
      setMessage({ type: "error", text: error.message.includes("unique") ? "Atleta já inscrito neste campeonato." : "Erro ao inscrever dupla." });
    } else {
      setMessage({ type: "success", text: "Dupla inscrita com sucesso!" });
      setSelectedAthletes([]);
      setSearchQuery("");
      setSearchResults([]);
      router.refresh();
    }
    setLoading(false);
  };

  // Update championship status
  const handleStatusChange = async (status: string) => {
    await supabase.from("championships").update({ status }).eq("id", championship.id);
    router.refresh();
  };

  // Submit match result
  const handleSubmitResult = async (matchId: string, score1: number, score2: number) => {
    setLoading(true);
    const winnerId = score1 > score2
      ? matches.find(m => m.id === matchId)?.team1_id
      : matches.find(m => m.id === matchId)?.team2_id;

    const { error } = await supabase
      .from("matches")
      .update({
        score_team1: score1,
        score_team2: score2,
        winner_team_id: winnerId,
        played_at: new Date().toISOString(),
      })
      .eq("id", matchId);

    if (error) {
      setMessage({ type: "error", text: "Erro ao salvar resultado." });
    } else {
      // Process ELO via API
      await fetch(`/api/championships/${championship.id}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ match_id: matchId, score_team1: score1, score_team2: score2 }),
      });
      setMessage({ type: "success", text: "Resultado salvo e ELO processado!" });
      router.refresh();
    }
    setLoading(false);
  };

  const tabs = [
    { id: "teams" as Tab, label: "👥 Duplas", count: teams.length },
    { id: "bracket" as Tab, label: "📊 Tabela", count: matches.length },
    { id: "results" as Tab, label: "🏐 Resultados", count: matches.filter(m => m.score_team1 !== null).length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{championship.name}</h1>
          <p className="text-sm text-text-secondary">
            {championship.city}, {championship.state} •{" "}
            {championship.format === "grupos_mata_mata" ? "Grupos + Mata-mata" : "Eliminatória"}
          </p>
        </div>
        <div className="flex gap-2">
          {championship.status === "draft" && (
            <button onClick={() => handleStatusChange("open")}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--color-success)", color: "var(--color-bg)" }}>
              Abrir Inscrições
            </button>
          )}
          {championship.status === "open" && (
            <button onClick={() => handleStatusChange("in_progress")}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--color-warning)", color: "var(--color-bg)" }}>
              Iniciar Campeonato
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-lg text-sm"
          style={{
            background: message.type === "success" ? "var(--color-success-bg)" : "var(--color-error-bg)",
            color: message.type === "success" ? "var(--color-success)" : "var(--color-error)",
          }}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--color-bg)" }}>
        {tabs.map((t) => (
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

      {/* Teams Tab */}
      {tab === "teams" && (
        <div className="space-y-4">
          {/* Add team form */}
          <div className="rounded-xl p-5" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            <h3 className="font-semibold mb-3">Inscrever Dupla</h3>
            <input value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar atleta por nome ou e-mail..."
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none mb-2"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />

            {searchResults.length > 0 && (
              <div className="rounded-lg overflow-hidden mb-3" style={{ border: "1px solid var(--color-border)" }}>
                {searchResults.map((a) => {
                  const isSelected = selectedAthletes.includes(a.id);
                  return (
                    <button key={a.id} onClick={() => {
                      if (isSelected) setSelectedAthletes(selectedAthletes.filter(id => id !== a.id));
                      else if (selectedAthletes.length < 2) setSelectedAthletes([...selectedAthletes, a.id]);
                    }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors"
                      style={{
                        background: isSelected ? "var(--color-primary-glow)" : "var(--color-bg)",
                        borderBottom: "1px solid var(--color-border)",
                      }}>
                      <span>{a.name} ({a.email})</span>
                      {isSelected && <span style={{ color: "var(--color-primary)" }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {selectedAthletes.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-text-secondary">Selecionados: {selectedAthletes.length}/2</span>
              </div>
            )}

            <button onClick={handleRegisterTeam} disabled={loading || selectedAthletes.length !== 2}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}>
              {loading ? "Inscrevendo..." : "Inscrever Dupla"}
            </button>
          </div>

          {/* Teams list */}
          <div className="grid gap-3">
            {teams.map((team, i) => (
              <div key={team.id} className="flex items-center gap-4 p-4 rounded-lg"
                style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                <span className="font-bold text-lg text-text-secondary w-8">#{i + 1}</span>
                <div>
                  <p className="font-medium text-sm">
                    {team.athlete1?.name || "?"} & {team.athlete2?.name || "?"}
                  </p>
                  {team.group_name && (
                    <p className="text-xs text-text-secondary">Grupo {team.group_name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bracket Tab */}
      {tab === "bracket" && (
        <div className="rounded-xl p-5" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          {matches.length === 0 ? (
            <p className="text-center py-8 text-text-secondary text-sm">
              A tabela será gerada quando o campeonato iniciar.
            </p>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => {
                const team1 = teams.find(t => t.id === match.team1_id);
                const team2 = teams.find(t => t.id === match.team2_id);
                return (
                  <div key={match.id} className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: "var(--color-bg)" }}>
                    <div className="flex-1 text-sm">
                      <span className={match.winner_team_id === match.team1_id ? "font-bold" : ""}>
                        {team1?.athlete1?.name} & {team1?.athlete2?.name}
                      </span>
                    </div>
                    <div className="px-3 font-mono font-bold text-sm">
                      {match.score_team1 !== null ? `${match.score_team1} × ${match.score_team2}` : "vs"}
                    </div>
                    <div className="flex-1 text-sm text-right">
                      <span className={match.winner_team_id === match.team2_id ? "font-bold" : ""}>
                        {team2?.athlete1?.name} & {team2?.athlete2?.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Results Tab */}
      {tab === "results" && (
        <div className="space-y-3">
          {matches.filter(m => !m.elo_processed).map((match) => {
            const team1 = teams.find(t => t.id === match.team1_id);
            const team2 = teams.find(t => t.id === match.team2_id);

            return (
              <MatchResultForm
                key={match.id}
                matchId={match.id}
                team1Name={`${team1?.athlete1?.name || "?"} & ${team1?.athlete2?.name || "?"}`}
                team2Name={`${team2?.athlete1?.name || "?"} & ${team2?.athlete2?.name || "?"}`}
                stage={match.stage}
                onSubmit={handleSubmitResult}
                loading={loading}
              />
            );
          })}
          {matches.filter(m => !m.elo_processed).length === 0 && (
            <p className="text-center py-8 text-text-secondary text-sm">
              Todos os resultados foram processados! 🎉
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function MatchResultForm({
  matchId,
  team1Name,
  team2Name,
  stage,
  onSubmit,
  loading,
}: {
  matchId: string;
  team1Name: string;
  team2Name: string;
  stage: string;
  onSubmit: (matchId: string, score1: number, score2: number) => void;
  loading: boolean;
}) {
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");

  return (
    <div className="rounded-xl p-4" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
      <div className="text-xs font-medium uppercase tracking-wider mb-3 text-text-secondary">{stage}</div>
      <div className="flex items-center gap-3">
        <div className="flex-1 text-sm font-medium text-right">{team1Name}</div>
        <input type="number" min="0" max="50" value={score1}
          onChange={(e) => setScore1(e.target.value)}
          className="w-14 text-center py-2 rounded-lg font-mono font-bold outline-none"
          style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
        <span className="text-text-secondary font-bold">×</span>
        <input type="number" min="0" max="50" value={score2}
          onChange={(e) => setScore2(e.target.value)}
          className="w-14 text-center py-2 rounded-lg font-mono font-bold outline-none"
          style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
        <div className="flex-1 text-sm font-medium">{team2Name}</div>
      </div>
      <button disabled={loading || !score1 || !score2 || score1 === score2}
        onClick={() => onSubmit(matchId, parseInt(score1), parseInt(score2))}
        className="w-full mt-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
        style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}>
        Salvar Resultado
      </button>
    </div>
  );
}
