# Molduras guardadas

Desenhos próprios em SVG, feitos para os cartões da agenda. Todos são molduras de 9 fatias (300x300, cantos de 120).

- `moldura-gotica.svg` + `brasao-gotico.svg` — moldura de linhas finas cruzadas, espinhos e brasão no topo. O dono gostou e pediu para guardar (08/10/2026). Não está em uso.
- `arame-farpado.svg` — arame farpado gótico, em uso nos cartões de datas futuras (embutido em `css/style.css`).

## Como usar uma delas
```css
.bloco::before {
  content: ''; position: absolute; inset: -12px; pointer-events: none;
  border: 84px solid transparent;
  border-image: url("extras/molduras/moldura-gotica.svg") 120 / 84px stretch;   /* "round" para o arame */
  filter: drop-shadow(0 0 2px rgba(155, 48, 255, .9)) drop-shadow(0 0 6px rgba(155, 48, 255, .45));
}
/* brasão no meio da borda de cima */
.bloco::after {
  content: ''; position: absolute; inset: -12px; pointer-events: none;
  background: url("extras/molduras/brasao-gotico.svg") center 0 / 112px no-repeat;
}
```
