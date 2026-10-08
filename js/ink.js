/* Tinta do hero: o ponteiro deixa um rastro de tinta líquida e, dentro dele, a
   logo glitch vira a logo gótica. Máscara 2D de baixa resolução + shader WebGL
   (limiar, ondulação e brilho de líquido). Sem WebGL ou com "reduzir
   movimento": fica só a <img> da logo glitch. */
(() => {
  const hero = document.querySelector('.hero');
  const canvas = hero && hero.querySelector('.ink');
  const slot = hero && hero.querySelector('.logo-slot');
  if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const gl = canvas.getContext('webgl', { antialias: false });
  if (!gl) return;

  const FRAME = 1152 / 2048;   // proporção do quadro das logos
  const ESCALA = 4;            // máscara = 1/4 do tamanho do hero
  const mask = document.createElement('canvas');
  const mx = mask.getContext('2d');

  const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*vec2(.5,-.5)+.5;gl_Position=vec4(p,0.,1.);}';
  const FS = `precision mediump float;
varying vec2 v;
uniform sampler2D uA, uB, uM;
uniform vec4 uRect;
uniform vec2 uRes, uPx;
uniform float uT;
const float LIM = .3;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  vec2 p = v * uRes / uRes.y;
  // ondulação: a borda deixa de ser um círculo perfeito e se mexe devagar
  vec2 w = vec2(n(p*3.2 + uT*.22), n(p*3.2 + 7.3 - uT*.18)) - .5;
  w += (vec2(n(p*9. - uT*.3), n(p*9. + 3.1 + uT*.26)) - .5) * .4;
  vec2 mv = v + w * vec2(uRes.y / uRes.x, 1.) * .034;
  // some suave perto das bordas do canvas, para a tinta não ser cortada em linha reta
  float margem = smoothstep(0., .07, v.x) * smoothstep(0., .07, 1. - v.x) * smoothstep(0., .12, v.y) * smoothstep(0., .14, 1. - v.y);
  float m = texture2D(uM, mv).a * margem;
  if (m < .02) {                                   // fora da tinta: só a logo glitch
    vec2 q0 = (v - uRect.xy) / uRect.zw;
    float a0 = texture2D(uA, q0).a * step(0., q0.x) * step(q0.x, 1.) * step(0., q0.y) * step(q0.y, 1.);
    gl_FragColor = vec4(a0);
    return;
  }
  float gx = texture2D(uM, mv + vec2(uPx.x, 0.)).a - texture2D(uM, mv - vec2(uPx.x, 0.)).a;
  float gy = texture2D(uM, mv + vec2(0., uPx.y)).a - texture2D(uM, mv - vec2(0., uPx.y)).a;
  m += (n(p*26.) - .5) * .2 * smoothstep(.1, .3, m);
  float ink = smoothstep(LIM - .012, LIM + .012, m);
  // brilho de líquido a partir do relevo da máscara
  vec3 nor = normalize(vec3(-gx, -gy, .7));
  vec3 luz = normalize(vec3(-.45, -.65, .6));
  float dif = max(dot(nor, luz), 0.);
  float esp = pow(max(reflect(-luz, nor).z, 0.), 28.);
  float borda = 1. - smoothstep(LIM, LIM + .16, m);
  vec3 cor = vec3(.15, .03, .34) * (.8 + .35 * dif) + vec3(.55, .22, 1.) * borda * .4 + vec3(.95, .85, 1.) * esp * .22;
  vec2 q = (v - uRect.xy) / uRect.zw;
  float dentro = step(0., q.x) * step(q.x, 1.) * step(0., q.y) * step(q.y, 1.);
  float a = texture2D(uA, q).a * dentro;
  float b = texture2D(uB, q).a * dentro;
  vec4 tinta = mix(vec4(cor * .68, .68), vec4(1.), b);   // pré-multiplicado
  gl_FragColor = mix(vec4(a), tinta, ink);
}`;

  const sh = (tipo, src) => { const s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aP = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(aP);
  gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(prog, n);

  const textura = (unidade, fonte) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unidade);
    gl.bindTexture(gl.TEXTURE_2D, t);
    for (const [k, val] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, val);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fonte);
  };
  const carrega = src => new Promise((ok, erro) => { const i = new Image(); i.onload = () => ok(i); i.onerror = erro; i.src = src; });

  let raio = 20, larg = 1, recuo = 0, ox = 0, oy = 0, rodando = false, visivel = true, ultimo = 0, atividade = 0, varre = 0, pos = null;
  const gotas = [];

  // O canvas cobre só uma faixa em volta da logo (não o hero inteiro): menos pixels por quadro.
  function mede() {
    const dpr = Math.min(devicePixelRatio || 1, 1.25);
    const H = hero.getBoundingClientRect(), S = slot.getBoundingClientRect();
    const x0 = Math.max(0, S.left - H.left - S.width * .1), x1 = Math.min(H.width, S.right - H.left + S.width * .1);
    const y0 = Math.max(0, S.top - H.top - S.height * .45), y1 = Math.min(H.height, S.bottom - H.top + S.height * .8);
    const w = x1 - x0, hh = y1 - y0;
    ox = x0; oy = y0;
    Object.assign(canvas.style, { left: x0 + 'px', top: y0 + 'px', width: w + 'px', height: hh + 'px' });
    canvas.width = w * dpr; canvas.height = hh * dpr;
    mask.width = Math.ceil(w / ESCALA); mask.height = Math.ceil(hh / ESCALA);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const fh = S.width * FRAME;
    gl.uniform4f(U('uRect'), (S.left - H.left - x0) / w, (S.top - H.top - y0 + (S.height - fh) / 2) / hh, S.width / w, fh / hh);
    gl.uniform2f(U('uRes'), w, hh);
    gl.uniform2f(U('uPx'), 1.5 / mask.width, 1.5 / mask.height);
    raio = Math.max(9, S.height * .34 / ESCALA);
  }

  function carimbo(x, y, r, forca = 1) {
    const g = mx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${forca})`); g.addColorStop(.5, `rgba(255,255,255,${forca * .55})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    mx.fillStyle = g; mx.beginPath(); mx.arc(x, y, r, 0, 6.2832); mx.fill();
  }

  // x, y em px do hero; o traço engrossa com a velocidade (devagar = fio de tinta)
  function pinta(x, y, minimo = 0) {
    x = (x - ox) / ESCALA; y = (y - oy) / ESCALA;
    const de = pos || { x, y }, dx = x - de.x, dy = y - de.y, d = Math.hypot(dx, dy);
    const vel = Math.max(Math.min(d / (raio * .7), 1), minimo);
    larg += (Math.random() - .5) * .25; larg = Math.min(1.25, Math.max(.7, larg));   // largura irregular
    const r = raio * (.38 + .8 * vel) * larg;
    const passos = Math.max(1, Math.ceil(d / (r * .35)));
    for (let i = 1; i <= passos; i++) {
      const px = de.x + dx * i / passos, py = de.y + dy * i / passos;
      carimbo(px, py, r, .55 + .45 * vel);
      if (Math.random() < .03) gotas.push({ x: px + (Math.random() - .5) * r * .8, y: py + r * .3, r: r * (.16 + Math.random() * .14), vy: 35 + Math.random() * 55 });
    }
    pos = { x, y };
    acorda();
  }

  function quadro(agora) {
    if (agora - ultimo < 15) { requestAnimationFrame(quadro); return; }   // no máximo ~60 quadros/s, mesmo em tela de 240 Hz
    const dt = Math.min((agora - ultimo) / 1000, .05); ultimo = agora;
    if (varre) {                       // passada automática sobre a logo
      const t = (agora - varre) / 1300, S = slot.getBoundingClientRect(), H = hero.getBoundingClientRect();
      if (t >= 1) { varre = 0; pos = null; }
      else pinta(S.left - H.left + S.width * (.06 + .88 * t), S.top - H.top + S.height * (.5 + Math.sin(t * 8) * .2), .7);
    }
    // a tinta recua. Em passos de 1/30 s: num monitor de 144 Hz+ o passo por quadro
    // seria menor que 1/255 e a máscara de 8 bits nunca terminaria de apagar.
    recuo += dt;
    if (recuo >= 1 / 30) {
      mx.globalCompositeOperation = 'destination-out';
      mx.fillStyle = `rgba(0,0,0,${1 - Math.exp(-recuo * 1.05)})`;
      mx.fillRect(0, 0, mask.width, mask.height);
      mx.globalCompositeOperation = 'source-over';
      recuo = 0;
    }
    for (let i = gotas.length - 1; i >= 0; i--) {      // gotas escorrendo, afinando
      const g = gotas[i];
      const f = dt * 60; g.y += g.vy * dt; g.vy *= .975 ** f; g.r *= .985 ** f;
      carimbo(g.x, g.y, g.r);
      if (g.r < 1.6 || g.vy < 6 || g.y > mask.height + g.r) gotas.splice(i, 1);
    }
    gl.activeTexture(gl.TEXTURE2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
    gl.uniform1f(U('uT'), agora / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rodando = visivel && agora - atividade < 4000;     // parado: desliga o laço
    if (rodando) requestAnimationFrame(quadro);
  }
  function acorda() {
    atividade = performance.now();
    if (!rodando && visivel) { rodando = true; ultimo = atividade; requestAnimationFrame(quadro); }
  }
  const varredura = () => { if (visivel && !varre) { pos = null; varre = performance.now(); acorda(); } };

  Promise.all([carrega('assets/images/logo-glitch.webp'), carrega('assets/images/logo-gotica.webp')]).then(([a, b]) => {
    textura(0, a); textura(1, b); textura(2, mask);
    gl.uniform1i(U('uA'), 0); gl.uniform1i(U('uB'), 1); gl.uniform1i(U('uM'), 2);
    mede();
    hero.classList.add('ink-on');
    new ResizeObserver(() => { mede(); acorda(); }).observe(hero);
    new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) acorda(); }).observe(hero);
    hero.addEventListener('pointermove', e => { const H = hero.getBoundingClientRect(); varre = 0; pinta(e.clientX - H.left, e.clientY - H.top); });
    hero.addEventListener('pointerleave', () => { pos = null; });
    hero.addEventListener('pointerdown', () => { pos = null; });
    setTimeout(varredura, 700);
    // sem mouse (celular): repete a passada para a troca de logos aparecer
    if (!matchMedia('(hover: hover)').matches) setInterval(varredura, 6000);
    acorda();
  }).catch(() => {});
})();
