import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { agency } from './config';
import { KineticCanvas } from './KineticCanvas';
import TiagoPortrait from './assets/founders/founder_tiago_portrait_1792245879940.jpg';
import AnaPortrait from './assets/founders/founder_analivia_portrait_1792245881004.jpg';
import './styles.css';
import './motion.css';
import './theme-black.css';
import './services-layout.css';
import './navigation.css';
import './privacy-tools.css';

const services = [
  { n: '01', title: 'Desenvolvimento\nweb', copy: 'Plataformas, sites e experiências digitais desenhadas para transformar intenção em ação.', benefit: 'Presença que trabalha pelo negócio.', kind: 'browser' },
  { n: '02', title: 'Automação de\nprocessos', copy: 'Conectamos ferramentas e eliminamos tarefas repetitivas para devolver tempo ao que importa.', benefit: 'Menos atrito. Mais espaço para crescer.', kind: 'flow' },
  { n: '03', title: 'Análise de\ndados', copy: 'Dashboards e indicadores claros para transformar dados dispersos em decisões melhores.', benefit: 'Clareza para decidir com confiança.', kind: 'chart' },
  { n: '04', title: 'Conteúdo &\nInstagram', copy: 'Estratégia, conteúdo e direção visual para marcas que querem conversar com intenção.', benefit: 'Uma marca reconhecível, em cada ponto de contato.', kind: 'social' },
  { n: '05', title: 'Tráfego\npago', copy: 'Campanhas bem estruturadas para aproximar a sua oferta das pessoas certas.', benefit: 'Investimento conectado a objetivos reais.', kind: 'target' },
  { n: '06', title: 'SEO & crescimento\norgânico', copy: 'Estratégia de busca e conteúdo para a sua marca ser encontrada quando importa.', benefit: 'Visibilidade que se constrói no tempo.', kind: 'search' },
];
const whatsappContacts = [
  { name: 'Tiago', number: '5521977140933' },
  { name: 'Ana Lívia', number: '5521974516415' },
];
const whatsappMessage = (name: string) => encodeURIComponent(`Olá, ${name}! Quero conversar sobre um projeto.`);
const steps = [
  ['01', 'Descoberta', 'Entendemos o negócio, os objetivos e os problemas que merecem atenção.'],
  ['02', 'Estratégia', 'Definimos prioridades e o melhor caminho para chegar onde importa.'],
  ['03', 'Execução', 'Desenvolvemos, implementamos e colocamos as soluções em prática.'],
  ['04', 'Evolução', 'Analisamos o cenário e identificamos oportunidades de melhoria.'],
] as const;
const projects = [
  { type: 'EXPERIMENTO DIGITAL · CONCEITO', name: 'Ritmo de marca', desc: 'Uma experiência editorial para uma marca cultural fictícia.', tag: 'Web design', shape: 'project-type' },
  { type: 'INTELIGÊNCIA · CONCEITO', name: 'Sinais de negócio', desc: 'Um painel conceitual para dar contexto aos dados do dia a dia.', tag: 'Data experience', shape: 'project-data' },
  { type: 'ECOSSISTEMA · CONCEITO', name: 'Fluxo em movimento', desc: 'Uma visão de como tecnologia e conteúdo podem trabalhar juntos.', tag: 'Estratégia digital', shape: 'project-flow' },
];
const founders = [
  { ...agency.founders[0], image: TiagoPortrait },
  { ...agency.founders[1], image: AnaPortrait },
];

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('is-visible'); observer.disconnect(); }
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal-pending ${className}`}>{children}</div>;
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>;
}

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}

function applySeoMetadata() {
  const title = `${agency.name}® — Tecnologia com direção`;
  document.title = title;
  const setMeta = (key: string, value: string, property = false) => {
    let tag = document.head.querySelector<HTMLMetaElement>(`meta[${property ? 'property' : 'name'}="${key}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute(property ? 'property' : 'name', key); document.head.append(tag); }
    tag.content = value;
  };
  setMeta('description', agency.description);
  setMeta('robots', 'index, follow, max-image-preview:large');
  setMeta('og:type', 'website', true);
  setMeta('og:locale', 'pt_BR', true);
  setMeta('og:site_name', agency.name, true);
  setMeta('og:title', title, true);
  setMeta('og:description', agency.description, true);
  setMeta('twitter:card', agency.socialImage ? 'summary_large_image' : 'summary');
  setMeta('twitter:title', title);
  setMeta('twitter:description', agency.description);
  if (agency.socialImage) { setMeta('og:image', agency.socialImage, true); setMeta('twitter:image', agency.socialImage); }
  if (agency.siteUrl.trim()) {
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
    canonical.href = `${agency.siteUrl.replace(/\/+$/, '')}/`;
    setMeta('og:url', canonical.href, true);
  }
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org', '@type': 'Organization', name: agency.name, description: agency.description,
    founder: agency.founders.map(person => ({ '@type': 'Person', name: person.name, jobTitle: person.role, description: person.description })),
    knowsAbout: ['Desenvolvimento web', 'Automação de processos', 'Análise de dados', 'Marketing digital', 'Tráfego pago', 'SEO'],
  };
  if (agency.siteUrl.trim()) schema.url = `${agency.siteUrl.replace(/\/+$/, '')}/`;
  const sameAs = [agency.instagram, agency.linkedin].filter(Boolean);
  if (sameAs.length) schema.sameAs = sameAs;
  if (agency.email || agency.whatsapp) schema.contactPoint = [{ '@type': 'ContactPoint', contactType: 'business inquiries', ...(agency.email ? { email: agency.email } : {}), ...(agency.whatsapp ? { telephone: `+${agency.whatsapp.replace(/\D/g, '')}` } : {}) }];
  let ld = document.getElementById('agency-schema');
  if (!ld) { ld = document.createElement('script'); ld.id = 'agency-schema'; ld.setAttribute('type', 'application/ld+json'); document.head.append(ld); }
  ld.textContent = JSON.stringify(schema);
}

function Header() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const menuButton = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);
  useEffect(() => {
    const scrollToAnchor = (hash: string, updateHistory = false) => {
      const id = decodeURIComponent(hash.replace(/^#/, ''));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      const isSection = target.tagName.toLowerCase() === 'section';
      const section = isSection ? target : target.closest('section');
      const visibleStart = isSection
        ? target.querySelector<HTMLElement>('.section-kicker, .hero-meta, .hero-copy') ?? target
        : target;
      const headerHeight = document.querySelector<HTMLElement>('.header')?.getBoundingClientRect().height ?? 0;
      const top = visibleStart.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      if (updateHistory) window.history.pushState(null, '', `#${id}`);
      window.scrollTo({ top: Math.max(0, top), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      if (section) setActiveSection(section.id);
    };
    const onDocumentClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = link.getAttribute('href');
      if (!hash || !document.getElementById(decodeURIComponent(hash.slice(1)))) return;
      event.preventDefault();
      close();
      scrollToAnchor(hash, true);
    };
    const onPopState = () => { if (window.location.hash) scrollToAnchor(window.location.hash); };
    document.addEventListener('click', onDocumentClick);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onDocumentClick);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);
  useEffect(() => {
    const sectionIds = ['inicio', 'solucoes', 'metodo', 'projetos', 'equipe', 'contato'];
    const sections = sectionIds.map(id => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.15, 0.35, 0.6] });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);
  const navLink = (id: string, label: string) => <a href={`#${id}`} onClick={close} aria-current={activeSection === id ? 'location' : undefined}>{label}</a>;
  return <header className="header">
    <a className="wordmark" href="#inicio" onClick={close}>{agency.name}<sup>®</sup></a>
    <button ref={menuButton} type="button" className="menu-toggle" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}><span /><span /></button>
    <nav id="primary-navigation" className={open ? 'nav nav-open' : 'nav'} aria-label="Navegação principal">
      {navLink('solucoes', 'Soluções')}{navLink('metodo', 'Método')}{navLink('projetos', 'Projetos')}{navLink('equipe', 'Equipe')}
      <a className="nav-contact" href="#contato" onClick={close} aria-current={activeSection === 'contato' ? 'location' : undefined}>Vamos conversar <Arrow diagonal /></a>
    </nav>
  </header>;
}

function VisualMark() {
  return <div className="hero-art" role="img" aria-label="Visualização abstrata de conexões e dados">
    <div className="art-coordinate">NXR—01&nbsp;&nbsp; TECNOLOGIA + IDEIAS</div><div className="art-ring ring-a" /><div className="art-ring ring-b" />
    <div className="art-core"><span className="core-dot" /><span>IDEIA</span><i /><span>SISTEMA</span></div>
    <div className="art-node node-a">01 <b>TECH</b></div><div className="art-node node-b">02 <b>DATA</b></div><div className="art-node node-c">03 <b>GROWTH</b></div>
    <div className="art-axis axis-x" /><div className="art-axis axis-y" /><div className="art-caption">ESTRATÉGIA EM MOVIMENTO <span>●</span></div>
  </div>;
}

function ServiceArt({ kind }: { kind: string }) {
  return <div className={`service-art art-${kind}`} aria-hidden="true">
    {kind === 'browser' ? <><div className="browser-top"><i /><i /><i /><span>nexora.studio</span></div><div className="browser-lines"><b /><b /><i /><i /><em /></div></> :
      kind === 'flow' ? <><i className="flow-node" /><i className="flow-node" /><i className="flow-node" /><b /><b /></> :
        kind === 'chart' ? <><span className="chart-label">VISÃO GERAL</span><i /><i /><i /><i /><b>↗</b></> :
          kind === 'social' ? <><i className="social-shape" /><i className="social-shape" /><span>✳</span></> :
            kind === 'target' ? <><i /><i /><i /><b>↗</b></> : <><span>↗</span><b>BUSCA</b><i /><i /></>}
  </div>;
}

function AgencyMarquee({ reverse = false }: { reverse?: boolean }) {
  const labels = ['DESENVOLVIMENTO WEB', 'AUTOMAÇÃO DE PROCESSOS', 'ANÁLISE DE DADOS', 'MARKETING DIGITAL', 'TRÁFEGO PAGO', 'SEO & CRESCIMENTO ORGÂNICO'];
  return <div className="agency-marquee" aria-hidden="true"><div className={reverse ? 'marquee-track marquee-reverse' : 'marquee-track'}>
    {[...labels, ...labels].map((label, i) => <span className="marquee-item" key={`${label}-${i}`}><i>✳</i>{label}</span>)}
  </div></div>;
}

function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(-100); const y = useMotionValue(-100);
  const smoothX = useSpring(x, { damping: 25, stiffness: 250, mass: 0.5 });
  const smoothY = useSpring(y, { damping: 25, stiffness: 250, mass: 0.5 });
  useEffect(() => {
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
    const move = (event: PointerEvent) => { x.set(event.clientX); y.set(event.clientY); setVisible(true); };
    const over = (event: PointerEvent) => setHovered(Boolean((event.target as HTMLElement | null)?.closest('a,button,[role="button"]')));
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move); window.addEventListener('pointerover', over); document.addEventListener('pointerleave', leave);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over); document.removeEventListener('pointerleave', leave); };
  }, [reduceMotion, x, y]);
  if (!visible || reduceMotion) return null;
  return <div className="cursor-layer" aria-hidden="true">
    <motion.span className={`cursor-ring${hovered ? ' cursor-ring-hover' : ''}`} style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }} />
    <motion.span className="cursor-point" style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: hovered ? 0.3 : 1 }} />
  </div>;
}

type PrivacyChoice = { necessary: true; analytics: boolean; marketing: boolean; savedAt: string };
const privacyChoiceKey = 'nexora-privacy-choice-v1';

function CookieConsent() {
  const [choice, setChoice] = useState<PrivacyChoice | null>(() => {
    try {
      const saved = localStorage.getItem(privacyChoiceKey);
      return saved ? JSON.parse(saved) as PrivacyChoice : null;
    } catch { return null; }
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const settingsCloseButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const openSettings = () => {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setAnalytics(choice?.analytics ?? false);
    setMarketing(choice?.marketing ?? false);
    setSettingsOpen(true);
  };
  const closeSettings = () => {
    setSettingsOpen(false);
    window.setTimeout(() => {
      const focusTarget = previousFocus.current?.isConnected ? previousFocus.current : document.querySelector<HTMLElement>('.cookie-settings-link, .privacy-settings-trigger');
      focusTarget?.focus();
    }, 0);
  };

  const save = (allowAnalytics: boolean, allowMarketing = allowAnalytics) => {
    const next: PrivacyChoice = { necessary: true, analytics: allowAnalytics, marketing: allowMarketing, savedAt: new Date().toISOString() };
    try { localStorage.setItem(privacyChoiceKey, JSON.stringify(next)); } catch { /* The site remains usable when storage is unavailable. */ }
    setChoice(next);
    setSettingsOpen(false);
    window.dispatchEvent(new CustomEvent('nexora:consent-change', { detail: next }));
    window.setTimeout(() => {
      const focusTarget = previousFocus.current?.isConnected ? previousFocus.current : document.querySelector<HTMLElement>('.cookie-settings-link, .privacy-settings-trigger');
      focusTarget?.focus();
    }, 0);
  };

  useEffect(() => {
    window.addEventListener('nexora:open-cookie-settings', openSettings);
    return () => window.removeEventListener('nexora:open-cookie-settings', openSettings);
  }, [choice]);

  useEffect(() => {
    if (!settingsOpen) return;
    settingsCloseButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeSettings(); }
      if (event.key === 'Tab') {
        const controls = Array.from(document.querySelectorAll<HTMLElement>('.cookie-dialog button, .cookie-dialog input, .cookie-dialog a'));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [settingsOpen]);

  const showBanner = !choice && !settingsOpen;
  if (!showBanner && !settingsOpen) return null;
  return <>
    {showBanner && <aside className="cookie-banner" aria-label="Preferências de privacidade">
      <div className="cookie-copy"><span className="cookie-kicker">SUA PRIVACIDADE</span><p>Usamos armazenamento local essencial para lembrar sua escolha. Não ativamos ferramentas de análise ou publicidade neste site. <a href="/privacidade.html">Leia a política de privacidade</a>.</p></div>
      <div className="cookie-actions"><button type="button" className="cookie-button cookie-secondary" onClick={() => save(false)}>Somente necessários</button><button type="button" className="cookie-button cookie-primary" onClick={() => save(true)}>Aceitar todos</button><button type="button" className="cookie-settings-link" onClick={openSettings}>Preferências</button></div>
    </aside>}
    {settingsOpen && <div className="cookie-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeSettings(); }}>
      <section className="cookie-dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-dialog-title" aria-describedby="cookie-dialog-description">
        <div className="cookie-dialog-heading"><div><span className="cookie-kicker">CONTROLE DE PRIVACIDADE</span><h2 id="cookie-dialog-title">Suas preferências</h2></div><button ref={settingsCloseButton} type="button" className="cookie-close" aria-label="Fechar preferências de cookies" onClick={closeSettings}>×</button></div><p id="cookie-dialog-description">As opções abaixo serão salvas neste navegador. Hoje, o site não carrega ferramentas de análise ou publicidade; se isso mudar, elas só poderão ser ativadas conforme sua escolha.</p>
        <div className="cookie-category"><div><strong>Necessários</strong><p>Armazenam sua escolha de privacidade e permitem o funcionamento básico do site.</p></div><span className="cookie-always">Sempre ativos</span></div>
        <label className="cookie-category cookie-toggle"><span><strong>Análise</strong><small>Permite métricas de navegação, caso sejam adicionadas futuramente.</small></span><input type="checkbox" checked={analytics} onChange={event => setAnalytics(event.target.checked)} /></label>
        <label className="cookie-category cookie-toggle"><span><strong>Publicidade</strong><small>Permite tecnologias de publicidade, caso sejam adicionadas futuramente.</small></span><input type="checkbox" checked={marketing} onChange={event => setMarketing(event.target.checked)} /></label>
        <div className="cookie-dialog-actions"><button type="button" className="cookie-button cookie-secondary" onClick={() => save(false, false)}>Somente necessários</button><button type="button" className="cookie-button cookie-primary" onClick={() => save(analytics, marketing)}>Salvar preferências</button></div>
        <a className="cookie-policy-link" href="/privacidade.html">Consultar política de privacidade</a>
      </section>
    </div>}
  </>;
}

function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  return <div className={`whatsapp-float${open ? ' whatsapp-open' : ''}`}>
    {open && <div className="whatsapp-panel" id="whatsapp-options" aria-label="Escolha com quem falar pelo WhatsApp">
      <div className="whatsapp-panel-heading"><strong>Fale com a Nexora</strong><span>Escolha um contato</span></div>
      {whatsappContacts.map(contact => <a key={contact.number} href={`https://wa.me/${contact.number}?text=${whatsappMessage(contact.name)}`} target="_blank" rel="noopener noreferrer" aria-label={`Conversar com ${contact.name} pelo WhatsApp`}>{contact.name}<span>+55 21 {contact.number.slice(4, 9)}-{contact.number.slice(9)}</span></a>)}
    </div>}
    <button type="button" className="whatsapp-trigger" aria-label={open ? 'Fechar contatos do WhatsApp' : 'Abrir contatos do WhatsApp'} aria-expanded={open} aria-controls="whatsapp-options" onClick={() => setOpen(!open)}>
      <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.2A12.6 12.6 0 0 0 5.2 22.3L3.5 28.5l6.4-1.7A12.7 12.7 0 1 0 16 3.2Zm0 22.9a10.2 10.2 0 0 1-5.2-1.4l-.4-.2-3.8 1 1-3.7-.3-.4A10.2 10.2 0 1 1 16 26.1Zm5.6-7.7c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.5 4.8.8.3 1.4.5 1.9.6.8.2 1.6.2 2.2.1.7-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.5Z" /></svg>
      <span>WhatsApp</span>
    </button>
  </div>;
}

function App() {
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [activePillar, setActivePillar] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [visibleServices, setVisibleServices] = useState(3);
  const [servicesAutoplayEnabled, setServicesAutoplayEnabled] = useState(!reduceMotion);
  const [servicesHovered, setServicesHovered] = useState(false);
  const [serviceInteractionPaused, setServiceInteractionPaused] = useState(false);
  const servicesTrack = useRef<HTMLDivElement>(null);
  const serviceDrag = useRef<{ pointerId: number; startX: number; startScroll: number; moved: boolean } | null>(null);
  const suppressServiceClick = useRef(false);
  const servicePauseTimer = useRef<number | null>(null);
  useEffect(() => { document.documentElement.classList.add('js-enabled'); applySeoMetadata(); }, []);
  useEffect(() => {
    const track = servicesTrack.current;
    if (!track) return;
    const update = () => {
      const firstCard = track.querySelector<HTMLElement>('.service');
      if (!firstCard) return;
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      const step = firstCard.getBoundingClientRect().width + gap;
      if (step > 0) setActiveService(Math.max(0, Math.min(services.length - 1, Math.round(track.scrollLeft / step))));
      setVisibleServices(Math.max(1, Math.round(track.clientWidth / firstCard.getBoundingClientRect().width)));
    };
    track.addEventListener('scroll', update, { passive: true });
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(track);
    update();
    return () => { track.removeEventListener('scroll', update); resizeObserver.disconnect(); };
  }, []);
  useEffect(() => {
    if (!servicesAutoplayEnabled || reduceMotion || servicesHovered || serviceInteractionPaused) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const track = servicesTrack.current;
      const firstCard = track?.querySelector<HTMLElement>('.service');
      if (!track || !firstCard) return;
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      const step = firstCard.getBoundingClientRect().width + gap;
      const current = Math.round(track.scrollLeft / step);
      const lastStart = Math.max(0, services.length - visibleServices);
      if (current >= lastStart) track.scrollTo({ left: 0, behavior: 'smooth' });
      else track.scrollBy({ left: step, behavior: 'smooth' });
    }, 4800);
    return () => window.clearInterval(timer);
  }, [servicesAutoplayEnabled, reduceMotion, servicesHovered, serviceInteractionPaused, visibleServices]);
  useEffect(() => () => { if (servicePauseTimer.current !== null) window.clearTimeout(servicePauseTimer.current); }, []);
  const pauseServicesForInteraction = () => {
    setServiceInteractionPaused(true);
    if (servicePauseTimer.current !== null) window.clearTimeout(servicePauseTimer.current);
    servicePauseTimer.current = window.setTimeout(() => setServiceInteractionPaused(false), 7000);
  };
  const moveServices = (direction: -1 | 1) => {
    const track = servicesTrack.current;
    const firstCard = track?.querySelector<HTMLElement>('.service');
    if (!track || !firstCard) return;
    pauseServicesForInteraction();
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (firstCard.getBoundingClientRect().width + gap), behavior: reduceMotion ? 'instant' : 'smooth' });
  };
  const startServiceDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') pauseServicesForInteraction();
    if (event.pointerType !== 'mouse' || event.button !== 0 || (event.target as HTMLElement).closest('a,button')) return;
    serviceDrag.current = { pointerId: event.pointerId, startX: event.clientX, startScroll: event.currentTarget.scrollLeft, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveServiceDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = serviceDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 5) drag.moved = true;
    if (drag.moved) {
      event.preventDefault();
      event.currentTarget.scrollLeft = drag.startScroll - delta;
    }
  };
  const endServiceDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = serviceDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.moved) {
      suppressServiceClick.current = true;
      window.setTimeout(() => { suppressServiceClick.current = false; }, 0);
    }
    serviceDrag.current = null;
  };
  const preventDraggedServiceClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressServiceClick.current) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return <>
    <ScrollProgress /><CustomCursor /><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header />
    <main id="conteudo">
      <section className="hero section-wrap" id="inicio">
        <KineticCanvas />
        <div className="hero-meta"><span><i className="live-dot" /> ESTÚDIO DIGITAL INDEPENDENTE</span><span>BRASIL · TRABALHO SEM FRONTEIRAS</span></div>
        <div className="hero-grid">
          <div className="hero-copy"><motion.p className="eyebrow hero-eyebrow" initial={reduceMotion ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>TECNOLOGIA COM DIREÇÃO <span>— NXR / 01</span></motion.p>
            <h1>
              <span>{['Tecnologia', 'que', 'transforma.'].map((word, i) => <motion.span className="hero-word" key={word} initial={reduceMotion ? false : { y: '115%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.12 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}>{word}{i < 2 ? ' ' : ''}</motion.span>)}</span>
              <span className="accent-line">{['Estratégia', 'que'].map((word, i) => <motion.span className="hero-word" key={word} initial={reduceMotion ? false : { y: '115%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.38 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}>{word} </motion.span>)}<motion.span className="hero-word" initial={reduceMotion ? false : { y: '115%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.58, ease: [0.16, 1, 0.3, 1] }}>movimenta<motion.i className="hero-underline" initial={reduceMotion ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.88 }} /></motion.span><span className="period">.</span></span>
            </h1>
            <div className="hero-bottom"><p>Desenvolvemos experiências digitais, automatizamos processos e criamos estratégias de crescimento para empresas que querem evoluir de verdade.</p>
              <div className="hero-actions"><motion.a whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} className="button button-primary" href="#contato">Vamos conversar <Arrow diagonal /></motion.a><motion.a whileHover={reduceMotion ? undefined : { x: 4 }} className="text-link" href="#solucoes">Explorar soluções <Arrow /></motion.a></div>
            </div>
          </div><VisualMark />
        </div>
        <div className="hero-foot"><span>ESTRATÉGIA · SISTEMAS · CRESCIMENTO</span><a href="#manifesto">DESLIZE PARA EXPLORAR <span className="scroll-mark">↓</span></a><span>01 — 06</span></div>
      </section>
      <AgencyMarquee />

      <section className="manifesto section-wrap" id="manifesto"><Reveal><div className="section-kicker"><span>01 / PONTO DE VISTA</span><span>O QUE NOS MOVE</span></div>
        <div className="manifesto-grid"><h2>Não entregamos<br />apenas serviços.<br /><em>Criamos sistemas</em><br /><em>para evoluir.</em></h2><div className="manifesto-aside"><div className="orbit-mark"><span>TECNOLOGIA</span><span>PROCESSOS</span><span>MARKETING</span><b>+</b></div><p>Quando tecnologia, processos e comunicação trabalham na mesma direção, o crescimento deixa de ser uma aposta isolada.</p><p className="small-note">UM ECOSSISTEMA. MAIS POSSIBILIDADES.</p></div></div>
        <div className="manifesto-bottom"><span className="lime-square" /><p>Construímos as conexões que ajudam empresas a trabalhar com mais clareza, presença e intenção.</p><span>BRASIL · REMOTO</span></div>
      </Reveal></section>

      <section className="services section-wrap" id="solucoes"><Reveal><div className="section-kicker"><span>02 / O QUE FAZEMOS</span><span>ESTRATÉGIA COM CAPACIDADE DE EXECUÇÃO</span></div><div className="services-heading"><h2>Soluções para<br /><em>o que vem depois.</em></h2><p>Um conjunto integrado de competências, acionado de acordo com o que o seu negócio precisa agora.</p></div>
        <div className="services-carousel" aria-roledescription="carrossel">
          <div className="services-grid" ref={servicesTrack} role="region" aria-label="Carrossel de soluções" tabIndex={0} onMouseEnter={() => setServicesHovered(true)} onMouseLeave={() => setServicesHovered(false)} onFocusCapture={() => setServicesHovered(true)} onBlurCapture={event => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setServicesHovered(false); }} onWheel={pauseServicesForInteraction} onPointerDown={startServiceDrag} onPointerMove={moveServiceDrag} onPointerUp={endServiceDrag} onPointerCancel={endServiceDrag} onClickCapture={preventDraggedServiceClick}>{services.map((s, i) => <motion.article className={`service service-${i + 1}`} key={s.n} role="group" aria-roledescription="slide" aria-label={`${s.n} de 06: ${s.title.replace('\n', ' ')}`} initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55, delay: reduceMotion ? 0 : i * 0.07 }} whileHover={reduceMotion ? undefined : { y: -5 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
          <div className="service-top"><span>{s.n} / 06</span><span className="service-cross">✳</span></div><ServiceArt kind={s.kind} /><h3>{s.title.split('\n').map((line, j) => <React.Fragment key={line}>{j > 0 && <br />}{line}</React.Fragment>)}</h3><p>{s.copy}</p><span className="service-benefit">{s.benefit}</span><a href="#contato" className="service-link" aria-label={`Conversar sobre ${s.title.replace('\n', ' ')}`}>Conversar sobre isso <Arrow diagonal /></a>
          </motion.article>)}</div>
          <div className="service-footer"><span>SEIS DISCIPLINAS. UM OLHAR INTEGRADO.</span><div className="service-footer-actions"><a href="#contato">Conte o que você precisa <Arrow /></a><div className="service-carousel-controls" role="group" aria-label="Controles do carrossel de soluções"><span aria-live={servicesAutoplayEnabled && !servicesHovered && !serviceInteractionPaused ? 'off' : 'polite'}>{String(activeService + 1).padStart(2, '0')}—{String(Math.min(activeService + visibleServices, services.length)).padStart(2, '0')} / 06</span><button type="button" className="service-autoplay-toggle" aria-label={reduceMotion ? 'Animação automática desativada por preferência de movimento reduzido' : servicesAutoplayEnabled ? 'Pausar animação automática' : 'Reproduzir animação automática'} aria-pressed={!servicesAutoplayEnabled} disabled={Boolean(reduceMotion)} onClick={() => { setServicesAutoplayEnabled(!servicesAutoplayEnabled); pauseServicesForInteraction(); }}>{servicesAutoplayEnabled ? 'Ⅱ' : '▶'}</button><button type="button" aria-label="Ver soluções anteriores" disabled={activeService === 0} onClick={() => moveServices(-1)}>←</button><button type="button" aria-label="Ver próximas soluções" disabled={activeService + visibleServices >= services.length} onClick={() => moveServices(1)}>→</button></div></div></div>
        </div>
      </Reveal></section>
      <AgencyMarquee reverse />

      <section className="difference section-wrap"><Reveal><div className="section-kicker"><span>03 / COMO PENSAMOS</span><span>MENOS RUÍDO. MAIS DIREÇÃO.</span></div><div className="difference-heading"><h2>Menos tarefas manuais.<br /><em>Mais clareza. Mais possibilidades.</em></h2><p>Não acreditamos em tecnologia por tecnologia. Cada escolha precisa abrir espaço para uma decisão melhor, uma rotina mais simples ou um próximo passo mais claro.</p></div>
        <div className="pillar-track"><div className="track-line"><i /></div>{[
          ['A / 01', 'Tecnologia\ninteligente', 'Soluções digitais construídas para necessidades reais, sem complexidade desnecessária.', '✳'],
          ['B / 02', 'Estratégia\norientada por dados', 'Indicadores relevantes para entender o contexto e escolher com mais segurança.', '▥'],
          ['C / 03', 'Crescimento\nconectado', 'Tecnologia e marketing trabalhando juntos, do primeiro contato à evolução.', '↗'],
        ].map(([n, title, copy, symbol], i) => <motion.button type="button" key={n} className={`pillar${activePillar === i ? ' pillar-active' : ''}`} aria-pressed={activePillar === i} onClick={() => setActivePillar(i)} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay: reduceMotion ? 0 : i * 0.12 }} whileHover={reduceMotion ? undefined : { y: -4 }}>
          <span className="pillar-index">{n}</span><span className={`pillar-symbol symbol-${i}`}>{symbol}</span><span className="pillar-title">{title.split('\n').map((line, j) => <React.Fragment key={line}>{j > 0 && <br />}{line}</React.Fragment>)}</span><span className="pillar-copy">{copy}</span>
        </motion.button>)}</div>
      </Reveal></section>

      <section className="method section-wrap" id="metodo"><Reveal><div className="section-kicker"><span>04 / NOSSO MÉTODO</span><span>DO PRIMEIRO PAPO À PRÓXIMA FASE</span></div><div className="method-head"><h2>Clareza no processo.<br /><em>Intenção em cada etapa.</em></h2><p>Um percurso colaborativo, com espaço para entender, construir e aprender em movimento.</p></div>
        <div className="timeline" role="group" aria-label="Etapas do método de trabalho">{steps.map(([n, title], i) => <motion.button type="button" className={`step${activeStep === i ? ' step-active' : ''}`} key={n} aria-pressed={activeStep === i} onClick={() => setActiveStep(i)} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
          <div className="step-marker"><span>{n}</span><i /></div><span className="step-title">{title}</span><span className="step-summary">{steps[i][2]}</span>
        </motion.button>)}</div>
        <AnimatePresence mode="wait" initial={false}><motion.div className="step-detail" key={activeStep} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: reduceMotion ? 0 : 0.3 }} aria-live="polite"><span>ETAPA {steps[activeStep][0]} / 04</span><p>{steps[activeStep][2]}</p></motion.div></AnimatePresence>
        <div className="method-note"><span>01 → 04</span><span>O MELHOR TRABALHO COMEÇA COM AS PERGUNTAS CERTAS.</span></div>
      </Reveal></section>

      <section className="projects section-wrap" id="projetos"><Reveal><div className="section-kicker"><span>05 / CAMPO DE EXPERIMENTAÇÃO</span><span>ESTUDOS CONCEITUAIS</span></div><div className="projects-head"><h2>Ideias que<br /><em>ganham forma.</em></h2><p>Um recorte de experiências e direções visuais. Os estudos abaixo são demonstrações conceituais, não trabalhos de clientes.</p></div>
        <div className="project-grid">{projects.map((p, i) => <motion.article className={`project project-${i + 1}`} key={p.name} initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, delay: reduceMotion ? 0 : i * 0.12 }} whileHover={reduceMotion ? undefined : { y: -4 }}>
          <div className={`project-visual ${p.shape}`}><div className="project-visual-top"><span>{agency.name} / STUDY 0{i + 1}</span><span>↗</span></div>
            {i === 0 ? <div className="type-composition"><small>MATÉRIA EM MOVIMENTO</small><b>ritmo<span>.</span></b><i>cultura · pessoas · cidade</i><div className="type-orb" /></div> : i === 1 ? <div className="data-composition"><span>VISÃO DE NEGÓCIO</span><strong>Visão<br />em contexto<span>.</span></strong><div className="data-bars">{[28, 44, 35, 61, 51, 77, 63, 93, 72, 100, 86, 96].map((h, k) => <i key={k} style={{ height: `${h}%` }} />)}</div><div className="data-foot"><span>INDICADORES</span><span>+ sinais conectados</span></div></div> : <div className="flow-composition"><div className="flow-word">IDEIA <i>→</i> SISTEMA</div><div className="flow-shapes"><b /><b /><b /></div><div className="flow-label">CONEXÕES QUE MOVEM</div></div>}
          </div><div className="project-info"><span>{p.type}</span><h3>{p.name}</h3><p>{p.desc}</p><span className="project-tag">{p.tag} <Arrow diagonal /></span></div>
        </motion.article>)}</div>
      </Reveal></section>

      <section className="people section-wrap" id="equipe"><Reveal><div className="section-kicker"><span>06 / QUEM ESTÁ POR TRÁS</span><span>DUAS PERSPECTIVAS. UMA DIREÇÃO.</span></div><div className="people-head"><h2>Estratégia e tecnologia,<br /><em>com gente de verdade.</em></h2><p>A Nexora nasceu da vontade de aproximar o que as empresas querem construir das ferramentas que tornam isso possível.</p></div>
        <div className="founders">{founders.map((f, i) => <motion.article className={`founder founder-${i + 1}`} key={f.name} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, delay: reduceMotion ? 0 : i * 0.14 }} whileHover={reduceMotion ? undefined : { y: -5 }}>
          <div className="founder-image"><img src={f.image} alt={`Retrato de ${f.name}, ${f.role}`} loading="lazy" decoding="async" /><div className="founder-image-note">NEXORA / FOUNDERS</div><span className="founder-number">0{i + 1}</span></div>
          <div className="founder-info"><span className="founder-role">{f.role}</span><h3>{f.name}<sup>0{i + 1}</sup></h3><p>{f.description}</p><span className="founder-index">NEXORA® — FUNDADORES</span></div>
        </motion.article>)}</div>
      </Reveal></section>

      <section className="contact section-wrap" id="contato"><Reveal><div className="contact-top"><span>UM BOM PROJETO COMEÇA COM UMA PERGUNTA.</span><span>DISPONÍVEIS PARA NOVAS CONVERSAS <i className="live-dot" /></span></div><div className="contact-main"><h2>Seu próximo passo<br />começa com uma<br /><em>boa conversa.</em></h2><div className="contact-side"><p>Conte o que você quer construir, melhorar ou automatizar. Vamos encontrar a melhor maneira de transformar essa ideia em uma solução.</p><div className="contact-whatsapp-options" aria-label="Contatos da Nexora pelo WhatsApp">{whatsappContacts.map(contact => <motion.a key={contact.number} whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} className="contact-whatsapp-link" href={`https://wa.me/${contact.number}?text=${whatsappMessage(contact.name)}`} target="_blank" rel="noopener noreferrer" aria-label={`Iniciar conversa com ${contact.name} no número +55 21 ${contact.number.slice(4, 9)}-${contact.number.slice(9)}`}><span><strong>Falar com {contact.name}</strong><small>+55 21 {contact.number.slice(4, 9)}-{contact.number.slice(9)}</small></span><Arrow diagonal /></motion.a>)}</div><span className="contact-direct" id="canais">{agency.email ? <>OU ESCREVA PARA <a href={`mailto:${agency.email}`}>{agency.email}</a></> : 'ESCOLHA UM CONTATO PELO WHATSAPP'}</span></div></div><div className="contact-bottom"><span>TECNOLOGIA COM INTENÇÃO. CRESCIMENTO COM DIREÇÃO.</span><span className="contact-star">✳</span></div>
      </Reveal></section>
    </main>
    <footer className="footer section-wrap"><div className="footer-top"><div><a className="footer-wordmark" href="#inicio">{agency.name}<sup>®</sup></a><p>Tecnologia com direção.<br />Crescimento com intenção.</p></div><div className="footer-nav"><div><span>EXPLORAR</span><a href="#solucoes">Soluções</a><a href="#projetos">Projetos</a><a href="#equipe">Equipe</a><a href="#contato">Contato</a><a href="/privacidade.html">Privacidade</a></div><div><span>ACOMPANHE</span>{agency.instagram && <a href={agency.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>}{agency.linkedin && <a href={agency.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}{!agency.instagram && !agency.linkedin && <small>Redes sociais em breve</small>}<button type="button" className="privacy-settings-trigger" onClick={() => window.dispatchEvent(new CustomEvent('nexora:open-cookie-settings'))}>Preferências de cookies</button></div></div><a href="#inicio" className="back-top" aria-label="Voltar ao início">↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {agency.name} DIGITAL STUDIO</span><span>FEITO COM CURIOSIDADE E INTENÇÃO <i>✳</i></span><a href="#inicio">VOLTAR AO TOPO ↑</a></div></footer>
    <CookieConsent /><WhatsAppFloat />
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
