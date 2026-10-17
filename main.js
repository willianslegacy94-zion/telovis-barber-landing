// Número que recebe o formulário e o simulador (o 2º contato fica só nos botões)
const WHATSAPP = '5511954079335';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wa = (text, number = WHATSAPP) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

// ── Idioma ───────────────────────────────────────────────────────────────
// Ordem: ?lang= na URL → escolha salva → idioma do navegador → português.
const LANGS = {
  pt: { html: 'pt-BR', locale: 'pt-BR', currency: 'BRL' },
  en: { html: 'en', locale: 'en-US', currency: 'USD' },
  es: { html: 'es', locale: 'es-419', currency: 'USD' },
};
const LANG_KEY = 'tlbarber_lang';
let lang = 'pt';
const t = (key) => I18N[lang][key] ?? I18N.pt[key] ?? key;
const money = (v) => new Intl.NumberFormat(LANGS[lang].locale, { style: 'currency', currency: LANGS[lang].currency, currencyDisplay: 'narrowSymbol' }).format(v);

const metaTags = {
  'meta.description': document.querySelector('meta[name="description"]'),
  'meta.ogTitle': document.querySelector('meta[property="og:title"]'),
  'meta.ogDescription': document.querySelector('meta[property="og:description"]'),
};

// O português do HTML vira o dicionário `pt` (assim o texto não fica em dois lugares)
document.querySelectorAll('[data-i18n]').forEach((el) => { I18N.pt[el.dataset.i18n] ??= el.innerHTML.trim(); });
document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
  el.dataset.i18nAttr.split(';').forEach((pair) => {
    const [attr, key] = pair.split(':');
    I18N.pt[key] ??= el.getAttribute(attr);
  });
});

function detectLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (LANGS[fromUrl]) return fromUrl;
  try { const saved = localStorage.getItem(LANG_KEY); if (LANGS[saved]) return saved; } catch { /* storage bloqueado */ }
  const nav = (navigator.languages || [navigator.language || '']).map((l) => l.slice(0, 2).toLowerCase());
  return nav.find((l) => LANGS[l]) || 'pt';
}

function applyLang(next, persist) {
  lang = LANGS[next] ? next : 'pt';
  document.documentElement.lang = LANGS[lang].html;
  document.title = t('meta.title');
  Object.entries(metaTags).forEach(([key, el]) => el?.setAttribute('content', t(key)));
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':');
      el.setAttribute(attr, t(key));
    });
  });
  document.querySelectorAll('[data-lang]').forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
  document.querySelectorAll('[data-wa]').forEach((a) => { a.href = wa(t('wa.hello'), a.dataset.wa); });

  // Partes montadas pelo JS
  setMenu(nav.classList.contains('is-open'));
  applySegment(currentSegment, false);
  updateCount();
  simulate();

  if (persist) {
    try { localStorage.setItem(LANG_KEY, lang); } catch { /* storage bloqueado */ }
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
  }
}

// ── Navegação ────────────────────────────────────────────────────────────
const nav = document.querySelector('.main-nav');
const menuBtn = document.querySelector('.mobile-menu');
function setMenu(open) {
  nav.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', t(open ? 'menu.close' : 'menu.open'));
  menuBtn.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
}
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));

document.querySelectorAll('[data-goto]').forEach((el) => {
  el.addEventListener('click', () => {
    document.getElementById(el.dataset.goto)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
    setMenu(false);
  });
});

document.querySelectorAll('[data-lang]').forEach((btn) => btn.addEventListener('click', () => applyLang(btn.dataset.lang, true)));

// ── Segmentos (trocam o texto do hero e do contato) ─────────────────────
const SEGMENTS = ['solo', 'equipe', 'rede', 'abrindo'];
let currentSegment = 'solo';
function applySegment(key, push) {
  currentSegment = SEGMENTS.includes(key) ? key : 'solo';
  document.querySelectorAll('[data-copy]').forEach((el) => { el.textContent = t(`seg.${currentSegment}.${el.dataset.copy}`); });
  document.querySelectorAll('[data-segment]').forEach((btn) => {
    const active = btn.dataset.segment === currentSegment;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  if (push) {
    const url = new URL(window.location.href);
    url.searchParams.set('segmento', currentSegment);
    history.replaceState(null, '', url);
  }
}
document.querySelectorAll('[data-segment]').forEach((btn) => btn.addEventListener('click', () => applySegment(btn.dataset.segment, true)));
currentSegment = new URLSearchParams(location.search).get('segmento') || 'solo';

// ── Filtro de módulos ────────────────────────────────────────────────────
const cards = [...document.querySelectorAll('.project-card')];
const count = document.querySelector('.project-count');
function updateCount() {
  const visible = cards.filter((card) => !card.hidden).length;
  count.textContent = `${visible} ${t(visible === 1 ? 'mod.count.one' : 'mod.count.many')}`;
}
document.querySelectorAll('[data-filter]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((b) => {
      const on = b === btn;
      b.classList.toggle('btn-default', on);
      b.classList.toggle('btn-outline', !on);
      b.setAttribute('aria-pressed', String(on));
    });
    cards.forEach((card) => { card.hidden = !(filter === 'Todos' || card.dataset.type === filter); });
    updateCount();
  });
});

// ── Simulador de faturamento por profissional ────────────────────────────────
const sim = document.querySelector('.cmv-section');
const simCta = sim.querySelector('[data-sim-cta]');
function simulate() {
  const val = (name) => sim.querySelector(`[name="${name}"]`).value.trim();
  const raw = ['atendimentos', 'ticket', 'dias', 'comissao'].map(val);
  const [atend, ticket, dias, pct] = raw.map(Number);
  const ok = raw.every((v) => v !== '') && [atend, ticket, dias, pct].every((n) => Number.isFinite(n) && n >= 0) && pct <= 100;
  sim.querySelector('[data-result="ok"]').hidden = !ok;
  sim.querySelector('[data-result="erro"]').hidden = ok;
  if (!ok) { simCta.href = wa(t('sim.waErr')); return; }
  const faturamento = atend * ticket * dias;
  const comissao = faturamento * pct / 100;
  sim.querySelector('[data-out="faturamento"]').textContent = money(faturamento);
  sim.querySelector('[data-out="comissao"]').textContent = money(comissao);
  sim.querySelector('[data-out="casa"]').textContent = money(faturamento - comissao);
  simCta.href = wa(t('sim.wa').replace('{total}', money(faturamento)).replace('{pct}', pct));
}
sim.querySelectorAll('input').forEach((input) => input.addEventListener('input', simulate));

// ── Formulário → WhatsApp ───────────────────────────────────────────────
const form = document.querySelector('.lead-form');
const formError = form.querySelector('.form-error');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const fail = (msg) => { formError.textContent = msg; formError.hidden = false; };
  if (!data.nome || data.nome.trim().length < 2) return fail(t('f.errName'));
  if (!data.negocio || data.negocio.trim().length < 2) return fail(t('f.errShop'));
  if (!form.consent.checked) return fail(t('f.errConsent'));
  formError.hidden = true;
  const lines = [
    t('f.waIntro'),
    `${t('f.waName')}: ${data.nome.trim()}`,
    `${t('f.waShop')}: ${data.negocio.trim()}`,
    data.cidade && data.cidade.trim() ? `${t('f.waCity')}: ${data.cidade.trim()}` : '',
    `${t('f.waTeam')}: ${data.equipe}`,
    `${t('f.waMoment')}: ${document.querySelector(`[data-segment="${currentSegment}"]`).textContent}`,
    data.mensagem && data.mensagem.trim() ? `${t('f.waDetails')}: ${data.mensagem.trim()}` : '',
  ].filter(Boolean);
  window.open(wa(lines.join('\n')), '_blank', 'noopener');
});

applyLang(detectLang(), false);
