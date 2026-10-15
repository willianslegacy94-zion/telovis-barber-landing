// Número que recebe o formulário e o simulador (o 2º contato fica só nos botões)
const WHATSAPP = '5511954079335';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wa = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const money = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

// ── Navegação ────────────────────────────────────────────────────────────
const nav = document.querySelector('.main-nav');
const menuBtn = document.querySelector('.mobile-menu');
function setMenu(open) {
  nav.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menuBtn.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
}
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));

document.querySelectorAll('[data-goto]').forEach((el) => {
  el.addEventListener('click', () => {
    document.getElementById(el.dataset.goto)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
    setMenu(false);
  });
});

// ── Segmentos (trocam o texto do hero e do contato) ─────────────────────
const segments = {
  solo: {
    title: 'Sua barbearia, sob controle.', highlight: 'Do caixa à cadeira.',
    description: 'Você corta, atende e ainda fecha o caixa. O TL Barber organiza vendas, despesas e relatórios para você saber quanto a barbearia realmente fatura — sem caderno.',
    offer: 'Controle de verdade, mesmo trabalhando sozinho.', need: 'O que mais pesa na sua rotina hoje?',
  },
  equipe: {
    title: 'Sua equipe afiada.', highlight: 'Comissão sem discussão.',
    description: 'Cada atendimento registrado, cada comissão calculada certa e um extrato claro por barbeiro. Você acompanha a performance da equipe sem fazer conta na mão.',
    offer: 'Mais tempo para a cadeira, menos tempo na planilha.', need: 'Como você calcula a comissão da equipe hoje?',
  },
  rede: {
    title: 'Várias unidades.', highlight: 'Uma visão só.',
    description: 'Acompanhe a rede inteira de um lugar, com controle fino de cada unidade — tudo com a marca da sua barbearia, num único login.',
    offer: 'Conecte todas as unidades da sua rede.', need: 'Quantas unidades você tem e o que precisa enxergar?',
  },
  abrindo: {
    title: 'Sua barbearia nova.', highlight: 'Começando do jeito certo.',
    description: 'Comece com caixa, comissões e relatórios organizados desde o primeiro corte — e com mentoria de quem já viveu o dia a dia de barbearia.',
    offer: 'Vamos colocar sua barbearia de pé do jeito certo.', need: 'Em que fase está a abertura da sua barbearia?',
  },
};
let currentSegment = 'solo';
function applySegment(key, push) {
  const copy = segments[key] ? segments[key] : segments.solo;
  currentSegment = segments[key] ? key : 'solo';
  document.querySelectorAll('[data-copy]').forEach((el) => { el.textContent = copy[el.dataset.copy]; });
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
applySegment(new URLSearchParams(location.search).get('segmento') || 'solo', false);

// ── Filtro de módulos ────────────────────────────────────────────────────
const cards = [...document.querySelectorAll('.project-card')];
const count = document.querySelector('.project-count');
document.querySelectorAll('[data-filter]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((b) => {
      const on = b === btn;
      b.classList.toggle('btn-default', on);
      b.classList.toggle('btn-outline', !on);
      b.setAttribute('aria-pressed', String(on));
    });
    let visible = 0;
    cards.forEach((card) => {
      const show = filter === 'Todos' || card.dataset.type === filter;
      card.hidden = !show;
      if (show) visible++;
    });
    count.textContent = `${visible} ${visible === 1 ? 'módulo' : 'módulos'}`;
  });
});

// ── Simulador de faturamento por cadeira ────────────────────────────────
const sim = document.querySelector('.cmv-section');
const simCta = sim.querySelector('[data-sim-cta]');
function simulate() {
  const val = (name) => sim.querySelector(`[name="${name}"]`).value.trim();
  const raw = ['atendimentos', 'ticket', 'dias', 'comissao'].map(val);
  const [atend, ticket, dias, pct] = raw.map(Number);
  const ok = raw.every((v) => v !== '') && [atend, ticket, dias, pct].every((n) => Number.isFinite(n) && n >= 0) && pct <= 100;
  sim.querySelector('[data-result="ok"]').hidden = !ok;
  sim.querySelector('[data-result="erro"]').hidden = ok;
  if (!ok) { simCta.href = wa('Olá! Quero entender meus números com o TL Barber.'); return; }
  const faturamento = atend * ticket * dias;
  const comissao = faturamento * pct / 100;
  sim.querySelector('[data-out="faturamento"]').textContent = money(faturamento);
  sim.querySelector('[data-out="comissao"]').textContent = money(comissao);
  sim.querySelector('[data-out="casa"]').textContent = money(faturamento - comissao);
  simCta.href = wa(`Olá! Simulei no site do TL Barber: uma cadeira faturando ${money(faturamento)} por mês (${pct}% de comissão). Quero acompanhar meus números de verdade.`);
}
sim.querySelectorAll('input').forEach((input) => input.addEventListener('input', simulate));
simulate();

// ── Formulário → WhatsApp ───────────────────────────────────────────────
const form = document.querySelector('.lead-form');
const formError = form.querySelector('.form-error');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const fail = (msg) => { formError.textContent = msg; formError.hidden = false; };
  if (!data.nome || data.nome.trim().length < 2) return fail('Informe seu nome.');
  if (!data.barbearia || data.barbearia.trim().length < 2) return fail('Informe o nome da barbearia.');
  if (!form.consent.checked) return fail('Autorize o contato para continuar.');
  formError.hidden = true;
  const lines = [
    'Olá! Quero uma proposta do TL Barber.',
    `Nome: ${data.nome.trim()}`,
    `Barbearia: ${data.barbearia.trim()}`,
    data.cidade && data.cidade.trim() ? `Cidade: ${data.cidade.trim()}` : '',
    `Barbeiros na equipe: ${data.equipe}`,
    `Momento: ${document.querySelector(`[data-segment="${currentSegment}"]`).textContent}`,
    data.mensagem && data.mensagem.trim() ? `Detalhes: ${data.mensagem.trim()}` : '',
  ].filter(Boolean);
  window.open(wa(lines.join('\n')), '_blank', 'noopener');
});
