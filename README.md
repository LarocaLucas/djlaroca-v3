# DJ Laroca — site v3

Prévia da nova versão do [djlaroca.com.br](https://djlaroca.com.br/): site estático (HTML, CSS e JS puros, sem build).

- **Prévia online:** https://larocalucas.github.io/djlaroca-v3/
- **Rodar local:** `python -m http.server 8765` e abrir http://127.0.0.1:8765/

## Estrutura
- `index.html` — conteúdo das seções
- `agenda.json` — datas da agenda e o aviso em destaque (veja abaixo)
- `css/style.css` — layout e paleta roxa
- `js/ink.js` — efeito de tinta do hero (WebGL): a logo glitch vira a gótica
- `js/main.js` — menu, relógio, entradas de texto, galeria, cursor
- `assets/images/galeria/foto-NNN.jpg` — fotos; ao adicionar, atualize `data-total` em `.fotos`

## Como editar a agenda pelo GitHub
1. Abra `agenda.json` no repositório e clique no lápis (Edit this file).
2. Altere só o que está entre aspas:
   - `aviso`: a mensagem em destaque acima da agenda. Deixe `""` para esconder.
   - cada linha de `datas` é um show: `data` (formato `AAAA-MM-DD`), `local`, `cidade` e `situacao`.
3. Para um show novo, copie uma linha inteira e cole abaixo. Todas as linhas terminam com vírgula, **menos a última**.
4. Clique em **Commit changes**. O site atualiza sozinho em cerca de um minuto.

Shows no mesmo dia aparecem juntos num cartão só. Datas que já passaram ficam apagadas, com efeito de glitch e a situação "Realizado", sem precisar editar. Se o arquivo ficar com erro (vírgula ou aspas faltando), o site mostra "Agenda indisponível" até ser corrigido.
