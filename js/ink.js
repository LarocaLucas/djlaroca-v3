/* Tinta do hero: o ponteiro espalha tinta roxa e, dentro dela, a logo glitch
   vira a logo gótica. Máscara 2D de baixa resolução + limiar num shader WebGL.
   Sem WebGL ou com "reduzir movimento": fica só a <img> da logo glitch. */
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
uniform vec2 uRes;
uniform float uT;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  vec2 p = v * uRes / uRes.y;
  float m = texture2D(uM, v).a;
  float nz = n(p*7. + uT*.15)*.6 + n(p*19. - uT*.1)*.4;
  m += (nz - .5) * .7 * smoothstep(.05, .4, m);          // borda orgânica
  float ink = smoothstep(.47, .53, m);
  vec2 q = (v - uRect.xy) / uRect.zw;
  float dentro = step(0., q.x) * step(q.x, 1.) * step(0., q.y) * step(q.y, 1.);
  float a = texture2D(uA, q).a * dentro;
  float b = texture2D(uB, q).a * dentro;
  vec3 cor = mix(vec3(.20, .03, .46), vec3(.61, .19, 1.), smoothstep(.5, 1.2, m));
  gl_FragColor = mix(vec4(vec3(a), a), vec4(mix(cor, vec3(1.), b), 1.), ink);
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

  let raio = 20, rodando = false, visivel = true, ultimo = 0, atividade = 0, varre = 0, pos = null;
  const gotas = [];

  function mede() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const w = hero.clientWidth, hh = hero.clientHeight;
    canvas.width = w * dpr; canvas.height = hh * dpr;
    mask.width = Math.ceil(w / ESCALA); mask.height = Math.ceil(hh / ESCALA);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const H = hero.getBoundingClientRect(), S = slot.getBoundingClientRect();
    const fh = S.width * FRAME;
    gl.uniform4f(U('uRect'), (S.left - H.left) / w, (S.top - H.top + (S.height - fh) / 2) / hh, S.width / w, fh / hh);
    gl.uniform2f(U('uRes'), w, hh);
    raio = Math.max(12, S.height * 0.3 / ESCALA);
  }

  function carimbo(x, y, r) {
    const g = mx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.45, 'rgba(255,255,255,.75)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    mx.fillStyle = g; mx.beginPath(); mx.arc(x, y, r, 0, 6.2832); mx.fill();
  }

  // x, y em px do hero
  function pinta(x, y) {
    x /= ESCALA; y /= ESCALA;
    const de = pos || { x, y }, d = Math.hypot(x - de.x, y - de.y);
    const passos = Math.max(1, Math.ceil(d / (raio * .4)));
    const r = raio * (.75 + Math.min(d / raio, 1.2) * .35);
    for (let i = 1; i <= passos; i++) {
      const px = de.x + (x - de.x) * i / passos, py = de.y + (y - de.y) * i / passos;
      carimbo(px, py, r);
      if (Math.random() < .22) gotas.push({ x: px + (Math.random() - .5) * r, y: py, r: r * (.25 + Math.random() * .25), vy: 30 + Math.random() * 60 });
    }
    pos = { x, y };
    acorda();
  }

  function quadro(agora) {
    const dt = Math.min((agora - ultimo) / 1000, .05); ultimo = agora;
    if (varre) {                       // passada automática sobre a logo
      const t = (agora - varre) / 1500, S = slot.getBoundingClientRect(), H = hero.getBoundingClientRect();
      if (t >= 1) { varre = 0; pos = null; }
      else pinta(S.left - H.left + S.width * (.04 + .92 * t), S.top - H.top + S.height * (.5 + Math.sin(t * 9) * .22));
    }
    mx.globalCompositeOperation = 'destination-out';   // a tinta recua
    mx.fillStyle = `rgba(0,0,0,${1 - Math.exp(-dt * .9)})`;
    mx.fillRect(0, 0, mask.width, mask.height);
    mx.globalCompositeOperation = 'source-over';
    for (let i = gotas.length - 1; i >= 0; i--) {      // gotas escorrendo
      const g = gotas[i];
      g.y += g.vy * dt; g.vy *= .985; g.r *= .99;
      carimbo(g.x, g.y, g.r);
      if (g.r < 2 || g.y > mask.height + g.r) gotas.splice(i, 1);
    }
    gl.activeTexture(gl.TEXTURE2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
    gl.uniform1f(U('uT'), agora / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rodando = visivel && agora - atividade < 6000;     // parado: desliga o laço
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
