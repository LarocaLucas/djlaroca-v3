(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const mouse = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Relógio local e ano */
  const relogio = $('#relogio');
  const tique = () => { relogio.textContent = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }); };
  tique(); setInterval(tique, 1000);
  $('#ano').textContent = new Date().getFullYear();
  addEventListener('scroll', () => document.documentElement.classList.toggle('rolou', scrollY > 80), { passive: true });

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

  /* Galeria: 8 fotos no HTML, o resto entra no botão; visor em <dialog> */
  const fotos = $('.fotos'), mais = $('.mais'), visor = $('.visor'), visorImg = $('img', visor);
  const total = +fotos.dataset.total, caminho = n => `assets/images/galeria/foto-${String(n).padStart(3, '0')}.jpg`;
  let atual = 1;
  const mostra = n => { atual = (n - 1 + total) % total + 1; visorImg.src = caminho(atual); visorImg.alt = `Foto ${atual} de ${total}`; };
  mais.hidden = false;
  mais.addEventListener('click', () => {
    let html = '';
    for (let n = fotos.children.length + 1; n <= total; n++) html += `<a href="${caminho(n)}"><img src="${caminho(n)}" alt="Foto ${n} da galeria" loading="lazy"></a>`;
    fotos.insertAdjacentHTML('beforeend', html);
    mais.hidden = true;
  });
  fotos.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a) return;
    e.preventDefault(); mostra([...fotos.children].indexOf(a) + 1); visor.showModal();
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
