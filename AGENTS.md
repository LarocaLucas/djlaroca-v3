# DJ Laroca v3 — caderno de bordo

## Diretrizes
- Site estático sem build: HTML, CSS e JS puros. Sem dependências.
- Referências: layout "DJ ZakDerdan" e efeito "Hover Ink" (motionsites.ai). Paleta roxa da v2 (`#9b30ff`, `#d966ff` sobre `#060408`), fonte Inter Tight.
- Conteúdo vem da v2 (`E:\Arquivos\Projetos\DJ Laroca v2.0`). WhatsApp (42) 99988-4992.
- Posicionamento (dono, 08/10): artista **nacional**, não regional; mais de 50 shows nacionais; o set é uma mescla de funk, rave funk, ritmada, bruxaria e nostalgia. Castro/Paraná só aparece no histórico. Player: playlist do Spotify (o SoundCloud está pouco populado).
- Logos: `assets/images/logo-glitch.webp` (visível) e `logo-gotica.webp` (revelada pela tinta), ambas num quadro 2048x1152 com o corpo das letras centralizado. Os PNG originais ficam na raiz, fora do git.
- Commits em Conventional Commits (pt-BR). Repositório público `LarocaLucas/djlaroca-v3`, GitHub Pages na branch `main`.
- O site oficial (repo `LarocaLucas/djlaroca`, domínio djlaroca.com.br) só é substituído quando o dono pedir.

## Estado atual
- v0.1.0 no ar como prévia em https://larocalucas.github.io/djlaroca-v3/
- Agenda real de outubro/2026 em `agenda.json` (o dono edita pelo GitHub; ver README).

## Registro
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
