# GJM Tech — Landing Page

Landing page institucional da **GJM Tech**, software house focada em soluções de gestão para pequenos e médios negócios.

## Sobre o projeto

Este repositório contém o site institucional da GJM Tech, com foco inicial na divulgação do produto **GJM Gestão** — um sistema de gestão empresarial (ainda em desenvolvimento) voltado para lojas de roupas, gráficas de bairro e pequenos comércios em geral.

O layout, a paleta de cores e a proporção dos elementos seguem como referência visual o template [Revio Landing Page](https://lovable.dev/templates/websites/landing-page/revio-landing-page) — reproduzindo a estrutura, o espaçamento e o efeito de paralaxe do hero, adaptados ao conteúdo e à identidade da GJM Tech.

## Produto: GJM Gestão

Sistema de gestão empresarial em desenvolvimento (MVP). Público-alvo: lojas de roupas, gráficas de bairro e pequenos comércios.

**Funcionalidades do MVP:**
- Controle de caixa
- Controle de estoque
- Emissão de nota fiscal
- Controle de clientes

> ⚠️ O produto ainda não existe — a landing page comunica a proposta de valor e captura interesse/contato antecipado, não vende algo já pronto.

## Estrutura de navegação (header)

| Item | Contém |
|---|---|
| Home | — |
| Produtos | GJM Gestão (único produto por enquanto) |
| Institucional | Quem Somos |
| Dúvidas | Contato |
| **CTA (direita)** | "Fale com o nosso time" |

## Como rodar localmente

O site é estático, mas as imagens ficam em `/assets` (fora de `/src`), então o servidor
precisa apontar para a **raiz do projeto**, não para `src/`:

```bash
python3 -m http.server 5173
# abre em http://localhost:5173/src/index.html
```

## Contato (placeholder)

Como ainda não há um canal de contato oficial definido, todas as referências de contato no site usam placeholders:

- E-mail: `XXXXX@email.com`
- Telefone: `+55 XXXX-XXXX`

Substituir por dados reais antes do lançamento — ver regra em `.claude/skills/content-guidelines/SKILL.md`.

## Design de referência

Os tokens de cor, tipografia e espaçamento extraídos do modelo de referência (vídeo enviado + template Revio) estão documentados em `.claude/skills/design-system/SKILL.md`. O comportamento do efeito de paralaxe do hero está em `.claude/skills/parallax-hero-effect/SKILL.md`.

## Estrutura de pastas

```
/
├── assets/
│   ├── images/
│   │   ├── logo.jpg           # logo institucional GJM Tech
│   │   └── logo_produto.png   # logo do produto GJM Gestão
│   └── hero/                  # (opcional) lampada.png substitui o SVG do hero
├── src/
│   ├── index.html             # Home
│   ├── styles/
│   │   ├── tokens.css         # design tokens
│   │   ├── base.css           # reset + utilitários
│   │   ├── components.css     # header, nav, drawer, botões, footer
│   │   └── home.css           # seções da Home
│   └── scripts/
│       └── main.js
├── .claude/
│   └── skills/
│       ├── design-system/
│       ├── content-guidelines/
│       └── parallax-hero-effect/
├── README.md
└── CLAUDE.md
```

> ⚠️ As duas logos têm **fundo escuro chapado embutido** no arquivo e uma moldura vazia
> larga (o logotipo ocupa só ~70% da largura do arquivo). O CSS recorta essa moldura via
> `.brand` / `.product-showcase__logo`. Versões em PNG transparente ou SVG simplificariam isso.

## Stack técnica

HTML5 + CSS3 + JavaScript (vanilla, ES modules) — sem framework. Landing page estática, sem autenticação nem dados dinâmicos, então não há necessidade de um framework de UI ou de build pesado nesta fase.

Essa foi a stack assumida por ser a opção mais simples e direta para o escopo (site institucional). Se preferir React, Angular ou outra stack, é só avisar que ajusto a documentação e as skills.

## Status

**As 4 páginas estão implementadas.**

| Página | Arquivo | Conteúdo |
|---|---|---|
| Home | `src/index.html` | hero com paralaxe, 4 funcionalidades, "Controle total", institucional, CTA |
| GJM Gestão | `src/produtos/gjm-gestao.html` | público-alvo, as 4 funcionalidades detalhadas com mocks de tela, status do produto |
| Quem Somos | `src/institucional/quem-somos.html` | o que fazemos, 4 princípios, o produto |
| Contato | `src/duvidas/contato.html` | canais diretos, formulário e dúvidas frequentes |

### Pendências conhecidas

- **Dados de contato** — e-mail, telefone e endereço seguem como placeholder. Trocar em
  todas as 4 páginas (o endereço só existe em `duvidas/contato.html`).
- **Envio do formulário** — não há backend. O formulário valida no navegador e avisa que
  o envio não está ativo, em vez de fingir sucesso. Para ligar: definir `ENDPOINT` em
  `src/scripts/main.js` e completar o `TODO` do handler.
- **História da empresa** — ano de fundação, cidade e time não foram informados, então não
  foram escritos. Há um comentário marcando o lugar em `institucional/quem-somos.html`.
- **Header e footer duplicados** nos 4 HTMLs. É proposital: sem build step, duplicar o
  markup mantém a navegação funcionando mesmo sem JS. Ao editar um, editar os quatro.

### Convenções que valem a pena saber

- Os números que aparecem nos mocks de tela são **ilustrativos** e estão rotulados como
  tal na interface. Não são métricas da GJM Tech (ver `content-guidelines`).
- Cada página marca o item ativo do menu com `.nav__trigger.is-active` + `aria-current`.
