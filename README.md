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

**Home implementada** — header sticky com dropdowns, drawer mobile, hero com paralaxe,
grid das 4 funcionalidades, seção "Controle total", seção institucional, CTA final e footer.

Próximos passos:

- [ ] `/produtos/gjm-gestao` — página de detalhe do produto
- [ ] `/institucional/quem-somos` — sobre a empresa
- [ ] `/duvidas/contato` — dados de contato / formulário

Os links do menu para essas três páginas já existem no HTML e vão dar 404 até serem criadas.
