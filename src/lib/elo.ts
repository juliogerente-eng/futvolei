// ============================================
// QuadraHub — Sistema ELO
// Cálculos puros, sem efeitos colaterais
// ============================================

import {
  ELO_CONFIG,
  SCORE_MULTIPLIERS,
  LEVELS,
  type LevelConfig,
} from "./constants";
import type { MatchInput, EloResult } from "@/types/database";

/**
 * Calcula a probabilidade esperada de vitória do jogador/dupla A
 * contra o jogador/dupla B usando a fórmula ELO.
 *
 * P_A = 1 / (1 + 10^((Rating_B - Rating_A) / 400))
 */
export function calculateExpectedScore(
  ratingA: number,
  ratingB: number
): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / ELO_CONFIG.ELO_DIVISOR));
}

/**
 * Calcula o multiplicador baseado na diferença de placar.
 * Vitória por 3+: 1.0 | por 2: 0.85 | por 1: 0.7
 */
export function calculateScoreMultiplier(
  scoreWinner: number,
  scoreLoser: number
): number {
  const diff = scoreWinner - scoreLoser;

  if (diff >= 3) return SCORE_MULTIPLIERS.DOMINANT;
  if (diff === 2) return SCORE_MULTIPLIERS.COMFORTABLE;
  return SCORE_MULTIPLIERS.CLOSE;
}

/**
 * Calcula o novo rating de um atleta individual após uma partida.
 *
 * Novo rating = Rating atual + K × scoreMultiplier × officialMult × (resultado - esperado)
 * Rating mínimo garantido: 100
 */
export function calculateNewRating(params: {
  currentRating: number;
  expectedScore: number;
  actualScore: 0 | 1;
  K?: number;
  scoreMultiplier?: number;
  isOfficial?: boolean;
}): number {
  const {
    currentRating,
    expectedScore,
    actualScore,
    K = ELO_CONFIG.K_FACTOR,
    scoreMultiplier = SCORE_MULTIPLIERS.DOMINANT,
    isOfficial = false,
  } = params;

  const officialMultiplier = isOfficial
    ? ELO_CONFIG.OFFICIAL_MULTIPLIER
    : 1;

  const delta =
    K * scoreMultiplier * officialMultiplier * (actualScore - expectedScore);

  const newRating = Math.round(currentRating + delta);

  return Math.max(newRating, ELO_CONFIG.MIN_RATING);
}

/**
 * Calcula o delta de ELO (variação) sem aplicar o mínimo.
 * Usado para exibição (+32, -18, etc.)
 */
export function calculateDelta(params: {
  currentRating: number;
  expectedScore: number;
  actualScore: 0 | 1;
  K?: number;
  scoreMultiplier?: number;
  isOfficial?: boolean;
}): number {
  const {
    currentRating,
    expectedScore,
    actualScore,
    K = ELO_CONFIG.K_FACTOR,
    scoreMultiplier = SCORE_MULTIPLIERS.DOMINANT,
    isOfficial = false,
  } = params;

  const officialMultiplier = isOfficial
    ? ELO_CONFIG.OFFICIAL_MULTIPLIER
    : 1;

  const delta =
    K * scoreMultiplier * officialMultiplier * (actualScore - expectedScore);

  const newRating = Math.round(currentRating + delta);
  const clampedRating = Math.max(newRating, ELO_CONFIG.MIN_RATING);

  return clampedRating - currentRating;
}

/**
 * Processa uma partida completa e retorna os novos ratings de todos os 4 atletas.
 *
 * Fluxo:
 * 1. Calcula rating médio de cada dupla
 * 2. Calcula probabilidade esperada
 * 3. Determina o multiplicador de placar
 * 4. Atualiza cada atleta individualmente
 */
export function processMatch(match: MatchInput): EloResult[] {
  const {
    athlete1Team1Rating,
    athlete2Team1Rating,
    athlete1Team2Rating,
    athlete2Team2Rating,
    scoreTeam1,
    scoreTeam2,
    isOfficial,
  } = match;

  // Rating médio de cada dupla
  const ratingTeam1 = (athlete1Team1Rating + athlete2Team1Rating) / 2;
  const ratingTeam2 = (athlete1Team2Rating + athlete2Team2Rating) / 2;

  // Probabilidades esperadas
  const expectedTeam1 = calculateExpectedScore(ratingTeam1, ratingTeam2);
  const expectedTeam2 = calculateExpectedScore(ratingTeam2, ratingTeam1);

  // Quem ganhou
  const team1Won = scoreTeam1 > scoreTeam2;

  // Multiplicador baseado no placar
  const winnerScore = team1Won ? scoreTeam1 : scoreTeam2;
  const loserScore = team1Won ? scoreTeam2 : scoreTeam1;
  const scoreMultiplier = calculateScoreMultiplier(winnerScore, loserScore);

  // Atualizar cada atleta individualmente
  const results: EloResult[] = [];

  // Team 1, Atleta 1
  const newRating1T1 = calculateNewRating({
    currentRating: athlete1Team1Rating,
    expectedScore: expectedTeam1,
    actualScore: team1Won ? 1 : 0,
    scoreMultiplier,
    isOfficial,
  });
  results.push({
    athletePosition: "team1_athlete1",
    ratingBefore: athlete1Team1Rating,
    ratingAfter: newRating1T1,
    delta: newRating1T1 - athlete1Team1Rating,
  });

  // Team 1, Atleta 2
  const newRating2T1 = calculateNewRating({
    currentRating: athlete2Team1Rating,
    expectedScore: expectedTeam1,
    actualScore: team1Won ? 1 : 0,
    scoreMultiplier,
    isOfficial,
  });
  results.push({
    athletePosition: "team1_athlete2",
    ratingBefore: athlete2Team1Rating,
    ratingAfter: newRating2T1,
    delta: newRating2T1 - athlete2Team1Rating,
  });

  // Team 2, Atleta 1
  const newRating1T2 = calculateNewRating({
    currentRating: athlete1Team2Rating,
    expectedScore: expectedTeam2,
    actualScore: team1Won ? 0 : 1,
    scoreMultiplier,
    isOfficial,
  });
  results.push({
    athletePosition: "team2_athlete1",
    ratingBefore: athlete1Team2Rating,
    ratingAfter: newRating1T2,
    delta: newRating1T2 - athlete1Team2Rating,
  });

  // Team 2, Atleta 2
  const newRating2T2 = calculateNewRating({
    currentRating: athlete2Team2Rating,
    expectedScore: expectedTeam2,
    actualScore: team1Won ? 0 : 1,
    scoreMultiplier,
    isOfficial,
  });
  results.push({
    athletePosition: "team2_athlete2",
    ratingBefore: athlete2Team2Rating,
    ratingAfter: newRating2T2,
    delta: newRating2T2 - athlete2Team2Rating,
  });

  return results;
}

/**
 * Retorna o nível correspondente a um rating.
 */
export function getLevelForRating(rating: number): LevelConfig {
  const level = LEVELS.find(
    (l) => rating >= l.minRating && rating <= l.maxRating
  );
  return level ?? LEVELS[0];
}

/**
 * Calcula o progresso percentual dentro do nível atual.
 * Retorna 0-100 representando quão perto do próximo nível.
 */
export function getLevelProgress(rating: number): number {
  const level = getLevelForRating(rating);

  // Se é Profissional (nível máximo), progresso é baseado em incrementos de 200
  if (level.maxRating === Infinity) {
    const progressInLevel = rating - level.minRating;
    return Math.min((progressInLevel / 200) * 100, 100);
  }

  const rangeSize = level.maxRating - level.minRating + 1;
  const progressInLevel = rating - level.minRating;

  return Math.round((progressInLevel / rangeSize) * 100);
}
