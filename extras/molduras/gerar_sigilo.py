# Gera a moldura "sigilo" dos cartões da agenda: emaranhado de ramos finos com espinhos curvos
# (estilo neo-tribal / cyber sigilism, como a referência que o dono mandou), desenho próprio e procedural.
# Saída: assets/images/sigilo.svg (moldura de 9 fatias, 600x600, cantos de 240, borda de 120 que se repete)
#        assets/images/sigilo-brasao.svg e sigilo-brasao-baixo.svg (ornamento do meio de cima / de baixo)
# Uso (na raiz do projeto):  python extras/molduras/gerar_sigilo.py [semente]
import math, random, sys

COR = '#f0e8ff'
C, T, CL = 240, 120, 58          # canto, largura do trecho de borda, distância do "fio" até a beirada
JUNTAS = (-10, 0, 10)            # alturas (em relação a CL) em que os fios cruzam as emendas, sempre na horizontal
rnd = random.Random(int(sys.argv[1]) if len(sys.argv) > 1 else 7)
n = lambda v: str(round(v))

def segmentos(pts, d0, d1, f=.36):
    """Curva suave (Catmull-Rom) pelos pontos, saindo na direção d0 e chegando na direção d1."""
    tg = []
    for i, p in enumerate(pts):
        if i == 0: L = math.dist(p, pts[1]); tg.append((d0[0] * L, d0[1] * L))
        elif i == len(pts) - 1: L = math.dist(p, pts[-2]); tg.append((d1[0] * L, d1[1] * L))
        else: tg.append(((pts[i + 1][0] - pts[i - 1][0]) * .5, (pts[i + 1][1] - pts[i - 1][1]) * .5))
    return [(pts[i], (pts[i][0] + tg[i][0] * f, pts[i][1] + tg[i][1] * f),
             (pts[i + 1][0] - tg[i + 1][0] * f, pts[i + 1][1] - tg[i + 1][1] * f), pts[i + 1]) for i in range(len(pts) - 1)]

def ponto(s, t):
    a, b, c, d = s; u = 1 - t
    p = tuple(u**3 * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t**3 * d[k] for k in (0, 1))
    v = tuple(3 * u * u * (b[k] - a[k]) + 6 * u * t * (c[k] - b[k]) + 3 * t * t * (d[k] - c[k]) for k in (0, 1))
    return p, math.atan2(v[1], v[0])

def fio(segs, w=3.6):
    d = f'M{n(segs[0][0][0])} {n(segs[0][0][1])}' + ''.join(f'C{n(b[0])} {n(b[1])} {n(c[0])} {n(c[1])} {n(e[0])} {n(e[1])}' for _, b, c, e in segs)
    return f'<path d="{d}" fill="none" stroke="{COR}" stroke-width="{w}" stroke-linecap="round"/>'

def espinho(p, ang, L, curva, w, limites=None):
    """Lâmina curva que nasce em p, aponta para ang e afina até a ponta."""
    dx, dy = math.cos(ang), math.sin(ang); px, py = -dy, dx
    tip = (p[0] + dx * L, p[1] + dy * L)
    ctrl = (p[0] + dx * L * .5 + px * curva * L, p[1] + dy * L * .5 + py * curva * L)
    b1, b2 = (p[0] + px * w / 2, p[1] + py * w / 2), (p[0] - px * w / 2, p[1] - py * w / 2)
    c1, c2 = (ctrl[0] + px * w * .28, ctrl[1] + py * w * .28), (ctrl[0] - px * w * .28, ctrl[1] - py * w * .28)
    if limites:
        x0, y0, x1, y1 = limites
        if any(not (x0 <= q[0] <= x1 and y0 <= q[1] <= y1) for q in (tip, c1, c2, b1, b2)): return '', None
    meio = (.25 * p[0] + .5 * ctrl[0] + .25 * tip[0], .25 * p[1] + .5 * ctrl[1] + .25 * tip[1])
    return f'<path d="M{n(b1[0])} {n(b1[1])}Q{n(c1[0])} {n(c1[1])} {n(tip[0])} {n(tip[1])}Q{n(c2[0])} {n(c2[1])} {n(b2[0])} {n(b2[1])}Z"/>', (meio, ang)

def espinhos(segs, qtd, lim, comp=(28, 92), larg=(4.5, 8.5)):
    out = []
    for _ in range(qtd):
        p, a = ponto(rnd.choice(segs), rnd.uniform(.08, .92))
        lado = rnd.choice((-1, 1))
        ang = a + lado * math.radians(rnd.uniform(38, 128))
        L = rnd.uniform(*comp) * (1 if rnd.random() < .7 else .55)
        s, galho = espinho(p, ang, L, rnd.uniform(.12, .42) * rnd.choice((-1, 1)), rnd.uniform(*larg), lim)
        out.append(s)
        if galho and L > 36 and rnd.random() < .75:       # espinho menor nascendo do meio do maior
            out.append(espinho(galho[0], galho[1] + rnd.choice((-1, 1)) * math.radians(rnd.uniform(40, 80)), L * rnd.uniform(.35, .6),
                               rnd.uniform(.15, .4) * rnd.choice((-1, 1)), rnd.uniform(4, 6), lim)[0])
    return ''.join(out)

def borda():
    """Trecho de borda de cima (0..T): 3 fios que entram e saem nas mesmas alturas, trocando de lugar no meio."""
    fim = list(JUNTAS); rnd.shuffle(fim)
    out, todos = [], []
    for j, yj in enumerate(JUNTAS):
        pts = [(0, CL + yj), (T * .33, CL + rnd.uniform(-22, 22)), (T * .67, CL + rnd.uniform(-22, 22)), (T, CL + fim[j])]
        s = segmentos(pts, (1, 0), (1, 0)); todos += s; out.append(fio(s))
    return ''.join(out) + f'<g fill="{COR}">' + espinhos(todos, 17, (4, 3, T - 4, C - 60), comp=(22, 68)) + '</g>'

def canto():
    """Canto superior esquerdo (0..C): os fios vêm da direita, dão a volta com laços e descem pela esquerda."""
    fim = list(JUNTAS); rnd.shuffle(fim)
    out, todos = [], []
    for j, yj in enumerate(JUNTAS):
        r = rnd.uniform(-16, 16)
        pts = [(C, CL + yj), (168 + rnd.uniform(-14, 14), CL + rnd.uniform(-26, 26)), (112 + rnd.uniform(-12, 12), CL + rnd.uniform(-30, 24))]
        if j == 1: pts += [(CL - 26, CL - 30), (CL - 34, CL + 22), (CL + 34, CL + 30), (CL + 26, CL - 26), (CL - 8, CL - 6)]   # laço na quina
        else: pts += [(CL + 18 + r, CL + 18 + r)]
        pts += [(CL + rnd.uniform(-30, 24), 112 + rnd.uniform(-12, 12)), (CL + rnd.uniform(-26, 26), 168 + rnd.uniform(-14, 14)), (CL + fim[j], C)]
        s = segmentos(pts, (-1, 0), (0, 1)); todos += s; out.append(fio(s))
    lim = (3, 3, C - 5, C - 5)
    grandes = ''.join(espinho((CL + ox, CL + oy), math.radians(a), L, cv, 11, lim)[0] for ox, oy, a, L, cv in
                      [(-6, -6, 225, 62, .08), (8, -14, 268, 50, -.2), (-14, 8, 182, 50, .2), (20, 20, 45, 96, .22), (34, 6, 20, 70, -.3), (6, 34, 70, 70, .3)])
    return ''.join(out) + f'<g fill="{COR}">' + espinhos(todos, 54, lim) + grandes + '</g>'

def brasao():
    """Ornamento central (320x200, eixo em x=160): metade gerada e espelhada, com duas agulhas compridas para baixo."""
    cx, base = 160, 46
    meio = []
    for i in range(17):                                   # leque de lâminas saindo do centro
        a = math.radians(-172 + i * 20 + rnd.uniform(-9, 9))
        L = rnd.uniform(60, 150) if math.sin(a) < .5 else rnd.uniform(40, 90)
        s, g = espinho((cx - rnd.uniform(4, 30), base + rnd.uniform(-10, 26)), a, L, rnd.uniform(.12, .4) * rnd.choice((-1, 1)), rnd.uniform(5, 8), (4, 2, cx + 2, 196))
        meio.append(s)
        if g:
            for _ in range(3):
                meio.append(espinho(g[0], g[1] + rnd.choice((-1, 1)) * math.radians(rnd.uniform(35, 85)), L * rnd.uniform(.3, .55),
                                    rnd.uniform(.15, .4) * rnd.choice((-1, 1)), rnd.uniform(4, 6), (4, 2, cx + 2, 196))[0])
    laco = fio(segmentos([(cx, base - 22), (cx - 34, base - 6), (cx - 52, base + 26), (cx - 22, base + 40), (cx - 8, base + 14), (cx, base + 60)], (-1, 0), (0, 1)), 4)
    agulha = espinho((cx - 20, base + 10), math.radians(96), 138, -.05, 9)[0] + espinho((cx - 7, base + 20), math.radians(92), 84, .04, 7)[0]
    metade = f'<g id="m" fill="{COR}">' + ''.join(meio) + agulha + laco + '</g>'
    return metade + f'<use href="#m" transform="translate({2 * cx} 0) scale(-1 1)"/>'

S = 2 * C + T
moldura = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="0 0 {S} {S}"><defs><g id="c">{canto()}</g><g id="e">{borda()}</g></defs>'
  f'<use href="#c"/><use href="#c" transform="translate({S} 0) scale(-1 1)"/>'
  f'<use href="#c" transform="translate(0 {S}) scale(1 -1)"/><use href="#c" transform="translate({S} {S}) scale(-1 -1)"/>'
  f'<use href="#e" transform="translate({C} 0)"/><use href="#e" transform="translate({C} {S}) scale(1 -1)"/>'
  f'<use href="#e" transform="matrix(0 1 1 0 0 {C})"/><use href="#e" transform="matrix(0 1 -1 0 {S} {C})"/></svg>')
b = brasao()
open('assets/images/sigilo.svg', 'w', encoding='utf-8', newline='\n').write(moldura + '\n')
open('assets/images/sigilo-brasao.svg', 'w', encoding='utf-8', newline='\n').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200">{b}</svg>\n')
open('assets/images/sigilo-brasao-baixo.svg', 'w', encoding='utf-8', newline='\n').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"><g transform="translate(0 200) scale(1 -1)">{b}</g></svg>\n')
print('ok', len(moldura), len(b))
