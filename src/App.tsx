import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useMotionValue } from 'motion/react';
import { ShieldCheck, Briefcase, TrendingUp, Gavel, ArrowRight, ArrowUpRight, Scale, Globe, UserCheck, Menu, X, Phone } from 'lucide-react';

const Noise = () => <div className="noise" />;

const BackgroundScale = ({ className }: { className?: string }) => {
  return (
    <motion.div
      className={`absolute pointer-events-none select-none z-0 ${className}`}
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    >
      <Scale className="w-full h-full stroke-[0.2]" />
    </motion.div>
  );
};

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const isHovering = useMotionValue(0);
  const size = useTransform(isHovering, [0, 1], [16, 64]);
  const offset = useTransform(isHovering, [0, 1], [-8, -32]);

  useEffect(() => {
    let rafId: number;
    const moveCursor = (e: MouseEvent) => {
      // Direct update for maximum responsiveness without spring
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      isHovering.set((target.closest('a') || target.closest('button')) ? 1 : 0);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, [cursorX, cursorY, isHovering]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] rounded-full pointer-events-none hidden md:flex items-center justify-center border border-gold-500 will-change-transform"
      style={{
        x: cursorX,
        y: cursorY,
        width: size,
        height: size,
        marginLeft: offset,
        marginTop: offset,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
      }}
    >
      <motion.div className="w-1.5 h-1.5 bg-gold-500 rounded-full will-change-transform" style={{ opacity: useTransform(isHovering, [0, 1], [1, 0]) }} />
    </motion.div>
  );
};

const Magnetic = ({ children }: { children: React.ReactElement }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 30, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 400, damping: 30, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.2);
    y.set((clientY - (top + height / 2)) * 0.2);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref} onMouseMove={handleMouse} onMouseLeave={reset}
      style={{ x: springX, y: springY }} className="inline-block"
    >
      {children}
    </motion.div>
  );
};

const Header = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 150);
    setScrolled(latest > 50);
  });

  return (
    <motion.header 
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }} animate={hidden ? "hidden" : "visible"} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 w-full z-50 py-6 px-6 md:px-12 transition-all duration-500"
    >
      <div className={`flex items-center justify-between mx-auto max-w-7xl px-8 py-4 rounded-full transition-all duration-500 ${scrolled ? 'glass-border shadow-2xl shadow-black/50' : 'bg-transparent'}`}>
        <a href="#home" className="flex items-center gap-3">
          <Scale className="text-gold-500 w-6 h-6" />
          <span className="font-serif text-lg font-bold tracking-tight text-white cursor-pointer hover:text-gold-500 transition-colors">LUCIANO GAGNO</span>
        </a>
        <nav className="hidden lg:flex gap-10">
          {[
            { name: 'Home', id: '#home' },
            { name: 'Soluções', id: '#solucoes' },
            { name: 'Método', id: '#método' },
            { name: 'Sobre', id: '#sobre' }
          ].map((l) => (
            <Magnetic key={l.name}>
              <a href={l.id} className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 hover:text-white transition-colors">{l.name}</a>
            </Magnetic>
          ))}
        </nav>
        <Magnetic>
          <a href="https://wa.me/5527998118489" target="_blank" rel="noreferrer" className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-gold-500 hover:text-black hover:border-gold-500 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all">
            Auditoria <ArrowUpRight size={14} />
          </a>
        </Magnetic>
        <button className="lg:hidden text-white"><Menu /></button>
      </div>
    </motion.header>
  );
};

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 400, mass: 0.1 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 400, mass: 0.1 });

  useEffect(() => {
     const handleMouseMove = (e: MouseEvent) => {
       mouseX.set((e.clientX / window.innerWidth - 0.5) * 15);
       mouseY.set((e.clientY / window.innerHeight - 0.5) * 15);
     };
     window.addEventListener('mousemove', handleMouseMove, { passive: true });
     return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section id="home" className="relative min-h-[100svh] flex items-start justify-center pt-24 lg:pt-32 overflow-hidden">
       <BackgroundScale className="w-[120vh] h-[120vh] -left-[10vw] top-[5vh] text-gold-500/5" />
       <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
         <div className="w-[800px] h-[800px] rounded-full mix-blend-screen opacity-20" style={{ background: 'radial-gradient(circle, rgba(170,140,44,1) 0%, rgba(170,140,44,0) 70%)' }} />
       </div>
       <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 relative z-10 items-start">
          <div className="lg:col-span-7 flex flex-col justify-start pt-8 w-full max-w-[650px] mx-auto lg:mx-0">
             <div className="overflow-hidden mb-8 flex items-center gap-4">
                <div className="h-[1px] w-12 bg-gold-500" />
                <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="text-gold-500 font-bold uppercase tracking-[0.4em] text-[10px]">Private Legal Advisory</motion.span>
             </div>
             <div className="mb-10">
               <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif leading-[1.05] tracking-tight text-white mb-2">
                 <div className="overflow-hidden"><motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}>Legado Exige</motion.div></div>
                 <div className="overflow-hidden"><motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}><span className="italic font-light text-white/50">Absoluta</span> <span className="text-gold-500">Proteção.</span></motion.div></div>
               </h1>
             </div>
             <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }} className="text-lg text-white/40 font-light max-w-xl mb-12 leading-relaxed">
               Engenharia jurídica silenciosa e impenetrável. Assessoria estratégica permanente para corporações e famílias que não aceitam margem para o erro.
             </motion.p>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
               <Magnetic>
                 <a href="#solucoes" className="bg-white text-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors flex items-center gap-2 w-max cursor-none">
                    Ver Especialidades <ArrowRight size={16} />
                 </a>
               </Magnetic>
             </motion.div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-start items-start pt-16 lg:pt-8 lg:-ml-12 relative">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }} style={{ x: smoothX, y: smoothY, willChange: 'transform' }} className="relative w-full max-w-[340px] md:max-w-[400px] lg:max-w-[460px] group flex justify-center">
                <div className="w-full relative flex items-end justify-center">
                   <img src="/luciano gagno.png" alt="Dr. Luciano Gagno" className="w-full h-auto object-contain object-bottom grayscale-0 lg:grayscale opacity-100 lg:opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transform transition-all duration-700 origin-top" style={{ willChange: 'transform, filter' }} referrerPolicy="no-referrer" loading="eager" />
                   <div className="absolute bottom-6 w-full flex justify-center pointer-events-none px-2 lg:px-4">
                     <p className="text-white font-serif text-[1.1rem] sm:text-2xl md:text-3xl lg:text-[1.8rem] italic opacity-90 leading-snug w-[100%] mx-auto text-center" style={{ textShadow: "0px 4px 20px rgba(0,0,0,0.9), 0px 2px 5px rgba(0,0,0,1)" }}>"A prevenção não tem preço.<br/> O litígio tem custo."</p>
                   </div>
                </div>
             </motion.div>
          </div>
       </div>
    </section>
  );
};

const AnimatedNameFinal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const words = "LUCIANO GAGNO".split(' ');
  
  return (
    <section ref={ref} className="py-40 flex items-center justify-center overflow-hidden min-h-[50vh] bg-black-bg border-y border-white/5 relative">
       <div className="absolute inset-0 bg-gradient-to-b from-black-bg via-transparent to-black-bg z-10 pointer-events-none" />
       <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-x-6 md:gap-x-12 gap-y-2">
          {words.map((word, wIdx) => (
             <div key={wIdx} className="flex gap-x-1 md:gap-x-3">
                {word.split('').map((char, i) => {
                   const x = useTransform(scrollYProgress, [0, 1], [(i % 2 === 0 ? 1 : -1) * (Math.random() * 400 + 100), 0]);
                   const y = useTransform(scrollYProgress, [0, 1], [(Math.random() * 400 + 200), 0]);
                   const rotate = useTransform(scrollYProgress, [0, 1], [(Math.random() - 0.5) * 90, 0]);
                   const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0.3, 1]);
                   return (
                     <motion.span key={i} style={{ x, y, rotate, opacity }} className="text-[11vw] sm:text-7xl md:text-8xl lg:text-[10vw] font-serif tracking-tighter text-white leading-none">
                       {char}
                     </motion.span>
                   );
                })}
             </div>
          ))}
       </div>
    </section>
  );
};

const BentoCard = ({ title, desc, icon, delay, className }: any) => (
  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay }} className={`group relative glass-border rounded-[2rem] p-8 md:p-12 overflow-hidden flex flex-col justify-between ${className}`}>
     <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/5 transition-colors duration-700" />
     <div className="relative z-10">
        <div className="text-gold-500/80 mb-8 group-hover:text-gold-500 group-hover:scale-110 transition-transform duration-500 origin-left">{icon}</div>
        <h3 className="text-2xl md:text-3xl font-serif mb-4 text-white group-hover:text-gold-400 transition-colors">{title}</h3>
        <p className="text-white/40 font-light leading-relaxed text-sm lg:text-base max-w-sm">{desc}</p>
     </div>
  </motion.div>
);

const BentoGrid = () => (
   <section className="relative py-32 container mx-auto px-6 overflow-hidden" id="solucoes">
      <BackgroundScale className="w-[120vh] h-[120vh] -left-[30vw] top-[10vh] text-white/5 opacity-50" />
      <div className="mb-16 relative z-10">
        <span className="text-gold-500 font-bold uppercase tracking-[0.3em] text-[10px] block mb-4">Soluções Customizadas</span>
        <h2 className="text-4xl md:text-6xl font-serif text-white">Engenharia <span className="italic text-white/50 border-b border-gold-500/30">Corporativa</span></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[350px]">
         <BentoCard title="Blindagem Patrimonial" desc="Isolamento de patrimônio pessoal em estruturas seguras contra contingências corporativas agressivas." icon={<ShieldCheck size={48} strokeWidth={1} />} className="md:col-span-2" delay={0.1} />
         <BentoCard title="Consultoria Permanente" desc="Conselho jurídico de elite integrado ao seu negócio. Atuação preventiva em tempo real." icon={<Briefcase size={48} strokeWidth={1} />} className="md:col-span-1" delay={0.2} />
         <BentoCard title="Holding Familiar" desc="Planejamento sucessório que garante economia drástica no ITCMD e paz estrutural familiar." icon={<Globe size={48} strokeWidth={1} />} className="md:col-span-1 border-gold-500/20" delay={0.3} />
         <BentoCard title="Inteligência Tributária" desc="Revisitação minuciosa e técnica para redução de impostos e recuperação lícita de ativos empresariais." icon={<TrendingUp size={48} strokeWidth={1} />} className="md:col-span-2" delay={0.4} />
      </div>
   </section>
);

const HorizontalScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);
  
  return (
    <section ref={ref} className="h-[300vh] relative bg-black-bg" id="método">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden border-y border-white/5">
        <BackgroundScale className="w-[150vh] h-[150vh] left-[20vw] top-[-25vh] text-gold-500/5" />
        <div className="container mx-auto px-6 mb-8 mt-12 w-full relative z-10"><span className="text-gold-500 font-bold uppercase tracking-[0.3em] text-[10px]">O Método LG</span></div>
        <motion.div style={{ x }} className="flex w-[300vw] h-full pb-32 items-center">
          {[ 
            { id: '01', t: 'Diagnóstico', st: 'Profundo', d: 'Mapeamento minucioso do cenário empresarial para prever litígios e passivos antes da ignição.' },
            { id: '02', t: 'Engenharia', st: 'Tática', d: 'Desenho de estruturas societárias blindadas e contratos inquebráveis focados na expansão pacífica.' },
            { id: '03', t: 'Governança', st: 'Ativa', d: 'Implementação e monitoramento contínuo das defesas. Atuação robusta em Tribunais Superiores.' }
          ].map((item, i) => (
             <div key={i} className="w-[100vw] flex-shrink-0 px-6 md:px-24">
                <div className="max-w-3xl flex flex-col">
                   <h2 className="text-[150px] md:text-[250px] font-serif leading-none text-white/[0.02] font-black -mb-16 md:-mb-24 translate-x-[-10px]">{item.id}</h2>
                   <h3 className="text-5xl md:text-7xl font-serif text-white mb-6 z-10">{item.t} <span className="italic text-gold-500">{item.st}</span></h3>
                   <p className="text-xl md:text-2xl text-white/40 font-light z-10 max-w-xl">{item.d}</p>
                </div>
             </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="sobre" className="relative py-32 container mx-auto px-6 overflow-hidden border-t border-white/5">
       <BackgroundScale className="w-[100vh] h-[100vh] -right-[20vw] top-0 text-white/5" />
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative flex justify-center items-end">
             <div className="w-full max-w-[340px] md:max-w-[420px] lg:max-w-[460px] mx-auto relative z-10">
                <img src="/luciano.png" alt="Dr. Luciano Gagno" className="w-full h-auto object-contain object-bottom grayscale-0 lg:grayscale opacity-100 lg:opacity-80 hover:grayscale-0 hover:opacity-100 hover:scale-105 transform transition-all duration-700 origin-bottom" style={{ willChange: 'transform, filter' }} referrerPolicy="no-referrer" loading="lazy" />
             </div>
             
             {/* Decor */}
             <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full max-w-md h-64 rounded-full pointer-events-none z-0 opacity-40 mix-blend-screen" style={{ background: 'radial-gradient(circle, rgba(170,140,44,0.5) 0%, rgba(170,140,44,0) 70%)' }} />
          </motion.div>
          
          <div>
            <span className="text-gold-500 font-bold uppercase tracking-[0.3em] text-[10px] block mb-4">Mestre em Direito</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">Quem é <br/><span className="text-gold-500 italic">Luciano Gagno</span></h2>
            
            <div className="space-y-6 text-white/40 font-light text-base md:text-lg leading-relaxed">
               <p>Com quase duas décadas de atuação impecável, Luciano Gagno é Doutor em Processo Civil pela Universidade de São Paulo (USP) e autor de livros fundamentais para a doutrina moderna.</p>
               <p>Sua abordagem une o rigor acadêmico de excelência com uma visão predatória de negócios. Não há espaço para o risco não calculado. Como professor universitário, formou não apenas alunos, mas mentes preparadas para blindar legados intransponíveis.</p>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-6">
              <div className="glass-border rounded-2xl p-6 flex-1">
                 <h4 className="text-3xl font-serif text-gold-500 mb-2">20+</h4>
                 <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Anos de Experiência</p>
              </div>
              <div className="glass-border rounded-2xl p-6 flex-1">
                 <h4 className="text-3xl font-serif text-gold-500 mb-2">USP</h4>
                 <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Doutorado em Processo</p>
              </div>
            </div>
          </div>
       </div>
    </section>
  );
};

const Footer = () => (
  <footer className="pt-32 pb-12 bg-black-bg border-t border-white/5 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 mix-blend-screen" style={{ background: 'radial-gradient(circle, rgba(170,140,44,0.3) 0%, rgba(170,140,44,0) 70%)' }} />
    <div className="container mx-auto px-6 relative z-10">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
         <div className="lg:col-span-2">
            <h3 className="font-serif text-4xl mb-6">Pronto para o<br/><span className="text-gold-500 italic">Próximo Nível?</span></h3>
            <p className="text-white/40 max-w-sm mb-8 font-light text-sm">Seu patrimônio não pode ficar à mercê do mercado. Solicite uma auditoria jurídica gratuita.</p>
            <Magnetic><a href="https://wa.me/5527998118489" target="_blank" rel="noreferrer" className="inline-block bg-white text-black px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold-500 transition-all">Contato Imediato</a></Magnetic>
         </div>
         <div>
            <h4 className="text-gold-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-6">Expertise</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">Direito Corporativo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Assessoria Tributária</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Holding e Offshores</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contencioso Estratégico</a></li>
            </ul>
         </div>
         <div>
            <h4 className="text-gold-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-6">Conexão</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="https://www.instagram.com/lucianogagnoadvogado/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
              <li>Av. Corporate High, 1000 - Vitória/ES</li>
            </ul>
         </div>
       </div>
       <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-[10px] text-white/30 tracking-widest uppercase">
          <p>© {new Date().getFullYear()} Luciano Gagno Advocacia</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-white transition-colors">Termos</a>
             <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          </div>
       </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <Noise />
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <AnimatedNameFinal />
        <BentoGrid />
        <HorizontalScroll />
        <About />
      </main>
      <Footer />
    </div>
  );
}
