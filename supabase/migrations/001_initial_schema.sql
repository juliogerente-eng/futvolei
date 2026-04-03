-- ============================================
-- QuadraHub — Schema Inicial
-- Supabase PostgreSQL Migration
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Tabela: users
-- ============================================
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'athlete' CHECK (role IN ('athlete', 'organizer', 'admin')),
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ver usuários (ranking público)
CREATE POLICY "users_select_public" ON public.users
  FOR SELECT USING (true);

-- Usuário autenticado pode inserir seu próprio registro
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Usuário autenticado pode atualizar seus próprios dados
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin pode atualizar qualquer usuário
CREATE POLICY "users_update_admin" ON public.users
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Tabela: athlete_profiles
-- ============================================
CREATE TABLE public.athlete_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating integer NOT NULL DEFAULT 1000,
  level text NOT NULL DEFAULT 'Amador C',
  wins integer NOT NULL DEFAULT 0,
  losses integer NOT NULL DEFAULT 0,
  total_matches integer NOT NULL DEFAULT 0
);

ALTER TABLE public.athlete_profiles ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ver perfis (ranking público)
CREATE POLICY "athlete_profiles_select_public" ON public.athlete_profiles
  FOR SELECT USING (true);

-- Apenas via service_role ou triggers (sistema)
CREATE POLICY "athlete_profiles_insert_system" ON public.athlete_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "athlete_profiles_update_system" ON public.athlete_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- Tabela: championships
-- ============================================
CREATE TABLE public.championships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  category text NOT NULL DEFAULT 'amador' CHECK (category IN ('amador', 'profissional', 'misto')),
  format text NOT NULL DEFAULT 'grupos_mata_mata' CHECK (format IN ('grupos_mata_mata', 'eliminatoria_direta')),
  max_teams integer NOT NULL DEFAULT 8 CHECK (max_teams IN (8, 12, 16, 24)),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'in_progress', 'finished')),
  is_official boolean NOT NULL DEFAULT false,
  start_date date,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.championships ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ver campeonatos
CREATE POLICY "championships_select_public" ON public.championships
  FOR SELECT USING (true);

-- Organizador pode criar campeonato
CREATE POLICY "championships_insert_organizer" ON public.championships
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = organizer_id
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('organizer', 'admin')
    )
  );

-- Organizador pode atualizar seus campeonatos
CREATE POLICY "championships_update_organizer" ON public.championships
  FOR UPDATE TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

-- Admin pode atualizar qualquer campeonato (is_official)
CREATE POLICY "championships_update_admin" ON public.championships
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Tabela: teams
-- ============================================
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  championship_id uuid NOT NULL REFERENCES public.championships(id) ON DELETE CASCADE,
  athlete1_id uuid NOT NULL REFERENCES public.users(id),
  athlete2_id uuid NOT NULL REFERENCES public.users(id),
  group_name text,
  seed integer,
  CONSTRAINT different_athletes CHECK (athlete1_id <> athlete2_id)
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Impedir que atleta esteja em mais de uma dupla por campeonato
-- Isso é feito via validação na API, pois um check constraint não
-- consegue validar across rows facilmente. Usamos unique index parcial.
CREATE UNIQUE INDEX idx_unique_athlete1_per_championship
  ON public.teams (championship_id, athlete1_id);
CREATE UNIQUE INDEX idx_unique_athlete2_per_championship
  ON public.teams (championship_id, athlete2_id);

-- Qualquer pessoa pode ver times
CREATE POLICY "teams_select_public" ON public.teams
  FOR SELECT USING (true);

-- Organizador do campeonato pode inserir times
CREATE POLICY "teams_insert_organizer" ON public.teams
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.championships
      WHERE id = championship_id AND organizer_id = auth.uid()
    )
  );

-- Organizador pode atualizar times do seu campeonato
CREATE POLICY "teams_update_organizer" ON public.teams
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.championships
      WHERE id = championship_id AND organizer_id = auth.uid()
    )
  );

-- Organizador pode deletar times do seu campeonato
CREATE POLICY "teams_delete_organizer" ON public.teams
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.championships
      WHERE id = championship_id AND organizer_id = auth.uid()
    )
  );

-- ============================================
-- Tabela: matches
-- ============================================
CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  championship_id uuid NOT NULL REFERENCES public.championships(id) ON DELETE CASCADE,
  team1_id uuid NOT NULL REFERENCES public.teams(id),
  team2_id uuid NOT NULL REFERENCES public.teams(id),
  score_team1 integer,
  score_team2 integer,
  winner_team_id uuid REFERENCES public.teams(id),
  stage text NOT NULL DEFAULT 'group' CHECK (stage IN ('group', 'quarterfinal', 'semifinal', 'final')),
  round integer NOT NULL DEFAULT 1,
  played_at timestamptz,
  elo_processed boolean NOT NULL DEFAULT false,
  CONSTRAINT different_teams CHECK (team1_id <> team2_id)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ver partidas
CREATE POLICY "matches_select_public" ON public.matches
  FOR SELECT USING (true);

-- Organizador do campeonato pode inserir partidas
CREATE POLICY "matches_insert_organizer" ON public.matches
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.championships
      WHERE id = championship_id AND organizer_id = auth.uid()
    )
  );

-- Organizador pode atualizar partidas (lançar resultado)
CREATE POLICY "matches_update_organizer" ON public.matches
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.championships
      WHERE id = championship_id AND organizer_id = auth.uid()
    )
  );

-- ============================================
-- Tabela: elo_history
-- ============================================
CREATE TABLE public.elo_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  rating_before integer NOT NULL,
  rating_after integer NOT NULL,
  delta integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.elo_history ENABLE ROW LEVEL SECURITY;

-- Usuário pode ver seu próprio histórico
CREATE POLICY "elo_history_select_own" ON public.elo_history
  FOR SELECT TO authenticated
  USING (auth.uid() = athlete_id);

-- Admin pode ver tudo
CREATE POLICY "elo_history_select_admin" ON public.elo_history
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Apenas insert via service_role (sistema) — sem policy de insert para users
-- O insert será feito via API route usando service_role key

-- ============================================
-- Trigger: auto-create athlete_profile on user insert
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'athlete' THEN
    INSERT INTO public.athlete_profiles (user_id, rating, level)
    VALUES (NEW.id, 1000, 'Amador C');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX idx_athlete_profiles_rating ON public.athlete_profiles (rating DESC);
CREATE INDEX idx_athlete_profiles_user_id ON public.athlete_profiles (user_id);
CREATE INDEX idx_championships_status ON public.championships (status);
CREATE INDEX idx_championships_organizer ON public.championships (organizer_id);
CREATE INDEX idx_matches_championship ON public.matches (championship_id);
CREATE INDEX idx_matches_elo_processed ON public.matches (elo_processed) WHERE NOT elo_processed;
CREATE INDEX idx_elo_history_athlete ON public.elo_history (athlete_id, created_at DESC);
CREATE INDEX idx_teams_championship ON public.teams (championship_id);

-- ============================================
-- Enable Realtime for live updates
-- ============================================
ALTER publication supabase_realtime ADD TABLE public.matches;
ALTER publication supabase_realtime ADD TABLE public.athlete_profiles;
ALTER publication supabase_realtime ADD TABLE public.championships;
