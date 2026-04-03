import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import ChampionshipManager from "./ChampionshipManager";

export const metadata = { title: "Gerenciar Campeonato | QuadraHub" };

export default async function GerenciarCampeonatoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: championship } = await supabase
    .from("championships")
    .select("*")
    .eq("id", id)
    .eq("organizer_id", user.id)
    .single();

  if (!championship) notFound();

  const { data: teams } = await supabase
    .from("teams")
    .select("*, athlete1:users!teams_athlete1_id_fkey(id, name, email), athlete2:users!teams_athlete2_id_fkey(id, name, email)")
    .eq("championship_id", id);

  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .eq("championship_id", id)
    .order("round", { ascending: true });

  return (
    <ChampionshipManager
      championship={championship}
      teams={teams || []}
      matches={matches || []}
    />
  );
}
