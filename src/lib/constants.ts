// ============================================
// QuadraHub — Constantes do Sistema
// ============================================

export const ELO_CONFIG = {
  /** Fator K padrão para cálculo ELO */
  K_FACTOR: 32,
  /** Rating inicial para novos atletas */
  INITIAL_RATING: 1000,
  /** Rating mínimo (nunca pode cair abaixo disso) */
  MIN_RATING: 100,
  /** Multiplicador para campeonatos oficiais */
  OFFICIAL_MULTIPLIER: 1.5,
  /** Divisor da fórmula ELO */
  ELO_DIVISOR: 400,
} as const;

export const SCORE_MULTIPLIERS = {
  /** Vitória por 3+ pontos de diferença */
  DOMINANT: 1.0,
  /** Vitória por 2 pontos de diferença */
  COMFORTABLE: 0.85,
  /** Vitória por 1 ponto de diferença */
  CLOSE: 0.7,
} as const;

export interface LevelConfig {
  name: string;
  minRating: number;
  maxRating: number;
  color: string;
  bgColor: string;
}

export const LEVELS: LevelConfig[] = [
  {
    name: "Aprendiz",
    minRating: 0,
    maxRating: 799,
    color: "#6B7280",
    bgColor: "rgba(107, 114, 128, 0.15)",
  },
  {
    name: "Iniciante",
    minRating: 800,
    maxRating: 999,
    color: "#22C55E",
    bgColor: "rgba(34, 197, 94, 0.15)",
  },
  {
    name: "Amador C",
    minRating: 1000,
    maxRating: 1199,
    color: "#3B82F6",
    bgColor: "rgba(59, 130, 246, 0.15)",
  },
  {
    name: "Amador B",
    minRating: 1200,
    maxRating: 1399,
    color: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.15)",
  },
  {
    name: "Amador A",
    minRating: 1400,
    maxRating: 1599,
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.15)",
  },
  {
    name: "Profissional",
    minRating: 1600,
    maxRating: Infinity,
    color: "#E8833A",
    bgColor: "rgba(232, 131, 58, 0.15)",
  },
] as const;

export const CHAMPIONSHIP_FORMATS = {
  GROUPS_KNOCKOUT: "grupos_mata_mata",
  DIRECT_ELIMINATION: "eliminatoria_direta",
} as const;

export const CHAMPIONSHIP_CATEGORIES = {
  AMATEUR: "amador",
  PROFESSIONAL: "profissional",
  MIXED: "misto",
} as const;

export const CHAMPIONSHIP_STATUS = {
  DRAFT: "draft",
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  FINISHED: "finished",
} as const;

export const USER_ROLES = {
  ATHLETE: "athlete",
  ORGANIZER: "organizer",
  ADMIN: "admin",
} as const;

export const MATCH_STAGES = {
  GROUP: "group",
  QUARTERFINAL: "quarterfinal",
  SEMIFINAL: "semifinal",
  FINAL: "final",
} as const;

export const SUPPORTED_TEAM_COUNTS = [8, 12, 16, 24] as const;
