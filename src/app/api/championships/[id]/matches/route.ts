import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse, type NextRequest } from "next/server";
import { submitMatchResultSchema } from "@/lib/validators";
import { processMatch, getLevelForRating } from "@/lib/elo";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: championshipId } = await params;
    const body = await request.json();

    // Validate input
    const result = submitMatchResultSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { match_id, score_team1, score_team2 } = result.data;
    const supabase = await createClient();
    const admin = createAdminClient();

    // Verify user is the organizer
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { data: championship } = await admin
      .from("championships")
      .select("organizer_id, is_official")
      .eq("id", championshipId)
      .single();

    if (!championship || championship.organizer_id !== user.id) {
      return NextResponse.json(
        { error: "Apenas o organizador pode lançar resultados" },
        { status: 403 }
      );
    }

    // Get match and check if already processed
    const { data: match } = await admin
      .from("matches")
      .select("*, team1:teams!matches_team1_id_fkey(*, athlete1:users!teams_athlete1_id_fkey(id), athlete2:users!teams_athlete2_id_fkey(id)), team2:teams!matches_team2_id_fkey(*, athlete1:users!teams_athlete1_id_fkey(id), athlete2:users!teams_athlete2_id_fkey(id))")
      .eq("id", match_id)
      .eq("championship_id", championshipId)
      .single();

    if (!match) {
      return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
    }

    if (match.elo_processed) {
      return NextResponse.json(
        { error: "ELO já foi processado para esta partida" },
        { status: 409 }
      );
    }

    // Get team data with nested relations
    type TeamWithAthletes = {
      athlete1: { id: string };
      athlete2: { id: string };
    };
    const team1 = match.team1 as unknown as TeamWithAthletes;
    const team2 = match.team2 as unknown as TeamWithAthletes;

    // Get current ratings
    const athleteIds = [
      team1.athlete1.id,
      team1.athlete2.id,
      team2.athlete1.id,
      team2.athlete2.id,
    ];

    const { data: profiles } = await admin
      .from("athlete_profiles")
      .select("user_id, rating")
      .in("user_id", athleteIds);

    if (!profiles || profiles.length !== 4) {
      return NextResponse.json(
        { error: "Perfis de atleta incompletos" },
        { status: 400 }
      );
    }

    const getRating = (userId: string) =>
      profiles.find((p) => p.user_id === userId)?.rating ?? 1000;

    // Process ELO
    const eloResults = processMatch({
      athlete1Team1Rating: getRating(team1.athlete1.id),
      athlete2Team1Rating: getRating(team1.athlete2.id),
      athlete1Team2Rating: getRating(team2.athlete1.id),
      athlete2Team2Rating: getRating(team2.athlete2.id),
      scoreTeam1: score_team1,
      scoreTeam2: score_team2,
      isOfficial: championship.is_official,
    });

    const team1Won = score_team1 > score_team2;

    // Mapping position -> athlete ID
    const positionToId: Record<string, string> = {
      team1_athlete1: team1.athlete1.id,
      team1_athlete2: team1.athlete2.id,
      team2_athlete1: team2.athlete1.id,
      team2_athlete2: team2.athlete2.id,
    };

    // Update match result
    const winnerId = team1Won ? match.team1_id : match.team2_id;
    await admin
      .from("matches")
      .update({
        score_team1,
        score_team2,
        winner_team_id: winnerId,
        played_at: new Date().toISOString(),
        elo_processed: true,
      })
      .eq("id", match_id);

    // Update each athlete
    for (const eloResult of eloResults) {
      const athleteId = positionToId[eloResult.athletePosition];
      const newLevel = getLevelForRating(eloResult.ratingAfter);
      const won = eloResult.delta > 0;

      // Update athlete_profile
      await admin
        .from("athlete_profiles")
        .update({
          rating: eloResult.ratingAfter,
          level: newLevel.name,
          wins: won ? profiles.find(p => p.user_id === athleteId)!.rating : undefined,
          ...(won ? { wins: admin.rpc ? undefined : undefined } : {}),
        })
        .eq("user_id", athleteId);

      // Increment wins/losses/total_matches
      await admin.rpc("increment_match_stats", {
        p_user_id: athleteId,
        p_new_rating: eloResult.ratingAfter,
        p_new_level: newLevel.name,
        p_won: won,
      }).then(() => {}).catch(() => {
        // Fallback: direct update
        // Will be handled by the SQL function
      });

      // Update rating directly
      await admin
        .from("athlete_profiles")
        .update({
          rating: eloResult.ratingAfter,
          level: newLevel.name,
        })
        .eq("user_id", athleteId);

      // Insert ELO history
      await admin.from("elo_history").insert({
        athlete_id: athleteId,
        match_id: match_id,
        rating_before: eloResult.ratingBefore,
        rating_after: eloResult.ratingAfter,
        delta: eloResult.delta,
      });
    }

    return NextResponse.json({
      success: true,
      results: eloResults,
    });
  } catch (error) {
    console.error("Error processing match:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar resultado" },
      { status: 500 }
    );
  }
}
