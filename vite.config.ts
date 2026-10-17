import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { agency } from './src/config.ts';

const escapeHtml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const site = agency.siteUrl.trim().replace(/\/+$/, '');

const seoPlugin = {
  name: 'agency-seo-files',
  apply: 'build' as const,
  transformIndexHtml(html: string) {
    const title = `${agency.name}® — Tecnologia com direção`;
    const schema = {
      '@context': 'https://schema.org', '@type': 'Organization', name: agency.name,
      description: agency.description,
      ...(site ? { url: `${site}/` } : {}),
      founder: agency.founders.map(person => ({ '@type': 'Person', name: person.name, jobTitle: person.role, description: person.description })),
      knowsAbout: ['Desenvolvimento web', 'Automação de processos', 'Análise de dados', 'Marketing digital', 'Tráfego pago', 'SEO'],
      ...([agency.instagram, agency.linkedin].some(Boolean) ? { sameAs: [agency.instagram, agency.linkedin].filter(Boolean) } : {}),
      ...(agency.email || agency.whatsapp ? { contactPoint: [{ '@type': 'ContactPoint', contactType: 'business inquiries', ...(agency.email ? { email: agency.email } : {}), ...(agency.whatsapp ? { telephone: `+${agency.whatsapp.replace(/\D/g, '')}` } : {}) }] } : {}),
    };
    const canonical = site ? `<link rel="canonical" href="${escapeHtml(`${site}/`)}" />\n    <meta property="og:url" content="${escapeHtml(`${site}/`)}" />\n    <meta property="og:site_name" content="${escapeHtml(agency.name)}" />` : '';
    const imageTags = agency.socialImage ? `<meta property="og:image" content="${escapeHtml(agency.socialImage)}" />\n    <meta name="twitter:image" content="${escapeHtml(agency.socialImage)}" />` : '';
    const tags = `${imageTags}\n    ${canonical || `<meta property="og:site_name" content="${escapeHtml(agency.name)}" />`}\n    <script id="agency-schema" type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`;
    return html
      .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(agency.description)}" />`)
      .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeHtml(agency.description)}" />`)
      .replace(/<meta name="twitter:card"[^>]*>/, `<meta name="twitter:card" content="${agency.socialImage ? 'summary_large_image' : 'summary'}" />`)
      .replace('</head>', `    ${tags}\n  </head>`);
  },
  closeBundle() {
    const dist = resolve(process.cwd(), 'dist');
    const robots = ['User-agent: *', 'Allow: /', ...(site ? [`Sitemap: ${site}/sitemap.xml`] : [])].join('\n') + '\n';
    writeFileSync(resolve(dist, 'robots.txt'), robots, 'utf8');
    if (site) {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapeHtml(`${site}/`)}</loc></url></urlset>\n`;
      writeFileSync(resolve(dist, 'sitemap.xml'), xml, 'utf8');
    }
  },
};

export default defineConfig({ plugins: [react(), seoPlugin] });
