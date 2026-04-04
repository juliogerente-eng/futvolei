import { createClient } from "@/lib/supabase/server";
import RankingTable from "@/components/RankingTable";
import RankingFilters from "./RankingFilters";
import React from "react";

export const metadata = {
  title: "Ranking | QuadraHub",
};

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Get all athletes with profiles
  let query = supabase
    .from("athlete_profiles")
    .select("*, user:users!inner(id, name, city, state, avatar_url)")
    .order("rating", { ascending: false });

  if (params.city) {
    query = query.eq("user.city", params.city);
  }

  const { data: athletes } = await query;

  // Get unique cities for filter
  const { data: cities } = await supabase
    .from("users")
    .select("city")
    .eq("role", "athlete")
    .not("city", "eq", "");

  const uniqueCities = Array.from(
    new Set((cities || []).map((c) => c.city).filter(Boolean))
  ).sort();

  // Format for RankingTable
  const entries = (athletes || []).map((athlete, index) => {
    const userData = athlete.user as unknown as {
      id: string;
      name: string;
      city: string;
      avatar_url: string | null;
    };
    return {
      position: index + 1,
      id: userData.id,
      name: userData.name,
      city: userData.city,
      avatar_url: userData.avatar_url,
      rating: athlete.rating,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">🏆 Ranking</h1>
          <p className="text-text-secondary text-sm mt-1">
            {params.city
              ? `Ranking de ${params.city}`
              : "Ranking geral de todos os atletas"}
          </p>
        </div>
        <React.Suspense fallback={<div className="text-sm text-text-secondary">Carregando filtros...</div>}>
          <RankingFilters cities={uniqueCities} currentCity={params.city} />
        </React.Suspense>
      </div>

      <RankingTable entries={entries} highlightUserId={user?.id} />

      {entries.length > 0 && (
        <p className="text-center text-xs text-text-secondary">
          {entries.length} atleta{entries.length !== 1 ? "s" : ""} no ranking
        </p>
      )}
    </div>
  );
}
