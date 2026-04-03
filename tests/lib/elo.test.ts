// ============================================
// QuadraHub — Testes do Sistema ELO
// ============================================

import { describe, it, expect } from "vitest";
import {
  calculateExpectedScore,
  calculateScoreMultiplier,
  calculateNewRating,
  processMatch,
  getLevelForRating,
  getLevelProgress,
  calculateDelta,
} from "@/lib/elo";
import { ELO_CONFIG, SCORE_MULTIPLIERS } from "@/lib/constants";

describe("calculateExpectedScore", () => {
  it("retorna 0.5 quando ratings são iguais", () => {
    const result = calculateExpectedScore(1000, 1000);
    expect(result).toBeCloseTo(0.5, 5);
  });

  it("retorna ~0.76 quando A tem 200 pontos a mais que B", () => {
    const result = calculateExpectedScore(1200, 1000);
    expect(result).toBeCloseTo(0.7597, 3);
  });

  it("retorna ~0.24 quando A tem 200 pontos a menos que B", () => {
    const result = calculateExpectedScore(1000, 1200);
    expect(result).toBeCloseTo(0.2403, 3);
  });

  it("favorito tem alta probabilidade com grande diferença", () => {
    const result = calculateExpectedScore(1600, 1000);
    expect(result).toBeGreaterThan(0.9);
  });

  it("underdog tem baixa probabilidade com grande diferença", () => {
    const result = calculateExpectedScore(1000, 1600);
    expect(result).toBeLessThan(0.1);
  });
});

describe("calculateScoreMultiplier", () => {
  it("retorna 1.0 para vitória por 3+ pontos", () => {
    expect(calculateScoreMultiplier(18, 10)).toBe(SCORE_MULTIPLIERS.DOMINANT);
    expect(calculateScoreMultiplier(18, 15)).toBe(SCORE_MULTIPLIERS.DOMINANT);
    expect(calculateScoreMultiplier(18, 5)).toBe(SCORE_MULTIPLIERS.DOMINANT);
  });

  it("retorna 0.85 para vitória por 2 pontos", () => {
    expect(calculateScoreMultiplier(18, 16)).toBe(SCORE_MULTIPLIERS.COMFORTABLE);
  });

  it("retorna 0.7 para vitória por 1 ponto", () => {
    expect(calculateScoreMultiplier(18, 17)).toBe(SCORE_MULTIPLIERS.CLOSE);
  });
});

describe("calculateNewRating", () => {
  it("vencedor ganha pontos", () => {
    const newRating = calculateNewRating({
      currentRating: 1000,
      expectedScore: 0.5,
      actualScore: 1,
    });
    expect(newRating).toBeGreaterThan(1000);
  });

  it("perdedor perde pontos", () => {
    const newRating = calculateNewRating({
      currentRating: 1000,
      expectedScore: 0.5,
      actualScore: 0,
    });
    expect(newRating).toBeLessThan(1000);
  });

  it("underdog ganha mais pontos ao vencer", () => {
    const underdogGain = calculateNewRating({
      currentRating: 1000,
      expectedScore: 0.24,
      actualScore: 1,
    });
    const favoriteGain = calculateNewRating({
      currentRating: 1200,
      expectedScore: 0.76,
      actualScore: 1,
    });
    const underdogDelta = underdogGain - 1000;
    const favoriteDelta = favoriteGain - 1200;
    expect(underdogDelta).toBeGreaterThan(favoriteDelta);
  });

  it("rating nunca cai abaixo de 100", () => {
    const newRating = calculateNewRating({
      currentRating: 100,
      expectedScore: 0.99,
      actualScore: 0,
    });
    expect(newRating).toBe(ELO_CONFIG.MIN_RATING);
  });

  it("campeonato oficial multiplica K por 1.5", () => {
    const normal = calculateNewRating({
      currentRating: 1000,
      expectedScore: 0.5,
      actualScore: 1,
      isOfficial: false,
    });
    const official = calculateNewRating({
      currentRating: 1000,
      expectedScore: 0.5,
      actualScore: 1,
      isOfficial: true,
    });
    const normalDelta = normal - 1000;
    const officialDelta = official - 1000;
    expect(officialDelta).toBeCloseTo(normalDelta * ELO_CONFIG.OFFICIAL_MULTIPLIER, 0);
  });

  it("multiplicador de placar reduz ganho em partida apertada", () => {
    const dominant = calculateNewRating({
      currentRating: 1000,
      expectedScore: 0.5,
      actualScore: 1,
      scoreMultiplier: SCORE_MULTIPLIERS.DOMINANT,
    });
    const close = calculateNewRating({
      currentRating: 1000,
      expectedScore: 0.5,
      actualScore: 1,
      scoreMultiplier: SCORE_MULTIPLIERS.CLOSE,
    });
    expect(dominant - 1000).toBeGreaterThan(close - 1000);
  });
});

describe("calculateDelta", () => {
  it("retorna valor positivo para vitória", () => {
    const delta = calculateDelta({
      currentRating: 1000,
      expectedScore: 0.5,
      actualScore: 1,
    });
    expect(delta).toBeGreaterThan(0);
  });

  it("retorna valor negativo para derrota", () => {
    const delta = calculateDelta({
      currentRating: 1000,
      expectedScore: 0.5,
      actualScore: 0,
    });
    expect(delta).toBeLessThan(0);
  });

  it("delta respeita rating mínimo", () => {
    const delta = calculateDelta({
      currentRating: 110,
      expectedScore: 0.99,
      actualScore: 0,
    });
    // Rating não pode cair abaixo de 100, então delta é limitado
    expect(110 + delta).toBeGreaterThanOrEqual(ELO_CONFIG.MIN_RATING);
  });
});

describe("processMatch", () => {
  it("retorna 4 resultados (um por atleta)", () => {
    const results = processMatch({
      athlete1Team1Rating: 1000,
      athlete2Team1Rating: 1000,
      athlete1Team2Rating: 1000,
      athlete2Team2Rating: 1000,
      scoreTeam1: 18,
      scoreTeam2: 12,
      isOfficial: false,
    });
    expect(results).toHaveLength(4);
  });

  it("vencedores ganham e perdedores perdem em partida equilibrada", () => {
    const results = processMatch({
      athlete1Team1Rating: 1000,
      athlete2Team1Rating: 1000,
      athlete1Team2Rating: 1000,
      athlete2Team2Rating: 1000,
      scoreTeam1: 18,
      scoreTeam2: 12,
      isOfficial: false,
    });

    // Team 1 venceu
    expect(results[0].delta).toBeGreaterThan(0); // T1 A1
    expect(results[1].delta).toBeGreaterThan(0); // T1 A2
    expect(results[2].delta).toBeLessThan(0); // T2 A1
    expect(results[3].delta).toBeLessThan(0); // T2 A2
  });

  it("ganhar 18x5 vale mais que ganhar 18x17", () => {
    const goleada = processMatch({
      athlete1Team1Rating: 1000,
      athlete2Team1Rating: 1000,
      athlete1Team2Rating: 1000,
      athlete2Team2Rating: 1000,
      scoreTeam1: 18,
      scoreTeam2: 5,
      isOfficial: false,
    });

    const apertada = processMatch({
      athlete1Team1Rating: 1000,
      athlete2Team1Rating: 1000,
      athlete1Team2Rating: 1000,
      athlete2Team2Rating: 1000,
      scoreTeam1: 18,
      scoreTeam2: 17,
      isOfficial: false,
    });

    expect(goleada[0].delta).toBeGreaterThan(apertada[0].delta);
  });

  it("dupla fraca ganha mais ao vencer dupla forte", () => {
    const results = processMatch({
      athlete1Team1Rating: 800,
      athlete2Team1Rating: 900,
      athlete1Team2Rating: 1300,
      athlete2Team2Rating: 1400,
      scoreTeam1: 18,
      scoreTeam2: 12,
      isOfficial: false,
    });

    // Time 1 (fraco) venceu o time 2 (forte)
    // Ganho do time fraco deve ser grande
    expect(results[0].delta).toBeGreaterThan(20);
    // Perda do time forte deve ser grande
    expect(results[2].delta).toBeLessThan(-20);
  });

  it("campeonato oficial tem deltas maiores", () => {
    const normal = processMatch({
      athlete1Team1Rating: 1000,
      athlete2Team1Rating: 1000,
      athlete1Team2Rating: 1000,
      athlete2Team2Rating: 1000,
      scoreTeam1: 18,
      scoreTeam2: 12,
      isOfficial: false,
    });

    const official = processMatch({
      athlete1Team1Rating: 1000,
      athlete2Team1Rating: 1000,
      athlete1Team2Rating: 1000,
      athlete2Team2Rating: 1000,
      scoreTeam1: 18,
      scoreTeam2: 12,
      isOfficial: true,
    });

    expect(Math.abs(official[0].delta)).toBeGreaterThan(
      Math.abs(normal[0].delta)
    );
  });

  it("soma dos deltas é aproximadamente zero em partida equilibrada", () => {
    const results = processMatch({
      athlete1Team1Rating: 1000,
      athlete2Team1Rating: 1000,
      athlete1Team2Rating: 1000,
      athlete2Team2Rating: 1000,
      scoreTeam1: 18,
      scoreTeam2: 12,
      isOfficial: false,
    });

    const totalDelta = results.reduce((sum, r) => sum + r.delta, 0);
    // Em partidas equilibradas, a soma dos deltas tende a zero (+-1 por arredondamento)
    expect(Math.abs(totalDelta)).toBeLessThanOrEqual(2);
  });
});

describe("getLevelForRating", () => {
  it("rating 500 = Aprendiz", () => {
    expect(getLevelForRating(500).name).toBe("Aprendiz");
  });

  it("rating 800 = Iniciante", () => {
    expect(getLevelForRating(800).name).toBe("Iniciante");
  });

  it("rating 1000 = Amador C (rating inicial)", () => {
    expect(getLevelForRating(1000).name).toBe("Amador C");
  });

  it("rating 1200 = Amador B", () => {
    expect(getLevelForRating(1200).name).toBe("Amador B");
  });

  it("rating 1400 = Amador A", () => {
    expect(getLevelForRating(1400).name).toBe("Amador A");
  });

  it("rating 1600 = Profissional", () => {
    expect(getLevelForRating(1600).name).toBe("Profissional");
  });

  it("rating 2000 = Profissional", () => {
    expect(getLevelForRating(2000).name).toBe("Profissional");
  });

  it("rating 0 = Aprendiz", () => {
    expect(getLevelForRating(0).name).toBe("Aprendiz");
  });

  it("cada nível tem a cor correta", () => {
    expect(getLevelForRating(500).color).toBe("#6B7280");
    expect(getLevelForRating(800).color).toBe("#22C55E");
    expect(getLevelForRating(1000).color).toBe("#3B82F6");
    expect(getLevelForRating(1200).color).toBe("#8B5CF6");
    expect(getLevelForRating(1400).color).toBe("#F59E0B");
    expect(getLevelForRating(1600).color).toBe("#E8833A");
  });
});

describe("getLevelProgress", () => {
  it("início do nível = 0%", () => {
    expect(getLevelProgress(800)).toBe(0);
  });

  it("metade do nível = ~50%", () => {
    // Iniciante: 800-999 (200 range)
    const progress = getLevelProgress(900);
    expect(progress).toBeGreaterThanOrEqual(45);
    expect(progress).toBeLessThanOrEqual(55);
  });

  it("Profissional tem progresso limitado a 100%", () => {
    expect(getLevelProgress(1800)).toBeLessThanOrEqual(100);
  });
});
