# DJ Laroca — site v3

Prévia da nova versão do [djlaroca.com.br](https://djlaroca.com.br/): site estático (HTML, CSS e JS puros, sem build).

- **Prévia online:** https://larocalucas.github.io/djlaroca-v3/
- **Rodar local:** `python -m http.server 8765` e abrir http://127.0.0.1:8765/

## Estrutura
- `index.html` — todo o conteúdo (agenda: uma `<tr>` por data em `#agenda`)
- `css/style.css` — layout e paleta roxa
- `js/ink.js` — efeito de tinta do hero (WebGL): a logo glitch vira a gótica
- `js/main.js` — menu, relógio, entradas de texto, galeria, cursor
- `assets/images/galeria/foto-NNN.jpg` — fotos; ao adicionar, atualize `data-total` em `.fotos`
