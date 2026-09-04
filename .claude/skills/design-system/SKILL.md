---
name: design-system
description: Tokens de cor, tipografia, espaçamento e padrões de componentes extraídos do modelo de referência (Revio) para manter consistência visual em toda a landing page da GJM Tech. Use sempre que for estilizar uma nova seção, componente ou página.
---

# Design System — GJM Tech Landing Page

Tokens extraídos por amostragem de pixel dos frames do vídeo de referência (template Revio). Valores são **aproximados** — ajustar quando houver guia de marca oficial da GJM Tech ou assets em maior resolução.

## Cores

### Base

| Token | Valor | Uso |
|---|---|---|
| `--bg-dark` | `#0A0A0A` | Fundo do hero e de seções escuras (ex: "app mobile") |
| `--bg-white` | `#FFFFFF` | Fundo das seções claras |
| `--bg-card-light` | `#F3F3F4` | Fundo de cards em seções claras (feature cards) |
| `--text-dark` | `#111111` | Texto principal sobre fundo claro |
| `--text-white` | `#FFFFFF` | Texto principal sobre fundo escuro |
| `--text-muted` | `#6B6B6B` | Texto secundário / parágrafos sobre fundo claro |
| `--text-muted-dark` | `#A0A0A0` | Texto secundário sobre fundo escuro |

### Marca / ação

> **Atualizado a partir das logos oficiais** (`assets/images/logo.jpg` e `assets/images/logo_produto.png`).
> A marca da GJM Tech é **azul**, não o roxo do Revio. O roxo `#6D4AEB` do template de referência
> foi substituído — usar apenas os valores abaixo.

| Token | Valor | Uso |
|---|---|---|
| `--brand-primary` | `#0A63E0` | Botões de CTA principais ("Fale com o nosso time"), links de ação |
| `--brand-primary-hover` | `#0850B8` | Hover do CTA |
| `--brand-bright` | `#3B8BFF` | Eyebrow/labels e detalhes sobre fundo escuro (o azul claro do "M" da logo) |
| `--brand-deep` | `#0D43A3` | Fim de gradiente, sombras coloridas |

Contraste: `#0A63E0` com texto branco = ~5.4:1 → passa WCAG AA para texto normal.

### Acento (ícones de feature / elemento decorativo do hero)

| Token | Valor | Uso |
|---|---|---|
| `--accent-mint` | `#9FD8D6` | Face do elemento 3D do hero |
| `--accent-coral` | `#F4948F` | Borda/lateral do elemento 3D do hero |
| `--accent-green` | `#3FB68A` | Ícone de feature (ex: "Nota Fiscal" ou "Controle de Caixa") |
| `--accent-lavender` | `#D9C2FB` | Ícone de feature (fundo claro) |
| `--accent-pink` | `#F3D6F5` | Ícone de feature (fundo claro) |
| `--accent-grey-dark` | `#2C2C2E` | Ícone de feature (fundo escuro/neutro) |

## Tipografia

- Fonte: sans-serif geométrica estilo **Inter / Inter Tight** (a referência usa Inter Tight). Usar `Inter` do Google Fonts como substituto direto e próximo.
- Hierarquia observada:
  - **H1 (hero)**: ~56–64px, bold/extrabold, line-height apertado (~1.05)
  - **H2 (seção)**: ~40–48px, bold
  - **Body**: ~16–18px, regular, cor `--text-muted`
  - **Label/eyebrow** (ex: "Core Features"): ~13–14px, medium, cor `--brand-primary`, com um pequeno ícone antes do texto

## Espaçamento e layout

- Largura máxima do conteúdo: ~1170–1200px, centralizado
- Padding lateral: ~24px no mobile / ~130px no desktop (bem generoso nas laterais — característica marcante do template)
- Border-radius padrão: `12px`–`16px` (cards, botões, badges)
- Grid de feature cards: 4–5 colunas no desktop → 1 coluna no mobile, gap ~24px
- Sombra padrão de card: sutil — `0 4px 20px rgba(0,0,0,0.06)`

## Padrões de componente

- **Botão primário**: fundo `--brand-primary`, texto branco, radius 10px, padding ~12px 20px, ícone de seta "→" à direita
- **Badge/eyebrow**: pequeno ponto/ícone colorido + texto cinza claro, usado acima de títulos de seção
- **Card flutuante (hero)**: radius 16px, sombra pronunciada, leve profundidade/inclinação (não totalmente flat) — na referência há 2 cards flutuantes no hero (um escuro tipo cartão, outro claro tipo "saldo em conta")
- **Header**: fixo/sticky; transparente no topo do hero, ganha fundo escuro semi-opaco + leve blur ao rolar

## Logos

| Arquivo | Uso |
|---|---|
| `assets/images/logo.jpg` | Logo institucional GJM Tech — header e footer |
| `assets/images/logo_produto.png` | Logo do produto GJM Gestão — seção do produto |

> ⚠️ Ambas as logos têm **fundo escuro chapado embutido** no arquivo (não são transparentes).
> Por isso só podem ser usadas sobre superfícies escuras (`--bg-dark` ou cards escuros).
> Ao usar sobre fundo claro, colocar dentro de um container escuro com `border-radius`.
> Quando o usuário fornecer versões em PNG transparente ou SVG, remover essa restrição.

## Responsivo

- Breakpoint mobile: `< 768px`
- Menu vira drawer lateral (ícone de hambúrguer no canto direito do header)
- Grids de 4–5 colunas colapsam para 1 coluna, empilhadas
- Elemento decorativo 3D do hero (ver skill `parallax-hero-effect`) é **removido no mobile**, não apenas escondido visualmente — os 2 cards do hero ficam simplesmente empilhados, sem ele
