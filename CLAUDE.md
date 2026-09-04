# CLAUDE.md

Contexto para o Claude Code trabalhar neste repositório. Leia também os arquivos em `.claude/skills/` — em especial antes de estilizar uma seção nova (`design-system`), escrever qualquer texto (`content-guidelines`) ou mexer no hero (`parallax-hero-effect`).

## O que é este projeto

Landing page institucional da GJM Tech (software house). Site estático, sem backend, sem autenticação, sem banco de dados. Objetivo: apresentar a empresa e o produto GJM Gestão, e capturar contato de interessados via CTA "Fale com o nosso time".

## Idioma

Todo o conteúdo do site é em **português (pt-BR)**. Não gerar textos em inglês, exceto termos técnicos amplamente aceitos (ex: "software house").

## Referência visual

O layout deve seguir de perto (cores, proporções, espaçamento, hierarquia) o template Revio, analisado a partir de um vídeo de walkthrough (desktop + mobile) fornecido pelo usuário e do template público: https://lovable.dev/templates/websites/landing-page/revio-landing-page

Os tokens de design extraídos estão em `.claude/skills/design-system/SKILL.md` — use-os como fonte da verdade. Não inventar cores, tamanhos ou espaçamentos novos sem necessidade real.

## Estrutura do site

- **Home** (`/`) — hero (headline + CTA + elemento decorativo com paralaxe), grid de funcionalidades do GJM Gestão, seção "Take full control..." equivalente adaptada, seção sobre a GJM Tech resumida, CTA final
- **Produtos → GJM Gestão** (`/produtos/gjm-gestao`) — página de detalhe do produto, com as 4 funcionalidades do MVP
- **Institucional → Quem Somos** (`/institucional/quem-somos`) — sobre a empresa
- **Dúvidas → Contato** (`/duvidas/contato`) — dados de contato (placeholders) e/ou formulário

## Regras de conteúdo (resumo — detalhe completo em content-guidelines)

- Contato: usar sempre `XXXXX@email.com` e `+55 XXXX-XXXX` como placeholder até receber dados reais. **Nunca inventar um e-mail ou telefone real**, nem um "exemplo verossímil".
- GJM Gestão é um produto **ainda não lançado** — comunicar isso de forma implícita e profissional, sem prometer prazos que não foram informados.
- Menu "Produtos" tem intencionalmente **1 único item** (GJM Gestão). Não adicionar produtos fictícios.
- Funcionalidades do GJM Gestão a divulgar são só estas 4: controle de caixa, controle de estoque, nota fiscal, controle de clientes. Não inventar features extras.
- Não copiar números/estatísticas do template de referência (ex: "12K+ empresas") — são do Revio, não da GJM Tech.

## Imagens e assets

Não gerar nem baixar imagens. Todas as imagens serão colocadas manualmente pelo usuário em `/assets`. Referenciar os caminhos esperados mesmo que o arquivo ainda não exista (ex: `assets/hero/decorative-element.png`), e marcar no código com um comentário `<!-- aguardando asset -->` quando fizer sentido.

## Efeito de paralaxe do hero

Ver `.claude/skills/parallax-hero-effect/SKILL.md` para o comportamento exato e o código de referência. Resumo:
- Aparece **somente em desktop** (removido via media query em telas < 768px, não só escondido)
- Move em velocidade mais lenta que o resto do conteúdo no scroll (parallax lag)
- Trocar a "moeda" do Revio por um elemento temático de GJM Gestão (ex: caixa registradora, pilha de notas — conecta com "Controle de Caixa")

## Stack

HTML/CSS/JS vanilla. Sem framework de build obrigatório (Vite é aceitável só como dev server/live reload, opcional). Sem dependências externas pesadas — priorizar CSS puro e JS nativo para as animações de scroll.

## O que NÃO fazer

- Não criar backend, autenticação, banco de dados, ou dashboard — está fora do escopo (é só landing page).
- Não inventar depoimentos de clientes reais nem métricas falsas.
- Não introduzir React, Angular ou qualquer framework JS sem alinhamento prévio com o usuário.
- Não substituir os placeholders de contato por dados reais "inventados".
