# DJ Laroca — site oficial (v3)

Site oficial do DJ Laroca: agenda de shows, galeria, vídeos e contato para contratação.

- **Status:** no ar
- **Endereço:** https://djlaroca.com.br/
- **Cliente:** DJ Laroca (dono do site); desenvolvimento pela laroca.dev

## Principais funções

- Hero com efeito de tinta em WebGL: a logo glitch revela a logo gótica.
- Agenda lida de `agenda.json`; datas passadas ficam apagadas, com a situação "Realizado".
- Galeria de fotos, player do Spotify, menu, relógio e cursor personalizado.

## Stack

HTML5, CSS3 e JavaScript puros (WebGL no hero), sem build e sem dependências.

## Estrutura

```
index.html            conteúdo das seções
agenda.json           datas e aviso em destaque
css/style.css         layout e paleta roxa
js/ink.js             efeito de tinta do hero
js/main.js            menu, relógio, galeria, cursor
assets/images/        logos e fotos (galeria/foto-NNN.jpg)
```

## Editar a agenda

Edite `agenda.json` pelo GitHub (lápis → Commit changes). Cada linha de `datas` tem `data` (AAAA-MM-DD), `local`, `cidade` e `situacao`; `aviso` é a mensagem em destaque (vazio esconde). O site atualiza em cerca de um minuto. Ao adicionar fotos, atualize `data-total` em `.fotos` no `index.html`.

## Rodar localmente

```bash
python -m http.server 8765   # abrir http://127.0.0.1:8765/
```

## Publicar

Cloudflare Pages, automático a cada push na `main` pela action `.github/workflows/publicar.yml`. Todo push vai ao ar: teste antes.

## Licença

Proprietário — todos os direitos reservados.

## Contato

Desenvolvido pela [laroca.dev](https://laroca.dev) · contato@laroca.dev
