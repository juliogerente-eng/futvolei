import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] overflow-x-hidden font-sans relative">
      {/* Dynamic Background Mesh (Futuristic Base) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-full w-full">
        <div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-30 mix-blend-screen animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(139, 92, 246, 0.25), transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-20 mix-blend-screen animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(232, 131, 58, 0.25), transparent 70%)", animationDelay: "-3s" }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }}
        />
      </div>

      {/* Top Nav */}
      <nav className="sticky top-4 z-50 mx-4 sm:mx-6 lg:mx-auto max-w-6xl glass-3d rounded-2xl px-2 py-1">
        <div className="px-4 sm:px-6 flex items-center justify-between h-14">
          <span className="text-xl font-bold tracking-tight">
            <span className="gradient-text">Quadra</span>
            <span>Hub</span>
          </span>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium transition-colors hover:text-white text-gray-400"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="btn-3d text-xs sm:text-sm font-bold px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl text-black"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col gap-24 sm:gap-32 w-full max-w-[100vw] overflow-hidden pt-12 pb-24">
        
        {/* Hero */}
        <section className="relative w-full text-center px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 lg:gap-12">
            
            <div className="glass-3d px-5 py-2.5 rounded-full text-sm font-medium hover:glow-accent transition-all duration-300 border border-purple-500/40">
              <span className="gradient-text-alt font-bold tracking-wide uppercase text-xs">Pioneirismo em Futevôlei</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-tight tracking-tighter w-full">
              RANKING
              <br className="hidden sm:block" />
              {' '}<span className="gradient-text-alt">INTELIGENTE</span>
            </h1>
            
            <p className="max-w-2xl text-lg sm:text-xl text-gray-400 font-light px-4">
              Sistema de ranking ELO de alta precisão, gestão térmica de torneios e evolução em tempo real.
              Profissionalize hoje seu jogo na areia.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-4">
              <Link
                href="/cadastro"
                className="btn-3d px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-lg w-full sm:w-auto text-black"
              >
                Inicie sua jornada →
              </Link>
              <Link
                href="/ranking"
                className="glass-3d px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-semibold text-lg w-full sm:w-auto hover:bg-white/5 transition-colors text-white"
              >
                Ver Ranking Live
              </Link>
            </div>

            {/* Futuristic Dashboard Preview */}
            <div className="mt-8 sm:mt-12 w-full max-w-4xl card-3d rounded-3xl overflow-hidden shadow-2xl">
              {/* Window Controls */}
              <div className="glass-3d px-6 py-4 flex flex-row items-center justify-between border-b border-white/10 bg-black/50">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500" />
                </div>
                <div className="text-xs font-mono tracking-widest text-gray-500">ELO::TELEMETRY_SYNC</div>
              </div>
              
              <div className="p-6 sm:p-12 relative overflow-hidden bg-[#111111]">
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 w-full">
                  
                  {/* Avatar & Name Area */}
                  <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    <div className="relative flex-shrink-0">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold z-10 relative glass-3d text-white border-2 border-[#E8833A]">
                        V
                      </div>
                    </div>
                    <div className="text-center md:text-left space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Victor de Assis</h3>
                      <div className="flex items-center justify-center md:justify-start gap-3 text-sm">
                        <span className="text-gray-500 font-mono">ID: QDHB-992</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-500 text-xs font-bold tracking-wider">ONLINE</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats Area */}
                  <div className="text-center md:text-right glass-3d p-6 rounded-2xl w-full md:w-auto flex-shrink-0">
                    <div className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-1">RATING ELO</div>
                    <div className="text-5xl font-black font-mono gradient-text-alt tracking-tight">1.342</div>
                    <div className="mt-3 inline-block px-4 py-1.5 rounded-full text-xs font-bold border border-purple-500/30 bg-purple-500/10 text-purple-300">
                      NÍVEL AMADOR B
                    </div>
                  </div>
                </div>

                {/* Progress Bar 3D */}
                <div className="mt-12 w-full">
                  <div className="flex justify-between text-xs font-bold tracking-wider mb-4 text-gray-400">
                    <span>AMADOR B</span>
                    <span><span className="text-white">58 PTS</span> PARA AMADOR A</span>
                  </div>
                  <div className="h-4 w-full rounded-full overflow-hidden glass-3d relative bg-black/40">
                    <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#E8833A] to-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.3)]" style={{ width: "71%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features - 3D Cards */}
        <section className="relative w-full px-4 sm:px-6">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Tecnologia de Ponta<br/><span className="gradient-text-alt">para a Areia</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full">
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
                <div key={card.title} className="card-3d p-8 sm:p-10 rounded-3xl flex flex-col justify-start items-start w-full">
                  <div className="w-16 h-16 rounded-2xl glass-3d flex items-center justify-center text-3xl mb-8 shadow-inner shrink-0">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{card.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light text-base lg:text-lg">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step Flow (Holographic) */}
        <section className="relative w-full px-4 sm:px-6">
          <div className="max-w-5xl mx-auto w-full">
            <div className="glass-3d rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-16 relative overflow-hidden w-full flex flex-col items-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-16 tracking-tight relative z-10">O Fluxo de Ascensão</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 lg:gap-16 w-full relative z-10">
                {/* Connecting Line - Only visible on sm and up */}
                <div className="hidden sm:block absolute top-[32px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                
                {[
                  { step: "01", title: "Inicialização", desc: "Registo biométrico e geração de rating ELO base." },
                  { step: "02", title: "Combate", desc: "Registro em torneios homologados QuadraHub." },
                  { step: "03", title: "Ascensão", desc: "A cada vitória, seus dados influenciam o ecossistema." },
                ].map((item) => (
                  <div key={item.step} className="relative z-10 flex flex-col items-center text-center w-full">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold mb-6 glass-3d border border-[#E8833A] bg-black/50">
                      <span className="gradient-text-alt">{item.step}</span>
                    </div>
                    <h3 className="font-bold text-xl sm:text-2xl mb-4">{item.title}</h3>
                    <p className="text-base font-light text-gray-400 max-w-[200px]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Area */}
        <section className="relative w-full py-16 sm:py-24 text-center px-4">
          <div className="max-w-3xl mx-auto flex flex-col items-center w-full">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 tracking-tighter">
              Eleve seu Jogo.
              <br/>
              <span className="gradient-text-alt">Rompa a Gravidade.</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 font-light mb-12 max-w-xl mx-auto">
              Junte-se ao ecossistema que está redefinindo os padrões do esporte na areia.
            </p>
            <Link
              href="/cadastro"
              className="btn-3d px-8 py-5 sm:px-12 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl inline-flex items-center justify-center gap-4 w-full sm:w-auto text-black"
            >
              Criar Perfil de Atleta
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Futuristic Footer */}
      <footer className="relative border-t border-white/5 bg-black/50 backdrop-blur-3xl z-10 w-full">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
          <div className="flex items-center gap-2 opacity-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span className="text-sm font-bold tracking-widest uppercase">QuadraHub Sys</span>
          </div>
          <p className="text-xs font-mono text-gray-600 tracking-widest text-center md:text-right">
            V.2.0.1 {"//"} {new Date().getFullYear()} {"//"} ALL RIGHTS PRESERVED
          </p>
        </div>
      </footer>
    </div>
  );
}
