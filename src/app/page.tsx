import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Top Nav */}
      <nav
        className="sticky top-0 z-50 glass"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <span className="text-xl font-bold">
            <span className="gradient-text">Quadra</span>
            <span>Hub</span>
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="text-sm font-semibold px-4 py-2 rounded-lg transition-all"
              style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}
            >
              Criar conta grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent)" }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium animate-fade-in"
            style={{ background: "var(--color-primary-glow)", color: "var(--color-primary)", border: "1px solid var(--color-primary)33" }}>
            🏐 Plataforma #1 de Futevôlei do Brasil
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight animate-slide-up">
            Ranking profissional
            <br />
            <span className="gradient-text">para seu futevôlei</span>
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-lg sm:text-xl text-text-secondary animate-slide-up" style={{ animationDelay: "100ms" }}>
            Sistema de ranking ELO, campeonatos organizados e evolução em tempo real.
            Tudo que você precisa para profissionalizar seu esporte.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Link
              href="/cadastro"
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 glow-primary"
              style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}
            >
              Criar conta grátis →
            </Link>
            <Link
              href="/ranking"
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              Ver ranking ao vivo
            </Link>
          </div>

          {/* Fake dashboard preview */}
          <div className="mt-16 mx-auto max-w-4xl rounded-xl overflow-hidden glow-primary animate-slide-up"
            style={{ animationDelay: "300ms", background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            <div className="p-1.5 flex gap-1.5" style={{ borderBottom: "1px solid var(--color-border)" }}>
              <div className="w-3 h-3 rounded-full" style={{ background: "#EF4444" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#22C55E" }} />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{ background: "var(--color-primary-glow)", color: "var(--color-primary)" }}>V</div>
                <div>
                  <div className="font-bold">Victor de Assis</div>
                  <div className="text-xs text-text-secondary">Santos, SP</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-3xl font-bold font-mono" style={{ color: "var(--color-primary)" }}>1.342</div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8B5CF6" }}>Amador B</span>
                </div>
              </div>
              <div className="h-2 rounded-full mb-2" style={{ background: "var(--color-bg)" }}>
                <div className="h-full rounded-full" style={{ width: "71%", background: "linear-gradient(90deg, #8B5CF6, #8B5CF6aa)" }} />
              </div>
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Amador B</span>
                <span>58 pts para Amador A</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20" style={{ background: "var(--color-bg-elevated)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            O ranking do seu campeonato
            <br />
            <span className="gradient-text">ainda é feito no caderno?</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Sem ranking justo, sem dados, sem histórico. Organizar campeonato é caótico e atletas
            não sabem onde estão na escala. Isso acaba hoje.
          </p>
        </div>
      </section>

      {/* Solution — 3 Cards */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            A solução completa
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: "📊",
                title: "Ranking Justo",
                desc: "Sistema ELO adaptado para duplas. Seu rating sobe e desce com base em quem você enfrenta e o placar da partida.",
              },
              {
                icon: "🏆",
                title: "Campeonatos Organizados",
                desc: "Crie campeonatos, inscreva duplas, gere tabelas automáticas e lance resultados em tempo real.",
              },
              {
                icon: "📈",
                title: "Evolução em Tempo Real",
                desc: "Acompanhe seu rating, nível, histórico e veja onde você está no ranking geral e da sua cidade.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl p-6 transition-all duration-300 hover:scale-105"
                style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
              >
                <span className="text-4xl">{card.icon}</span>
                <h3 className="text-xl font-bold mt-4 mb-2">{card.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ background: "var(--color-bg-elevated)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Como funciona</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Cadastre-se", desc: "Crie sua conta grátis e receba seu rating inicial de 1.000 pontos." },
              { step: "2", title: "Jogue", desc: "Participe de campeonatos organizados na plataforma." },
              { step: "3", title: "Suba no ranking", desc: "Seu rating atualiza automaticamente a cada partida." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-4"
                  style={{ background: "var(--color-primary-glow)", color: "var(--color-primary)", border: "2px solid var(--color-primary)" }}
                >
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Organizers */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl p-8 sm:p-12"
            style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-primary)" }}>
                Para organizadores
              </span>
              <h2 className="text-3xl font-bold mt-3 mb-4">
                Seu campeonato, profissionalizado
              </h2>
              <p className="text-text-secondary mb-6">
                Crie campeonatos em minutos. A plataforma gera tabelas automaticamente,
                gerencia inscrições e atualiza o ranking de todos os atletas em tempo real.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Geração automática de tabelas (grupos + mata-mata ou eliminatória)",
                  "Inscrição de duplas com busca por nome/e-mail",
                  "Lançamento de resultados em tempo real",
                  "Rating ELO processado automaticamente após cada partida",
                  "Campeonatos oficiais com peso de ELO aumentado",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span style={{ color: "var(--color-success)" }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/cadastro"
                className="inline-block px-6 py-3 rounded-lg font-semibold transition-all"
                style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}
              >
                Começar como organizador
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 text-center relative overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent)" }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            Comece agora
            <br />
            <span className="gradient-text">é grátis</span>
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Crie sua conta, receba seu rating e comece a evoluir hoje.
          </p>
          <Link
            href="/cadastro"
            className="inline-block px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 glow-primary"
            style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}
          >
            Criar conta grátis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--color-border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold">
            <span className="gradient-text">Quadra</span>Hub
          </span>
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} QuadraHub. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
