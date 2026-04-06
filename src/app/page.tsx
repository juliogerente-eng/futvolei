import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden relative" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Dynamic Background Mesh (Futuristic Base) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-30 mix-blend-screen animate-float"
          style={{ background: "radial-gradient(circle, var(--color-accent-glow), transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-20 mix-blend-screen animate-float"
          style={{ background: "radial-gradient(circle, var(--color-primary-glow), transparent 70%)", animationDelay: "-3s" }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }}
        />
      </div>

      {/* Top Nav */}
      <nav className="sticky top-4 z-50 mx-4 sm:mx-6 lg:mx-auto max-w-6xl glass-3d rounded-2xl px-2 py-1 animate-fade-in">
        <div className="px-4 sm:px-6 flex items-center justify-between h-14">
          <span className="text-xl font-bold tracking-tight">
            <span className="gradient-text">Quadra</span>
            <span>Hub</span>
          </span>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium transition-colors hover:text-white"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="btn-3d text-xs sm:text-sm font-bold px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative pt-12 sm:pt-24 pb-16 sm:pb-20 text-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            
            <div className="inline-flex flex-col items-center gap-10">
              <div className="glass-3d px-5 py-2.5 rounded-full text-sm font-medium animate-slide-up hover:glow-accent transition-all duration-300"
                style={{ border: "1px solid rgba(139, 92, 246, 0.4)" }}>
                <span className="gradient-text-alt font-bold tracking-wide uppercase text-xs">Pioneirismo em Futevôlei</span>
              </div>
              
              <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter animate-slide-up" style={{ animationDelay: "100ms" }}>
                RANKING
                <br />
                <span className="gradient-text-alt">INTELIGENTE</span>
              </h1>
              
              <p className="max-w-2xl text-lg sm:text-xl text-text-secondary animate-slide-up font-light" style={{ animationDelay: "200ms" }}>
                Sistema de ranking ELO de alta precisão, gestão térmica de torneios e evolução em tempo real.
                Profissionalize hoje seu jogo na areia.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <Link
                href="/cadastro"
                className="btn-3d px-10 py-5 rounded-2xl font-bold text-lg w-full sm:w-auto"
              >
                Inicie sua jornada →
              </Link>
              <Link
                href="/ranking"
                className="glass-3d px-10 py-5 rounded-2xl font-semibold text-lg w-full sm:w-auto hover:bg-white/5 transition-colors"
                style={{ color: "var(--color-text)" }}
              >
                Ver Ranking Live
              </Link>
            </div>

            {/* Futuristic Dashboard Preview */}
            <div className="mt-20 mx-auto max-w-4xl card-3d rounded-3xl overflow-hidden animate-slide-up" style={{ animationDelay: "400ms" }}>
              {/* Window Controls */}
              <div className="glass-3d px-6 py-4 flex items-center justify-between border-b border-white/10" style={{ background: "rgba(0,0,0,0.5)"}}>
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ background: "var(--color-error)" }} />
                  <div className="w-3.5 h-3.5 rounded-full" style={{ background: "var(--color-warning)" }} />
                  <div className="w-3.5 h-3.5 rounded-full" style={{ background: "var(--color-success)" }} />
                </div>
                <div className="text-xs font-mono tracking-widest text-text-muted">ELO::TELEMETRY_SYNC</div>
              </div>
              
              <div className="p-5 sm:p-12 relative overflow-hidden" style={{ background: "var(--color-bg-elevated)" }}>
                {/* Internal HUD Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg width="120" height="120" viewBox="0 0 100 100"><path fill="none" stroke="currentColor" strokeWidth="1" d="M0 50h100M50 0v100M25 25l50 50M25 75l50-50" /><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
                </div>
                
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                  {/* Holographic Avatar */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold z-10 relative glass-3d animate-pulse-glow"
                      style={{ border: "2px solid var(--color-primary)", color: "var(--color-text)" }}>
                      V
                    </div>
                    <div className="absolute inset-0 rounded-full animate-pulse blur-xl" style={{ background: "var(--color-primary-glow)" }} />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <h3 className="text-3xl font-bold tracking-tight">Victor de Assis</h3>
                    <div className="flex items-center justify-center md:justify-start gap-3 text-sm">
                      <span className="text-text-secondary font-mono">ID: QDHB-992</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      <span className="text-success text-xs font-bold tracking-wider">ONLINE</span>
                    </div>
                  </div>
                  
                  <div className="text-center md:text-right glass-3d p-6 rounded-2xl w-full md:w-auto">
                    <div className="text-sm font-bold text-text-secondary tracking-widest uppercase mb-1">RATING ELO</div>
                    <div className="text-5xl font-black font-mono gradient-text-alt tracking-tight">1.342</div>
                    <div className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-bold border border-accent/30" style={{ background: "var(--color-accent-glow)", color: "#C4B5FD" }}>
                      NÍVEL AMADOR B
                    </div>
                  </div>
                </div>

                {/* Progress Bar 3D */}
                <div className="mt-10">
                  <div className="flex justify-between text-xs font-bold tracking-wider mb-3 text-text-secondary">
                    <span>AMADOR B</span>
                    <span><span className="text-white">58 PTS</span> PARA AMADOR A</span>
                  </div>
                  <div className="h-4 rounded-full overflow-hidden glass-3d relative">
                    <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: "71%", background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))", boxShadow: "0 0 20px var(--color-accent-glow)" }}>
                      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)", backgroundSize: "1rem 1rem" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features - 3D Cards */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Tecnologia de Ponta<br/><span className="gradient-text-alt">para a Areia</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
              {[
                {
                  icon: "💠",
                  title: "Algoritmo Neural",
                  desc: "Nosso sistema calibra seu rating dinamicamente com base na força da dupla oponente.",
                },
                {
                  icon: "🏆",
                  title: "Gestão Holística",
                  desc: "Chaveamentos automáticos, fase de grupos e eliminatórias renderizadas instantaneamente.",
                },
                {
                  icon: "⚡",
                  title: "Telemetria Live",
                  desc: "Dados de partidas são validados em tempo real, gerando estatísticas de performance absolutas.",
                },
              ].map((card, i) => (
                <div key={card.title} className="card-3d p-6 sm:p-8 rounded-3xl" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl glass-3d flex items-center justify-center text-2xl sm:text-3xl mb-5 sm:mb-6 shadow-inner">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{card.title}</h3>
                  <p className="text-text-secondary leading-relaxed font-light">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step Flow (Holographic) */}
        <section className="py-24 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="glass-3d rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />
              
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 tracking-tight">O Fluxo de Ascensão</h2>
              
              <div className="grid sm:grid-cols-3 gap-16 md:gap-20 relative">
                {/* Connecting Line */}
                <div className="hidden sm:block absolute top-[20px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                {[
                  { step: "01", title: "Inicialização", desc: "Registo biométrico e geração de rating ELO base." },
                  { step: "02", title: "Combate", desc: "Registro em torneios homologados QuadraHub." },
                  { step: "03", title: "Ascensão", desc: "A cada vitória, seus dados influenciam o ecossistema." },
                ].map((item) => (
                  <div key={item.step} className="relative z-10 flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold mb-8 glass-3d transition-transform duration-500 group-hover:scale-125 group-hover:glow-accent"
                      style={{ border: "1px solid var(--color-primary)" }}>
                      <span className="gradient-text-alt">{item.step}</span>
                    </div>
                    <h3 className="font-bold text-xl mb-5">{item.title}</h3>
                    <p className="text-base font-light text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Area */}
        <section className="py-32 relative text-center">
          <div className="max-w-3xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black mb-6 sm:mb-8 tracking-tighter">
              Eleve seu Jogo.
              <br/>
              <span className="gradient-text-alt">Rompa a Gravidade.</span>
            </h2>
            <p className="text-xl text-text-secondary font-light mb-12">
              Junte-se ao ecossistema que está redefinindo os padrões do esporte na areia.
            </p>
            <Link
              href="/cadastro"
              className="btn-3d px-12 py-6 rounded-2xl font-bold text-xl inline-flex items-center gap-4"
            >
              Criar Perfil de Atleta
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </section>

      </main>

      {/* Futuristic Footer */}
      <footer className="relative border-t border-white/5 bg-black/50 backdrop-blur-3xl z-10">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span className="text-sm font-bold tracking-widest uppercase">QuadraHub Sys</span>
          </div>
          <p className="text-xs font-mono text-text-muted tracking-widest">
            V.2.0.1 {"//"} {new Date().getFullYear()} {"//"} ALL RIGHTS PRESERVED
          </p>
        </div>
      </footer>
    </div>
  );
}
