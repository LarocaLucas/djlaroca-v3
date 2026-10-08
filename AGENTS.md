# DJ Laroca v3 — caderno de bordo

## Diretrizes
- Site estático sem build: HTML, CSS e JS puros. Sem dependências.
- Referências: layout "DJ ZakDerdan" e efeito "Hover Ink" (motionsites.ai). Paleta roxa da v2 (`#9b30ff`, `#d966ff` sobre `#060408`), fonte Inter Tight.
- Conteúdo vem da v2 (`E:\Arquivos\Projetos\DJ Laroca v2.0`). WhatsApp (42) 99988-4992.
- Logos: `assets/images/logo-glitch.webp` (visível) e `logo-gotica.webp` (revelada pela tinta), ambas num quadro 2048x1152 com o corpo das letras centralizado. Os PNG originais ficam na raiz, fora do git.
- Commits em Conventional Commits (pt-BR). Repositório público `LarocaLucas/djlaroca-v3`, GitHub Pages na branch `main`.
- O site oficial (repo `LarocaLucas/djlaroca`, domínio djlaroca.com.br) só é substituído quando o dono pedir.

## Estado atual
- v0.1.0 no ar como prévia em https://larocalucas.github.io/djlaroca-v3/
- Agenda com datas de exemplo (aguardando as reais).

## Registro
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
