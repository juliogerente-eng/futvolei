import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLevelForRating, getLevelProgress } from "@/lib/elo";
import RatingBadge from "@/components/RatingBadge";
import RatingDelta from "@/components/RatingDelta";
import DashboardChart from "./DashboardChart";

export const metadata = {
  title: "Dashboard | QuadraHub",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get athlete profile
  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get user data
  const { data: userData } = await supabase
    .from("users")
    .select("name, city, role")
    .eq("id", user.id)
    .single();

  // Get ELO history (last 20)
  const { data: eloHistory } = await supabase
    .from("elo_history")
    .select("*, match:matches(*, championship:championships(name))")
    .eq("athlete_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const rating = profile?.rating ?? 1000;
  const level = getLevelForRating(rating);
  const progress = getLevelProgress(rating);

  // Next level info
  const nextLevelRating = level.maxRating === Infinity ? null : level.maxRating + 1;
  const nextLevelName = nextLevelRating ? getLevelForRating(nextLevelRating).name : null;

  // Chart data (reversed for chronological order)
  const chartData = (eloHistory || []).reverse().map((entry, i) => ({
    matchIndex: i + 1,
    rating: entry.rating_after,
  }));

  // Recent matches (last 10)
  const recentMatches = (eloHistory || []).slice(0, 10);

  const isOrganizer = userData?.role === "organizer";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Olá, {userData?.name?.split(" ")[0] || "Atleta"} 👋
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          {isOrganizer
            ? "Gerencie seus campeonatos e acompanhe os resultados."
            : "Acompanhe sua evolução no ranking."}
        </p>
      </div>

      {/* Rating Card */}
      {!isOrganizer && (
        <div
          className="rounded-xl p-6 glow-primary"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-text-secondary mb-1">Seu Rating</p>
              <div className="flex items-center gap-4">
                <span
                  className="text-5xl font-bold font-mono"
                  style={{ color: level.color }}
                >
                  {rating}
                </span>
                <RatingBadge rating={rating} size="lg" showRating={false} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--color-success)" }}>
                  {profile?.wins ?? 0}
                </p>
                <p className="text-xs text-text-secondary">Vitórias</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--color-error)" }}>
                  {profile?.losses ?? 0}
                </p>
                <p className="text-xs text-text-secondary">Derrotas</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{profile?.total_matches ?? 0}</p>
                <p className="text-xs text-text-secondary">Partidas</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {nextLevelName && (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-text-secondary mb-1.5">
                <span>{level.name}</span>
                <span>{nextLevelName}</span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--color-bg)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${level.color}, ${level.color}aa)`,
                  }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {nextLevelRating! - rating} pontos para {nextLevelName}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Chart */}
      {!isOrganizer && chartData.length > 0 && (
        <div
          className="rounded-xl p-6"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2 className="text-lg font-semibold mb-4">📈 Evolução do Rating</h2>
          <DashboardChart data={chartData} />
        </div>
      )}

      {/* Recent Matches */}
      {!isOrganizer && (
        <div
          className="rounded-xl p-6"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2 className="text-lg font-semibold mb-4">🏐 Últimas Partidas</h2>
          {recentMatches.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8">
              Nenhuma partida registrada ainda. Inscreva-se em um campeonato!
            </p>
          ) : (
            <div className="space-y-3">
              {recentMatches.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: "var(--color-bg)" }}
                >
                  <div>
                    <p className="text-sm font-medium">
                      {(entry.match as unknown as Record<string, unknown>)?.championship
                        ? ((entry.match as unknown as Record<string, Record<string, string>>).championship?.name || "Campeonato")
                        : "Campeonato"}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(entry.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-text-secondary">
                      {entry.rating_before} → {entry.rating_after}
                    </span>
                    <RatingDelta delta={entry.delta} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Organizer Quick Actions */}
      {isOrganizer && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="/organizar/novo"
            className="rounded-xl p-6 transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span className="text-3xl">🏆</span>
            <h3 className="text-lg font-semibold mt-3">Criar Campeonato</h3>
            <p className="text-sm text-text-secondary mt-1">
              Crie e gerencie um novo campeonato de futevôlei.
            </p>
          </a>
          <a
            href="/organizar"
            className="rounded-xl p-6 transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span className="text-3xl">📋</span>
            <h3 className="text-lg font-semibold mt-3">Meus Campeonatos</h3>
            <p className="text-sm text-text-secondary mt-1">
              Gerencie inscrições, resultados e tabelas.
            </p>
          </a>
        </div>
      )}
    </div>
  );
}
