# Deploy — Landing TeloVis Pro

**Produção:** https://telovispro.com, publicada pela **Lovable** (DNS na Cloudflare: `@` e `www` em
registro A para `185.158.133.1`, o IP da Lovable, igual ao telovistech.com).

O repositório tem dois remotes com o mesmo conteúdo:

- `lovable` → `telovis-pro-canvas`, o repositório que a Lovable sincroniza
- `origin` → `telovis-barber-landing`

O fluxo é enviar para os dois e depois clicar em **Publicar → Update** na Lovable:

```bash
git push lovable main && git push origin main
```

Não reescreva histórico já enviado (force push, rebase, amend): a Lovable perde o histórico do projeto.

## Como a LP está montada

O projeto é o template TanStack Start da Lovable, e a LP continua sendo HTML + CSS + JS vanilla:

| O quê | Arquivo |
|---|---|
| Corpo da página (texto em PT) | `src/landing/page.html` |
| Títulos, meta tags, fontes e CSS da página | `src/routes/index.tsx` |
| Comportamento (idioma, segmentos, simulador, formulário → WhatsApp) | `src/landing/main.js` |
| Textos em EN/ES e os textos gerados pelo JS | `src/landing/i18n.js` |
| Estilos | `src/landing/landing.css` |
| Logo e ícones | `public/assets/`, `public/favicon.ico` |

O CSS do template (Tailwind, `src/styles.css`) só carrega nas telas de 404 e erro: na LP, o preflight
e as variáveis `:root` dele colidiriam com `landing.css`.

## Rodar local

```bash
npm install
npm run dev
npm run build && npm test
```

`npx vite preview` não roda essa build no Windows (a saída é para a Cloudflare); use `npm run dev`.

## VPS (kernellwc.online/vendas)

Era a hospedagem antiga, como site estático. **Desativada em 2026-10-17:** `kernellwc.online/vendas`
responde 404 (sem redirecionar). A pasta `/var/www/telovis-barber-landing` na VPS não é mais servida.
