# Projeto_Nexora

Site institucional da Nexora, criado com React, TypeScript e Vite. O projeto apresenta os serviços, o método de trabalho, estudos conceituais e os canais de contato da equipe.

## Desenvolvimento

```sh
npm install
npm run dev
```

## Build de produção

```sh
npm run build
npm run preview
```

## Configuração

Edite `src/config.ts` para configurar a URL pública, descrição para mecanismos de busca, imagem social, e-mail e redes sociais. Os contatos de WhatsApp de Tiago e Ana Lívia ficam no início de `src/main.tsx`.

O site inclui uma página de privacidade em `public/privacidade.html` e um painel de preferências de cookies. Antes da publicação, complete na política os dados empresariais e de hospedagem que ainda não foram informados.

Preencha `siteUrl` em `src/config.ts` para gerar os endereços canonical, Open Graph e sitemap no build.
