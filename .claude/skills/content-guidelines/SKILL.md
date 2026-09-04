---
name: content-guidelines
description: Regras de conteúdo, copy e estrutura de navegação da GJM Tech — nomenclatura do produto, dados de contato placeholder, idioma e o que não pode ser inventado. Use sempre que for escrever ou revisar qualquer texto do site.
---

# Content Guidelines — GJM Tech

## Identidade

- Nome da empresa: **GJM Tech** (software house)
- Produto atual (único, MVP em desenvolvimento): **GJM Gestão**
- Público-alvo do GJM Gestão: pequenos e médios negócios — lojas de roupas, gráficas de bairro, comércio em geral
- Idioma: **pt-BR** em 100% do conteúdo

## Navegação (header)

| Item | Contém | Rota sugerida |
|---|---|---|
| Home | — | `/` |
| Produtos | GJM Gestão (item único por enquanto) | `/produtos/gjm-gestao` |
| Institucional | Quem Somos | `/institucional/quem-somos` |
| Dúvidas | Contato | `/duvidas/contato` |
| CTA (canto direito) | "Fale com o nosso time" | leva ao contato/formulário |

> Manter "Produtos" com um único item mesmo tendo estrutura de dropdown/submenu — é intencional, não adicionar produtos fictícios para "preencher" o menu.

## GJM Gestão — funcionalidades do MVP (as únicas a divulgar)

1. Controle de caixa
2. Controle de estoque
3. Emissão de nota fiscal
4. Controle de clientes

Não adicionar funcionalidades além dessas 4 (ex: não inventar "relatórios avançados", "multi-loja", "app mobile próprio" etc.) a menos que o usuário peça explicitamente.

## Contato (placeholder — regra crítica)

Enquanto não houver dados reais, usar **sempre**:

- E-mail: `XXXXX@email.com`
- Telefone: `+55 XXXX-XXXX`

**Nunca** substituir por um e-mail/telefone real inventado, nem por um "exemplo verossímil" (ex: não trocar por `contato@gjmtech.com.br` a menos que o usuário confirme esse domínio explicitamente). Se o dado real não foi informado, o placeholder permanece — mesmo que pareça "feio" no design, isso é intencional até a informação real chegar.

## Números na tela: prévia ilustrativa, nunca métrica

Os cards do hero e os mocks de tela da página do produto mostram números
(R$ do caixa, itens em estoque, nº de clientes). **Nada disso é dado real da GJM Tech** —
são ilustrações de interface, e cada bloco carrega essa ressalva visível na tela
("Prévia ilustrativa da interface — valores meramente demonstrativos").

Os dois cards do hero **sorteiam um entre 10 conjuntos a cada carregamento da página**
(`PREVIAS` em `src/scripts/main.js`), para não parecerem uma captura congelada. Regra ao
mexer nesses dados: cada conjunto é internamente coerente — "em estoque" é sempre
`itens - baixo`, e a barra de progresso reflete essa proporção. Nunca sortear os campos de
forma independente, senão a prévia passa a mostrar conta errada.

Isso é diferente de **prova social inventada**, que continua proibida: nada de "12K+
empresas", "98% de satisfação" ou depoimento fabricado.

## Tom de voz

- Profissional, direto, sem jargão técnico excessivo — o público não é técnico (são donos de loja/gráfica, não desenvolvedores)
- Evitar prometer prazos de lançamento do GJM Gestão que não foram informados pelo usuário
- Evitar números/estatísticas inventados (ex: não copiar algo como "12K+ empresas usam" do template de referência — essa métrica é do Revio, não da GJM Tech). Preferir linguagem qualitativa e neutra quando for necessário prova social, até existirem dados reais
