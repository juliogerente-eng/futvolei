// ============================================
// QuadraHub — Database Types
// ============================================

export type UserRole = "athlete" | "organizer" | "admin";

export type ChampionshipCategory = "amador" | "profissional" | "misto";
export type ChampionshipFormat = "grupos_mata_mata" | "eliminatoria_direta";
export type ChampionshipStatus = "draft" | "open" | "in_progress" | "finished";

export type MatchStage = "group" | "quarterfinal" | "semifinal" | "final";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  city: string;
  state: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface AthleteProfile {
  id: string;
  user_id: string;
  rating: number;
  level: string;
  wins: number;
  losses: number;
  total_matches: number;
}

export interface Championship {
  id: string;
  organizer_id: string;
  name: string;
  city: string;
  state: string;
  category: ChampionshipCategory;
  format: ChampionshipFormat;
  max_teams: number;
  status: ChampionshipStatus;
  is_official: boolean;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Team {
  id: string;
  championship_id: string;
  athlete1_id: string;
  athlete2_id: string;
  group_name: string | null;
  seed: number | null;
}

export interface Match {
  id: string;
  championship_id: string;
  team1_id: string;
  team2_id: string;
  score_team1: number | null;
  score_team2: number | null;
  winner_team_id: string | null;
  stage: MatchStage;
  round: number;
  played_at: string | null;
  elo_processed: boolean;
}

export interface EloHistory {
  id: string;
  athlete_id: string;
  match_id: string;
  rating_before: number;
  rating_after: number;
  delta: number;
  created_at: string;
}

// ============================================
// Extended types with joins
// ============================================

export interface AthleteWithProfile extends User {
  athlete_profiles: AthleteProfile;
}

export interface TeamWithAthletes extends Team {
  athlete1: User;
  athlete2: User;
}

export interface MatchWithTeams extends Match {
  team1: TeamWithAthletes;
  team2: TeamWithAthletes;
  championship: Championship;
}

export interface EloHistoryWithMatch extends EloHistory {
  match: MatchWithTeams;
}

// ============================================
// Input types for API
// ============================================

export interface MatchInput {
  athlete1Team1Rating: number;
  athlete2Team1Rating: number;
  athlete1Team2Rating: number;
  athlete2Team2Rating: number;
  scoreTeam1: number;
  scoreTeam2: number;
  isOfficial: boolean;
}

export interface EloResult {
  athletePosition: "team1_athlete1" | "team1_athlete2" | "team2_athlete1" | "team2_athlete2";
  ratingBefore: number;
  ratingAfter: number;
  delta: number;
}
