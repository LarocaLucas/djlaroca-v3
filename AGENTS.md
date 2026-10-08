# DJ Laroca v3 — caderno de bordo

## Diretrizes
- Site estático sem build: HTML, CSS e JS puros. Sem dependências.
- Referências: layout "DJ ZakDerdan" e efeito "Hover Ink" (motionsites.ai). Paleta roxa da v2 (`#9b30ff`, `#d966ff` sobre `#060408`), fonte Inter Tight.
- Conteúdo vem da v2 (`E:\Arquivos\Projetos\DJ Laroca v2.0`). WhatsApp (42) 99988-4992.
- Posicionamento (dono, 08/10): artista **nacional**, não regional; mais de 50 shows nacionais; o set é uma mescla de funk, rave funk, ritmada, bruxaria e nostalgia. Castro/Paraná só aparece no histórico. Player: playlist do Spotify (o SoundCloud está pouco populado).
- Logos: `assets/images/logo-glitch.webp` (visível) e `logo-gotica.webp` (revelada pela tinta), ambas num quadro 2048x1152 com o corpo das letras centralizado. Os PNG originais ficam na raiz, fora do git.
- Commits em Conventional Commits (pt-BR). Repositório público `LarocaLucas/djlaroca-v3`.
- **Este é o site oficial.** Publicação: Cloudflare Pages, projeto `djlaroca-v3`, automática a cada push na `main` **por meio da action `.github/workflows/publicar.yml`** (o aviso nativo do Cloudflare não funciona neste repositório); domínios `djlaroca.com.br` e `www`. Todo push vai ao ar: testar antes.

## Estado atual
- No ar em https://djlaroca.com.br/ desde 08/10/2026 (v0.2.0). GitHub Pages desativado.
- Agenda real em `agenda.json` (o dono edita pelo GitHub; ver README).
- Repositório antigo `LarocaLucas/djlaroca` privado e arquivado. O projeto antigo `djlaroca` do Cloudflare Pages continua existindo, sem domínio (pode ser apagado quando o dono quiser).

## Registro
### 08/10/2026 — Claude Code (publicação automática)
- **Problema:** depois de criado pela API, o projeto `djlaroca-v3` do Cloudflare Pages não publicava sozinho a cada push: só a primeira publicação (manual) tinha entrado, e os commits da v0.2.0 e do SEO ficaram fora do ar por horas.
- **Solução:** `.github/workflows/publicar.yml` dispara a publicação a cada push na `main`, chamando um gancho do Cloudflare guardado no segredo `CF_DEPLOY_HOOK` do repositório. Testado: o push da própria action gerou publicação do tipo `deploy_hook` com sucesso. Causa provável (não confirmada): o app do Cloudflare no GitHub não tem acesso a este repositório, criado depois da instalação.
- **Como conferir:** listar as publicações do projeto e ver se o commit mais recente aparece. Publicação manual: `POST /accounts/{id}/pages/projects/djlaroca-v3/deployments` com `branch=main`.
### 08/10/2026 — Claude Code (SEO local)
- **Motivo:** o dono buscou "dj em castro pr" no Google e o DJ Reinaldo apareceu, o DJ Laroca não. A copy nacional tinha tirado Castro e Ponta Grossa do título, da descrição e do texto; voltaram, sem abandonar o posicionamento nacional ("base em Castro e Ponta Grossa, PR; shows em todo o Brasil").
- **SEO (feito):** título e descrição com "DJ em Castro e Ponta Grossa, PR", dados estruturados (`WebSite` + negócio com endereço em Castro/PR e área atendida), `robots.txt`, `sitemap.xml`, `404.html` (antes qualquer endereço inexistente devolvia a página inicial com código 200) e, no Cloudflare, regra de redirecionamento 301 de `www` para o domínio raiz.
- **SEO (depende do dono, exige login na conta Google):** criar a propriedade de domínio no Google Search Console, passar o código `google-site-verification` para entrar no DNS (Cloudflare), enviar o sitemap e pedir indexação da página inicial; criar ou reivindicar o Perfil da Empresa no Google (é o que mais pesa em buscas locais como "dj em castro pr").
- **Arquivos:** `index.html`, `robots.txt`, `sitemap.xml`, `404.html`.
- **Testes:** JSON-LD válido (parse), título com 70 caracteres e descrição com 138; no ar: robots, sitemap, 404 e redirecionamento do `www` conferidos por HTTP. Não testado: Rich Results Test do Google.
- **Próximo passo:** dono fazer a parte do Search Console e do Perfil da Empresa.
### 08/10/2026 — Claude Code (site no ar)
- **Feito:** a pedido do dono, a v3 foi ao ar em djlaroca.com.br. O projeto antigo do Cloudflare Pages não aceita trocar de repositório (o PATCH é ignorado), então foi criado o projeto `djlaroca-v3` ligado a este repositório; os domínios `djlaroca.com.br` e `www` saíram do projeto antigo e entraram no novo, e os dois CNAME passaram a apontar para `djlaroca-v3.pages.dev`. Adicionados `_headers` (cache e segurança; `agenda.json` sem cache) e `_redirects`. GitHub Pages deste repositório desativado. Repositório antigo `LarocaLucas/djlaroca` tornado privado e arquivado.
- **Arquivos:** `_headers`, `_redirects`, `README.md`, `CHANGELOG.md`.
- **Testes:** `djlaroca.com.br` e `www` servem a v3 (main.js v3.1.7), `agenda.json`, vídeo e moldura respondem 200. O domínio levou cerca de 3,5 min para trocar. Observação: `www` responde direto, sem redirecionar para a raiz (o `_redirects` do Pages não faz redirecionamento por domínio).
- **Próximo passo:** testar em celular real; decidir se apaga o projeto antigo `djlaroca` do Cloudflare.
### 08/10/2026 — Claude Code (corte abaixo da agenda)
- **Feito:** o dono aprovou a moldura sigilo ("agora sim"). Corrigido o corte na base da agenda: a moldura e o brilho dos cartões de baixo passavam da caixa da seção (que não tinha respiro embaixo) e a seção do histórico, com fundo opaco e por cima, cortava. `.agenda` ganhou `padding-bottom: 48px` e o topo do histórico encolheu para compensar.
- **Arquivos:** `css/style.css`, `index.html`.
- **Testes:** Chrome 1440x700: última fileira com hover simulado, brilho inteiro, 52px de folga até o fim da seção. Não testado: celular.
- **Próximo passo:** avaliação do dono.
### 08/10/2026 — Claude Code (moldura "sigilo")
- **Feito:** o dono deixou nova referência na raiz (`stock-vector-neo-tribal-*.jpg`, banco de imagens com marca d'água; fora do git e **não pode ser usada**, só o estilo). Os cartões futuros agora usam uma moldura própria no mesmo estilo (ramos finos emaranhados com espinhos curvos, ornamento no meio de cima e de baixo), gerada por `extras/molduras/gerar_sigilo.py` (semente 7) em `assets/images/sigilo.svg` e `sigilo-brasao*.svg`. O arame farpado saiu de uso e ficou guardado em `extras/molduras/`.
- **Arquivos:** `extras/molduras/gerar_sigilo.py` (novo), `assets/images/sigilo*.svg` (novos), `css/style.css`, `index.html`, `.gitignore`, `extras/molduras/LEIA-ME.md`.
- **Testes:** Chrome 1440x900: moldura nos 7 cartões futuros, sem cobrir textos nem encostar nos vizinhos, 5 colunas, sem rolagem horizontal. Não testado: celular, hover real.
- **Próximo passo:** avaliação do dono.
### 08/10/2026 — Claude Code (arame farpado gótico)
- **Feito:** a pedido do dono, os cartões futuros agora são envolvidos por arame farpado em estilo gótico (par de fios trançados, farpas em forma de chama como as serifas da logo, laço nos cantos e um ramo curto entrando no cartão), SVG embutido em `.dia.futuro::before`. A moldura gótica anterior, de que ele gostou, ficou guardada em `extras/molduras/` (com o brasão e um LEIA-ME de uso). Removida a foto flutuante ao passar o mouse nas datas (HTML, CSS e JS). O dono confirmou que a iluminação do hover ficou certa.
- **Arquivos:** `css/style.css`, `js/main.js`, `index.html`, `extras/molduras/*` (novo).
- **Testes:** Chrome 1440x900: arame nos 7 cartões futuros sem encostar nos vizinhos nem cobrir textos, 5 colunas, sem rolagem horizontal, console sem erros. Não testado: celular, hover real com mouse.
- **Próximo passo:** avaliação do dono.
### 08/10/2026 — Claude Code (moldura gótica, luz do hover corrigida)
- **Feito:** o dono reprovou a moldura anterior ("não combina nem com gótico nem com cyberpunk", quer mais gótico; os overlays são só referência). Nova moldura SVG em `.dia.futuro::before`: duas linhas finas que se cruzam e passam do canto em agulha, arcos finos, espinhos e agulha diagonal nos cantos; bordas lisas; brasão (adaga com asas) no meio do topo em `::after`. Sem fundo preenchido no cartão.
- **Causa da "luz quadrada" do hover:** a máscara do crescimento (permanente) cortava o `drop-shadow` no retângulo do elemento. Agora a máscara só existe dentro do `@keyframes cresce` e vira `none` no fim; o brilho do hover é só `drop-shadow` das linhas. `mask-clip: no-clip` foi testado e não resolveu no Chrome.
- **Arquivos:** `css/style.css`, `index.html`. Gerador do SVG ficou só no scratchpad da sessão (o SVG está embutido no CSS).
- **Testes:** Chrome 1440x900 e 900x640 @2x: moldura nos 7 cartões futuros, hover simulado por classe com brilho suave sem corte. Não testado: hover real com mouse, celular.
- **Próximo passo:** avaliação do dono sobre o desenho.
### 08/10/2026 — Claude Code (moldura original)
- **Feito:** o dono não quis o recorte do overlay dele ("quero que crie algo baseado nele") e reclamou da luz quadrada no hover. A moldura dos cartões futuros agora é um desenho original em SVG, embutido no CSS (`.dia.futuro::before`): cantos chanfrados, três linhas de circuito, lâminas góticas, gavinhas e estrelas, com losangos repetidos nas bordas. Fundo e luz do hover ficam em `::after`, recortados no mesmo chanfro da linha principal (`--bw` = tamanho do canto); halo reduzido para acompanhar as linhas. `assets/images/moldura.webp` removida.
- **Regra:** os overlays do dono (`Overlay BAD*.png`, fora do git) são referência de estilo, não material para recortar.
- **Arquivos:** `css/style.css`, `index.html`, `assets/images/moldura.webp` (removido).
- **Testes:** Chrome 900x640 @2x: moldura nos 7 cartões futuros; hover simulado por classe mostra luz chanfrada. Não testado: hover real com o mouse, celular.
- **Próximo passo:** avaliação do dono.
### 08/10/2026 — Claude Code (moldura do overlay do dono)
- **Feito:** o dono não gostou da moldura de espinhos e deixou dois overlays de referência na raiz (`Overlay BAD Laroca *.png`, fora do git). A moldura dos cartões futuros agora é `assets/images/moldura.webp`: canto superior esquerdo + trechos lisos das bordas do overlay branco, espelhados (sem o "LAROCA"), usada como `border-image` de 9 fatias em `.dia.futuro::before`, com brilho roxo; continua crescendo dos cantos, pulsando e reagindo ao hover. Cartões futuros perderam a borda arredondada própria; espaço entre cartões maior.
- **Arquivos:** `assets/images/moldura.webp` (novo), `css/style.css`, `index.html`, `.gitignore`.
- **Testes:** Chrome 1440x900: moldura nos 7 cartões futuros, 5 colunas, sem rolagem horizontal. Não testado: celular.
- **Próximo passo:** avaliação do dono.
### 08/10/2026 — Claude Code (moldura de espinhos, glitch suavizado, faixa contínua)
- **Feito:** as garras de canto deram lugar a uma moldura gótica de espinhos em volta do cartão inteiro (`border-image` com SVG embutido no CSS, em `.dia.futuro::before`), que cresce a partir dos quatro cantos (`@property --cresce` + máscara radial), pulsa e aperta no hover. Glitch dos cartões passados suavizado (deslocamentos em ~2/3, ciclo 2,6 s, sem inversão de cor). Faixa de estilos: 4 cópias idênticas e animação de exatamente 1/4 da largura, sem emenda.
- **Atenção:** o SVG do `border-image` precisa de `width`/`height`; sem isso o recorte (`40`) sai errado e a borda vira uma faixa chapada.
- **Arquivos:** `index.html`, `css/style.css`, `js/main.js`.
- **Testes:** Chrome: moldura nos 7 cartões futuros, 4 cópias da faixa com a mesma largura (3243,8px = 1/4 do total). Não testado: celular; Firefox/Safari (crescimento da moldura depende de `@property`; sem suporte ela aparece direto).
- **Próximo passo:** avaliação do dono.
### 08/10/2026 — Claude Code (garras góticas, glitch no cartão inteiro)
- **Feito:** cartões de datas futuras ganham garras góticas (SVG `#garra` no `index.html`, 4 por cartão) que crescem dos cantos ao aparecer, "respiram" e apertam no hover; cartões de datas passadas falham inteiros (tremor, quadros fantasmas e todos os textos com glitch); conteúdo padronizado (local em cima, cidade embaixo); vídeo do hero no celular mais escuro (brilho .36).
- **Arquivos:** `index.html`, `css/style.css`, `js/main.js`.
- **Testes:** Chrome 1440x900: garras nos 7 cartões futuros, glitch de bloco nos 2 passados, sem rolagem horizontal. Não testado: celular nesta rodada (tamanho das garras em cartão estreito, escurecimento do vídeo).
- **Próximo passo:** avaliação do dono.
### 08/10/2026 — Claude Code (glitch mais forte, faixa mais rápida, cartões)
- **Feito:** glitch das datas passadas mais forte e frequente (ciclo de 1,7 s, deslocamentos maiores); faixa de estilos em 9 s por volta; título "Conheça um pouco do estilo musical do Laroca" acima da playlist; cartões da agenda sem vazamento (mês e dia da semana empilhados, cabeçalho pode quebrar linha).
- **Correção:** os degradês roxos de `.som` e `.contato` estavam cobertos de preto desde a rodada das transições, porque `main > section:not(.hero)` tem especificidade maior que `main > .som`; agora são `main > section.som` e `main > section.contato`.
- **Arquivos:** `css/style.css`, `js/main.js`, `index.html`.
- **Testes:** Chrome 1440x900: nenhum elemento fora dos cartões em larguras de 227 a 360px, degradês de volta, sem rolagem horizontal. Não testado: celular nesta rodada.
- **Próximo passo:** avaliação do dono.
### 08/10/2026 — Claude Code (agenda em cartões, glitch, vídeo no celular)
- **Feito:** agenda agrupada em um cartão por dia (15 shows viram 9 cartões + "Sua data"); dia passado fica apagado, com glitch no número e nos nomes, e vira "Realizado". Incluídas as datas de 02 e 03/10. No celular o hero usa o vídeo da v2 de fundo (o JS só carrega o vídeo em telas até 820px; no computador fica a foto). Faixa de estilos mais rápida (17 s). Hero no celular: as duas etiquetas em linhas separadas, sem quebrar o "]".
- **Correções:** (1) a logo ficava em branco se a página abrisse já rolada e a pessoa voltasse ao topo: a tinta agora redesenha ao rolar de volta ao hero; (2) sobra lateral de 15px no celular causada pelos títulos que deslizam: seções com `overflow-x: clip`.
- **Arquivos:** `agenda.json`, `index.html`, `css/style.css`, `js/main.js`, `js/ink.js`, `assets/videos/hero-video.mp4`, `assets/images/hero-poster.jpg`, `README.md`.
- **Testes:** Chrome 1440x900 e 390x844: cartões, glitch visível, vídeo tocando no celular, logo de volta ao rolar ao topo, sem rolagem horizontal. Não testado: iPhone real.
- **Próximo passo:** avaliação do dono.
### 08/10/2026 — Claude Code (agenda real e mais animações)
- **Feito:** agenda passa a vir de `agenda.json` (aviso + datas; 12 shows de outubro/2026), montada pelo `js/main.js`; datas passadas ficam apagadas como "Realizado". Hero: "DJ de funk // open format // cena nacional". Animações novas: frase do "sobre" acende palavra a palavra conforme a rolagem, números contam até o valor, faixa de texto correndo, títulos "A mescla"/"Sua pista" e a capa se movem com a rolagem, títulos de seção se revelam da esquerda, linhas das listas entram em sequência, fotos da mesa são jogadas uma a uma, agenda sobe com cantos arredondados sobre o degradê.
- **Arquivos:** `agenda.json` (novo), `index.html`, `css/style.css`, `js/main.js`, `README.md`.
- **Testes:** Chrome 1440x900: agenda com 12 datas + linha livre, aviso, todos os blocos revelados ao rolar, sem rolagem horizontal, console sem erros. Não testado: celular; caso de `agenda.json` inválido.
- **Próximo passo:** avaliação do dono.
### 08/10/2026 — Claude Code (fluidez e mais fotos)
- **Feito:** galeria com 15 posições no desktop (3 fileiras) e 8 no celular, troca a cada 1,8 s. Transições: hero fixo (sticky) que escurece enquanto as seções sobem por cima dele; blocos de cada seção entram subindo e saindo do desfoque; linhas das listas sobem ao aparecer. Com o hero sticky, a tinta passa a checar a rolagem (não mais IntersectionObserver) para parar quando o hero está coberto.
- **Arquivos:** `index.html`, `css/style.css`, `js/main.js`, `js/ink.js`.
- **Testes:** Chrome 1440x900: cortina do hero, galeria cheia, todos os blocos revelados ao rolar a página inteira, sem rolagem horizontal. Não testado: celular.
- **Próximo passo:** avaliação do dono.
### 08/10/2026 — Claude Code (conteúdo e galeria)
- **Feito:** copy reescrita com posicionamento nacional (hero, sobre, estilos, histórico, contato, metadados); números atualizados (50+ shows nacionais); estilos viraram funk, rave funk, ritmada, bruxaria e nostalgia; player trocado do SoundCloud para a playlist do Spotify; galeria refeita como fotos espalhadas (9 posições no desktop, 6 no celular) que trocam sozinhas a cada 2,4 s, sem botão "ver todas" (clicar ainda amplia).
- **Arquivos:** `index.html`, `css/style.css`, `js/main.js`.
- **Testes:** Chrome a 929 px de largura: fotos trocando, sem rolagem horizontal. Não testado: celular, clique para ampliar, player do Spotify carregando.
- **Próximo passo:** avaliação do dono; as descrições de ritmada e bruxaria foram escritas por mim e precisam da conferência dele.
### 08/10/2026 — Claude Code (ajuste 4)
- **Feito:** tinta mais leve, a pedido do dono ("ainda está pesado"; não disse se era no visual ou no desempenho, então tratei os dois). Desempenho: no máximo ~60 quadros/s (antes desenhava a 240), canvas só na faixa em volta da logo, DPR até 1,25. Visual: tinta mais translúcida (0,68) e traço um pouco mais fino. A tinta agora só aparece perto da logo, sumindo suave nas bordas da faixa.
- **Arquivos:** `js/ink.js`, `css/style.css`, `index.html` (versão dos arquivos).
- **Testes:** Chrome 1440x900, movimento contínuo simulado, console sem erros. Não medido: uso de GPU; celular nesta rodada.
- **Próximo passo:** o dono dizer se o "pesado" que resta é travamento ou aparência.
### 08/10/2026 — Claude Code (ajuste 3)
- **Feito:** logo centralizada na vertical do hero. Tinta refeita: rastro que engrossa com a velocidade, borda ondulada, brilho leve de líquido, translúcida, poucas gotas, sem respingos. Corrigido defeito em monitores de alta taxa (241 fps nesta máquina): o recuo por quadro ficava abaixo de 1/255 e a máscara de 8 bits nunca apagava, então a tinta acumulava; agora recua em passos de 1/30 s.
- **Arquivos:** `js/ink.js`, `css/style.css`, `index.html` (versão dos arquivos).
- **Testes:** Chrome 1440x900 a 241 fps, movimento contínuo simulado: rastro some, sem resíduo, console sem erros. Não testado: celular nesta rodada.
- **Próximo passo:** avaliação do dono sobre a tinta nova.
### 08/10/2026 — Claude Code (ajuste 2)
- **Feito:** logo do hero no meio-termo e centralizada (desktop: até 1060px / 76vw; celular: 90%). O dono achou 100% grande demais e 760px pequeno demais.
- **Arquivos:** `css/style.css`.
- **Testes:** medido na prévia online em 1440x900 e 390x844. Resultado: ok.
- **Próximo passo:** seguir ouvindo a avaliação do dono.
### 08/10/2026 — Claude Code (ajuste)
- **Feito:** logo do hero reduzida a pedido do dono (desktop: até 760px / 56vw; celular: 74% da largura).
- **Arquivos:** `css/style.css`.
- **Testes:** conferido na prévia online em 1440x900 e 390x844. Resultado: ok.
- **Próximo passo:** seguir ouvindo a avaliação do dono.
### 08/10/2026 — Claude Code
- **Feito:** primeira versão completa: hero com tinta WebGL trocando as duas logos, sobre, estilos + player do SoundCloud, agenda (exemplo), histórico, galeria com visor, contato. Repositório criado e Pages ativado.
- **Arquivos:** `index.html`, `css/style.css`, `js/ink.js`, `js/main.js`, `assets/`.
- **Testes:** Chrome 1440x900 e 390x844 (toque): tinta, passada automática, player, sem rolagem horizontal, console sem erros. Resultado: ok. Não testado: Safari/iOS real, passada do `impeccable`.
- **Próximo passo:** ouvir a avaliação do dono; trocar a agenda de exemplo pelas datas reais; depois, substituir o site oficial.
