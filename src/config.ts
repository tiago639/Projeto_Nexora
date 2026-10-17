// Personalize os dados da marca e os canais de contato neste único lugar.
export const agency: {
  name: string;
  siteUrl: string;
  description: string;
  socialImage: string;
  descriptor: string;
  whatsapp: string;
  email: string;
  instagram: string;
  linkedin: string;
  founders: Array<{ name: string; role: string; description: string; initials: string }>;
} = {
  name: 'NEXORA',
  siteUrl: '', // URL pública definitiva, sem barra no final.
  description: 'Estúdio digital independente que conecta tecnologia, processos e marketing para criar crescimento com intenção.',
  socialImage: '', // URL absoluta de imagem social 1200×630, quando disponível.
  descriptor: 'Digital, com direção.',
  whatsapp: '5521977140933', // WhatsApp principal: Tiago. Somente dígitos, com código do país.
  email: '',
  instagram: '',
  linkedin: '',
  founders: [
    { name: 'Tiago', role: 'CEO · Estratégia & tecnologia', description: 'À frente da visão estratégica e do desenvolvimento de soluções digitais, conectando tecnologia às necessidades reais de cada negócio.', initials: 'T' },
    { name: 'Ana Lívia', role: 'SEO · Crescimento orgânico', description: 'Responsável pelas estratégias de posicionamento orgânico e crescimento digital, ajudando marcas a conquistar mais visibilidade e oportunidades.', initials: 'AL' },
  ],
};

export const contactHref = agency.whatsapp
  ? `https://wa.me/${agency.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Quero conversar sobre um projeto.')}`
  : agency.email ? `mailto:${agency.email}?subject=${encodeURIComponent('Vamos conversar sobre um projeto')}` : '#canais';
