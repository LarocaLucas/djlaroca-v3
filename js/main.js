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
    el.innerHTML = el.textContent.split(porLetra ? '' : ' ').map((p, i) =>
      `<span aria-hidden="true" style="--i:${i}">${p === ' ' ? '&nbsp;' : p}</span>`).join(porLetra ? '' : ' ');
  }
  const entra = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); entra.unobserve(e.target); }
  }, { threshold: .25 });
  $$('[data-split], .faixas li, .tabela tbody tr, .linha li').forEach(el => entra.observe(el));
  const sobe = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); sobe.unobserve(e.target); }
  }, { threshold: .08, rootMargin: '0px 0px -8% 0px' });
  $$('.row-tags, .sobre > .tag, .sobre-foot > *, .capa, .player, .mesa, .nota, .contato .tag, .contato-txt, .contato-acoes')
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
  const peek = $('.peek'), peekImg = $('img', peek), corpo = $('.tabela tbody');
  corpo.addEventListener('pointermove', e => {
    const tr = e.target.closest('tr[data-img]');
    peek.classList.toggle('on', !!tr);
    if (!tr) return;
    if (!peekImg.src.endsWith(tr.dataset.img)) peekImg.src = tr.dataset.img;
    peek.style.transform = `translate(${e.clientX + 24}px,${e.clientY - 90}px)`;
  });
  corpo.addEventListener('pointerleave', () => peek.classList.remove('on'));
})();
