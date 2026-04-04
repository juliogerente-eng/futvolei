import { z } from "zod";

// ============================================
// Auth Validators
// ============================================

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(72, "Senha muito longa"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z
    .string()
    .length(2, "Estado deve ter 2 letras (ex: SP)")
    .toUpperCase(),
  phone: z.string().optional(),
  role: z.enum(["athlete", "organizer"], {
    message: "Selecione: Atleta ou Organizador",
  }),
});

export const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

// ============================================
// Profile Validators
// ============================================

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z
    .string()
    .length(2, "Estado deve ter 2 letras")
    .toUpperCase(),
  phone: z.string().optional(),
});

// ============================================
// Championship Validators
// ============================================

export const createChampionshipSchema = z.object({
  name: z
    .string()
    .min(3, "Nome do campeonato deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 letras").toUpperCase(),
  category: z.enum(["amador", "profissional", "misto"], {
    message: "Categoria inválida",
  }),
  format: z.enum(["grupos_mata_mata", "eliminatoria_direta"], {
    message: "Formato inválido",
  }),
  max_teams: z.union([z.literal(8), z.literal(12), z.literal(16), z.literal(24)], {
    message: "Número de duplas inválido (8, 12, 16 ou 24)",
  }),
  start_date: z.string().min(1, "Data de início é obrigatória"),
  end_date: z.string().min(1, "Data de término é obrigatória"),
});

// ============================================
// Match Validators
// ============================================

export const submitMatchResultSchema = z
  .object({
    match_id: z.string().uuid("ID da partida inválido"),
    score_team1: z
      .number()
      .int()
      .min(0, "Placar não pode ser negativo")
      .max(50, "Placar inválido"),
    score_team2: z
      .number()
      .int()
      .min(0, "Placar não pode ser negativo")
      .max(50, "Placar inválido"),
  })
  .refine(
    (data) => data.score_team1 !== data.score_team2,
    { message: "Partida não pode terminar empatada", path: ["score_team2"] }
  );

// ============================================
// Team Validators
// ============================================

export const registerTeamSchema = z
  .object({
    championship_id: z.string().uuid("ID do campeonato inválido"),
    athlete1_id: z.string().uuid("Atleta 1 inválido"),
    athlete2_id: z.string().uuid("Atleta 2 inválido"),
  })
  .refine(
    (data) => data.athlete1_id !== data.athlete2_id,
    { message: "Os dois atletas devem ser diferentes", path: ["athlete2_id"] }
  );

// ============================================
// Type exports
// ============================================

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateChampionshipInput = z.infer<typeof createChampionshipSchema>;
export type SubmitMatchResultInput = z.infer<typeof submitMatchResultSchema>;
export type RegisterTeamInput = z.infer<typeof registerTeamSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
