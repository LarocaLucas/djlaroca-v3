(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const mouse = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Relógio local e ano */
  const relogio = $('#relogio');
  const tique = () => { relogio.textContent = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }); };
  tique(); setInterval(tique, 1000);
  $('#ano').textContent = new Date().getFullYear();
  const hero = $('.hero');
  addEventListener('scroll', () => {
    document.documentElement.classList.toggle('rolou', scrollY > 80);
    hero.style.setProperty('--p', Math.min(scrollY / hero.offsetHeight, 1).toFixed(3));   // escurece o hero enquanto é coberto
  }, { passive: true });

  /* Menu em tela cheia */
  const btnMenu = $('.top-menu'), menu = $('#menu');
  const abreMenu = abrir => {
    menu.hidden = !abrir;
    btnMenu.setAttribute('aria-expanded', abrir);
    $('.top-menu-label').textContent = abrir ? 'Fechar' : 'Menu';
    document.documentElement.classList.toggle('menu-aberto', abrir);
  };
  btnMenu.addEventListener('click', () => abreMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) abreMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { abreMenu(false); btnMenu.focus(); } });

  /* Texto que entra desfocado: palavra a palavra ou letra a letra */
  for (const el of $$('[data-split]')) {
    const porLetra = el.dataset.split === 'chars';
    el.setAttribute('aria-label', el.textContent);
    el.style.setProperty('--n', el.textContent.split(porLetra ? '' : ' ').length);
    el.innerHTML = el.textContent.split(porLetra ? '' : ' ').map((p, i) =>
      `<span aria-hidden="true" style="--i:${i}">${p === ' ' ? '&nbsp;' : p}</span>`).join(porLetra ? '' : ' ');
  }
  const entra = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); entra.unobserve(e.target); }
  }, { threshold: .25 });
  const linhas = pai => $$(':scope > *', pai).forEach((el, k) => { el.style.setProperty('--k', k % 6); entra.observe(el); });
  $$('[data-split], .mesa').forEach(el => entra.observe(el));
  $$('.faixas, .linha').forEach(linhas);
  $$('.slot').forEach((el, k) => el.style.setProperty('--k', k));

  /* Agenda: lida de agenda.json (o dono edita no GitHub). Um cartão por dia;
     dia que já passou fica apagado, com glitch, e vira "Realizado". */
  const corpo = $('#agenda-corpo'), aviso = $('#agenda-aviso');
  const cria = (tag, classe, texto) => { const e = document.createElement(tag); if (classe) e.className = classe; if (texto != null) e.textContent = texto; return e; };
  const comGlitch = (tag, classe, texto) => { const e = cria(tag, (classe + ' glitch').trim(), texto); e.dataset.t = texto; return e; };
  fetch('agenda.json', { cache: 'no-cache' }).then(r => r.json()).then(ag => {
    const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });   // AAAA-MM-DD
    const dias = new Map();
    for (const d of [...ag.datas].sort((a, b) => a.data.localeCompare(b.data))) dias.set(d.data, [...(dias.get(d.data) || []), d]);
    corpo.textContent = '';
    if (ag.aviso) { aviso.textContent = ag.aviso; aviso.hidden = false; }
    let k = 0;
    for (const [data, shows] of dias) {
      const passou = data < hoje, dt = new Date(data + 'T12:00:00'), parte = o => dt.toLocaleDateString('pt-BR', o).replace('.', '');
      const situacao = passou ? 'Realizado' : shows.every(s => s.situacao === shows[0].situacao) ? shows[0].situacao : 'Confirmado';
      const dia = cria('article', passou ? 'dia passou' : 'dia futuro'), topo = cria('header'), lista = cria('ul');
      dia.dataset.img = caminho(k++ * 9 % total + 1);
      topo.append(comGlitch('span', 'dia-n', String(dt.getDate()).padStart(2, '0')), comGlitch('span', 'dia-m', parte({ month: 'short' }) + String.fromCharCode(10) + parte({ weekday: 'short' })), comGlitch('span', 'dia-s', situacao));
      for (const s of shows) {
        const li = cria('li');
        li.append(comGlitch('b', '', s.local), comGlitch('span', '', s.cidade + (!passou && s.situacao !== situacao ? ` · ${s.situacao}` : '')));
        lista.append(li);
      }
      dia.append(topo, lista);
      corpo.append(dia);
    }
    const livre = cria('article', 'dia livre'), topo = cria('header'), pill = cria('a', 'pill', 'Reservar');
    pill.href = '#contato';
    topo.append(cria('span', 'dia-n', '+'), cria('span', 'dia-m', 'Sua\ndata'), cria('span', 'dia-s', 'Disponível'));
    livre.append(topo, cria('p', '', 'Casas noturnas, festas, festivais e eventos privados em todo o Brasil.'), pill);
    corpo.append(livre);
    $$(':scope > *', corpo).forEach((el, n) => { el.style.setProperty('--k', n % 8); entra.observe(el); });
  }).catch(() => { corpo.textContent = ''; corpo.append(cria('p', 'nota', 'Agenda indisponível no momento. Veja as próximas datas no Instagram @dj_laroca.')); });

  /* Vídeo de fundo do hero só no celular (no computador fica a foto) */
  const video = $('.hero-video');
  if (matchMedia('(max-width: 820px)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.poster = video.dataset.poster; video.src = video.dataset.src;
    video.play().catch(() => {});
  }

  /* Efeitos presos à rolagem: --s = 0 quando o elemento entra por baixo, 1 quando sai por cima */
  const presos = $$('[data-scrub]');
  let aguardando = false;
  const mede = () => {
    aguardando = false;
    for (const el of presos) {
      const r = el.getBoundingClientRect();
      if (r.bottom > -200 && r.top < innerHeight + 200) el.style.setProperty('--s', Math.min(Math.max((innerHeight - r.top) / (innerHeight + r.height), 0), 1).toFixed(3));
    }
  };
  const agenda_medida = () => { if (!aguardando) { aguardando = true; requestAnimationFrame(mede); } };
  addEventListener('scroll', agenda_medida, { passive: true });
  addEventListener('resize', agenda_medida);
  mede();

  /* Números do "sobre" contam até o valor quando aparecem */
  const conta = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting) {
      conta.unobserve(e.target);
      const [, antes, num, depois] = e.target.textContent.match(/^(\D*)(\d+)(.*)$/), t0 = performance.now();
      const passo = t => { const p = Math.min((t - t0) / 1400, 1); e.target.textContent = antes + Math.round(num * (1 - (1 - p) ** 3)) + depois; if (p < 1) requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
    }
  }, { threshold: 1 });
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) $$('.stats dd').forEach(el => conta.observe(el));

  const sobe = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); sobe.unobserve(e.target); }
  }, { threshold: .08, rootMargin: '0px 0px -8% 0px' });
  $$('.row-tags, .sobre > .tag, .sobre-foot > *, .rolante, .capa, .player-titulo, .player, .aviso, .contato .tag, .contato-txt, .contato-acoes')
    .forEach(el => { el.dataset.rev = ''; sobe.observe(el); });

  /* Galeria: fotos espalhadas como sobre uma mesa. De tempos em tempos uma foto
     nova é "jogada" por cima de uma das posições, até passar por todas. */
  const mesa = $('.mesa'), visor = $('.visor'), visorImg = $('img', visor);
  const total = +mesa.dataset.total, caminho = n => `assets/images/galeria/foto-${String(n).padStart(3, '0')}.jpg`;
  const slots = $$('.slot', mesa), naMesa = () => $$('.foto:not(.sai)', mesa).map(f => +f.dataset.n);
  let fila = [], ultimoSlot = -1, topo = 10, mesaVisivel = false;
  const proxima = () => {
    if (!fila.length) fila = Array.from({ length: total }, (_, i) => i + 1).sort(() => Math.random() - .5);
    const n = fila.pop();
    return naMesa().includes(n) ? proxima() : n;
  };
  const joga = () => {
    if (!mesaVisivel || document.hidden || visor.open) return;
    const livres = slots.filter((sl, i) => i !== ultimoSlot && sl.offsetParent && !sl.matches(':hover, :focus-within'));
    const slot = livres[Math.random() * livres.length | 0]; if (!slot) return;
    const n = proxima(), img = new Image();
    img.alt = 'Foto de evento do DJ Laroca';
    img.onload = () => {
      const velha = $('.foto:not(.sai)', slot), nova = document.createElement('button');
      nova.className = 'foto entra'; nova.type = 'button'; nova.dataset.n = n;
      nova.setAttribute('aria-label', 'Ampliar foto');
      nova.style.rotate = `${(Math.random() * 6 - 3).toFixed(1)}deg`;
      nova.append(img);
      slot.style.zIndex = ++topo;
      slot.append(nova);
      if (velha) { velha.classList.add('sai'); setTimeout(() => velha.remove(), 900); }
      ultimoSlot = slots.indexOf(slot);
    };
    img.src = caminho(n);
  };
  new IntersectionObserver(([e]) => { mesaVisivel = e.isIntersecting; }, { threshold: .15 }).observe(mesa);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(joga, 1800);

  let atual = 1;
  const mostra = n => { atual = (n - 1 + total) % total + 1; visorImg.src = caminho(atual); visorImg.alt = `Foto ${atual} de ${total}`; };
  mesa.addEventListener('click', e => {
    const f = e.target.closest('.foto'); if (!f) return;
    mostra(+f.dataset.n); visor.showModal();
  });
  $('.visor-x').addEventListener('click', () => visor.close());
  $('.visor-ant').addEventListener('click', () => mostra(atual - 1));
  $('.visor-prox').addEventListener('click', () => mostra(atual + 1));
  visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });
  visor.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') mostra(atual - 1); if (e.key === 'ArrowRight') mostra(atual + 1); });

  if (!mouse) return;

  /* Ponto que segue o cursor */
  const cursor = $('.cursor');
  let cx = 0, cy = 0, tx = 0, ty = 0, parado = true;
  const segue = () => {
    cx += (tx - cx) * .18; cy += (ty - cy) * .18;
    cursor.style.transform = `translate(${cx}px,${cy}px)`;
    parado = Math.abs(tx - cx) + Math.abs(ty - cy) < .2;
    if (!parado) requestAnimationFrame(segue);
  };
  addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY;
    cursor.classList.add('on');
    cursor.classList.toggle('alvo', !!e.target.closest('a, button'));
    if (parado) { parado = false; requestAnimationFrame(segue); }
  });
  document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('on'));

  /* Agenda: foto flutuante ao passar por uma data */
  const peek = $('.peek'), peekImg = $('img', peek);
  corpo.addEventListener('pointermove', e => {
    const tr = e.target.closest('[data-img]');
    peek.classList.toggle('on', !!tr);
    if (!tr) return;
    if (!peekImg.src.endsWith(tr.dataset.img)) peekImg.src = tr.dataset.img;
    peek.style.transform = `translate(${e.clientX + 24}px,${e.clientY - 90}px)`;
  });
  corpo.addEventListener('pointerleave', () => peek.classList.remove('on'));
})();
