# Backlog de Melhorias — Landing Page Telovis Barber

Prioridades definidas por impacto em conversão e visibilidade. Stack atual: HTML + CSS custom + JS vanilla (3 arquivos).

---

## 🔴 Prioridade Alta — SEO e Compartilhamento

### B-01 — Open Graph completo
**Por quê:** Link compartilhado no WhatsApp/Instagram/LinkedIn sai sem preview. Perde credibilidade e cliques.

Adicionar no `<head>` do `index.html`:
```html
<meta property="og:type"        content="website" />
<meta property="og:title"       content="Telovis Barber — Sistema de Gestão para Barbearias" />
<meta property="og:description" content="Controle de caixa, relatórios, comissões e IA. Do barbeiro solo à rede de unidades." />
<meta property="og:url"         content="https://telovisbarber.seudominio.com.br" />
<meta property="og:image"       content="https://telovisbarber.seudominio.com.br/og-image.jpg" />
<meta property="og:locale"      content="pt_BR" />

<!-- Twitter/X Card -->
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="Telovis Barber — Sistema de Gestão para Barbearias" />
<meta name="twitter:description" content="Controle de caixa, relatórios, comissões e IA." />
<meta name="twitter:image"       content="https://telovisbarber.seudominio.com.br/og-image.jpg" />
```

Criar **`og-image.jpg`** (1200×630 px) com: logo Telovis Barber + fundo escuro + tagline.

---

### B-02 — Favicon
**Por quê:** Aba do browser e favoritos ficam sem ícone — parece site inacabado.

```html
<link rel="icon"             href="/favicon.ico" sizes="any" />
<link rel="icon"             href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

Gerar via [favicon.io](https://favicon.io): `favicon.ico`, `favicon.svg`, `apple-touch-icon.png` (180×180).

---

### B-03 — Meta robots e canonical
**Por quê:** Sem isso o Google pode indexar variantes duplicadas da URL.

```html
<link rel="canonical" href="https://telovisbarber.seudominio.com.br/" />
<meta name="robots" content="index, follow" />
```

---

### B-04 — Structured Data (Schema.org SoftwareApplication)
**Por quê:** Google pode exibir rich snippets com avaliação, preço e categoria.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Telovis Barber",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Sistema de gestão completo para barbearias.",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "149",
    "highPrice": "499",
    "priceCurrency": "BRL"
  }
}
</script>
```

---

## 🟠 Prioridade Média — Conversão

### B-05 — Screenshots / vídeo do sistema
**Por quê:** A página vende o produto só com texto e emojis. Uma tela real do dashboard converte muito mais do que qualquer copy.

O que adicionar:
- 2–3 screenshots do sistema (Dashboard, MeuPainel do barbeiro, Relatórios)
- Opcionalmente: vídeo de 30–60s screen-record mostrando o fluxo principal
- Posição ideal: após a seção de features, antes dos planos

Formato recomendado: imagem com moldura de browser (mockup), fundo escuro, sombra dourada.

---

### B-06 — Prova social quantificada
**Por quê:** "X barbearias usando" ancora credibilidade antes de o visitante ler os depoimentos.

Adicionar banner/badge no hero ou abaixo do hero:
```
✦ +12 barbearias  ✦  +8.500 vendas registradas  ✦  3 cidades
```
Atualizar os números conforme o sistema crescer.

---

### B-07 — Depoimentos com mais credibilidade
**Por quê:** 2 cards com iniciais e sem cargo/cidade parecem fabricados.

Melhorias:
- Adicionar foto real (ou avatar realista) de cada depoente
- Incluir cargo + cidade: "Thieco Leandro — Proprietário · São Paulo, SP"
- Adicionar 1–2 depoimentos extras (meta: 4 total)
- Opcional: adicionar nota de avaliação (★★★★★)

---

### B-08 — Seção FAQ (perguntas frequentes)
**Por quê:** Objeções não respondidas fazem o visitante fechar a aba. FAQ reduz atrito antes do contato.

Perguntas sugeridas:
1. Funciona no celular?
2. Precisa instalar alguma coisa?
3. E se eu tiver mais de uma unidade?
4. Como funciona o suporte?
5. Tem contrato de fidelidade?
6. Posso migrar meus dados históricos?
7. O sistema funciona sem internet?

---

### B-09 — Valor da taxa de setup nos planos
**Por quê:** "taxa de setup" sem valor na tabela de planos gera desconfiança — parece armadilha.

Opções:
- Informar o valor explicitamente (ex: "Taxa de setup única: R$ 297")
- Remover a menção se for negociável caso a caso
- Substituir por "Configuração inclusa" se for grátis

---

### B-10 — CTA alternativo ao WhatsApp
**Por quê:** Nem todo visitante quer abrir o WhatsApp. Formulário embutido ou campo de e-mail captura leads que não converteram na hora.

Adicionar abaixo do botão principal:
```html
<form>
  <input type="email" placeholder="Seu melhor e-mail" />
  <button type="submit">Receber demonstração</button>
</form>
```
Integrar com Mailchimp, Brevo ou n8n para automação do follow-up.

---

## 🟡 Prioridade Baixa — UX e Performance

### B-11 — Breakpoint intermediário (tablet 768px)
**Por quê:** Layout usa apenas 1 breakpoint (640px). Entre 640px e 1024px o layout pode quebrar em tablets.

Adicionar em `style.css`:
```css
@media (max-width: 768px) {
  .plans-grid { grid-template-columns: 1fr; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}
```
Testar em iPad (768×1024) e iPad Pro (1024×1366).

---

### B-12 — Ícones SVG substituindo emojis
**Por quê:** Emojis renderizam diferente em cada OS (Windows vs macOS vs Android). SVGs são consistentes.

Opções:
- Lucide Icons (já usado no sistema — consistência visual)
- Heroicons
- SVGs inline customizados com cor `--gold`

---

### B-13 — `font-display: swap` no carregamento das fontes
**Por quê:** Sem isso o browser pode bloquear a renderização enquanto carrega a fonte do Google.

O `display=swap` na URL do Google Fonts **não é suficiente** — precisa declarar `font-display: swap` no `@font-face` ou usar estratégia de fonte local como fallback inicial.

Alternativa mais simples: adicionar `font-display=swap` na URL e carregar com `<link rel="preload">`:
```html
<link rel="preload" as="style"
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&display=swap" />
```

---

### B-14 — Animações de entrada nas seções
**Por quê:** Cards de features e planos aparecem abruptamente. Fade-in suave ao entrar no viewport melhora a percepção de qualidade.

Implementar com Intersection Observer (já existe `main.js`):
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .plan-card, .pain-card')
  .forEach(el => observer.observe(el));
```
```css
.feature-card, .plan-card, .pain-card {
  opacity: 0; transform: translateY(20px); transition: opacity .4s, transform .4s;
}
.feature-card.visible, .plan-card.visible, .pain-card.visible {
  opacity: 1; transform: translateY(0);
}
```

---

## Ordem de execução sugerida

| # | Item | Esforço | Impacto |
|---|------|---------|---------|
| 1 | B-01 Open Graph + B-02 Favicon | 30min | Alto |
| 2 | B-03 Canonical + B-04 Schema | 15min | Médio |
| 3 | B-05 Screenshots do sistema | 2h | Muito alto |
| 4 | B-06 Prova social quantificada | 20min | Alto |
| 5 | B-08 FAQ | 1h | Alto |
| 6 | B-09 Taxa de setup | 10min | Médio |
| 7 | B-07 Depoimentos melhorados | 30min | Médio |
| 8 | B-10 CTA alternativo (e-mail) | 1h | Médio |
| 9 | B-11 Breakpoint tablet | 30min | Baixo |
| 10 | B-14 Animações de entrada | 45min | Baixo |
| 11 | B-12 Ícones SVG | 2h | Baixo |
| 12 | B-13 Font preload | 10min | Baixo |
