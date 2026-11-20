# Portal da 148

Projeto Final Integrador (PL1) da turma 148 do **IFSP — Campus Cubatão**, ano letivo de 2026. O portal reúne, em um só lugar, os sites produzidos pelos grupos da turma em **Geografia** e **Língua Portuguesa**.

**Portal publicado (GitHub Pages):** https://viniciusfsluz-tech.github.io/portal-148/

**Repositório:** https://github.com/viniciusfsluz-tech/portal-148

O site foi feito somente com HTML, CSS e JavaScript, sem frameworks nem bibliotecas.

## Professores

| Professor | Disciplina |
|---|---|
| Nelson | PL1 — Programação |
| Augusto | Geografia |
| Fabiana | Língua Portuguesa |

## Equipe do Portal

Um integrante de cada grupo produtor, representando o seu grupo.

| Integrante | Grupo que representa | Papel na equipe |
|---|---|---|
| Vinícius Ferreira | Royal Code | Publicar site,fazer HTML e JS |
| Lucas Antônio | Instituto verdade digital | _PREENCHER_ |
| Lavínnia | Os Bardenistas | _PREENCHER_ |
| Kauã Hideyuki | El Machos | _PREENCHER_ |
| Geovanna Vital | Blue Flow | _PREENCHER_ |
| Nicole | Um passo abaixo - Uma incrível potência ou uma possível venda?| _PREENCHER_ |
| Alexandra | Oceon | _PREENCHER_ |
| Daphne | gp8 | _PREENCHER_ |

## Grupos produtores e seus sites

Cada grupo produziu um site em Geografia e outro em Português. O portal leva ao site publicado de cada um e, na página Equipe, ao código no GitHub.

| Grupo | Integrantes | Site de Geografia | Site de Português |
|---|---|---|---|
| Royal Code | Vinícius Ferreira, Luis Gustavo, Ruan Silva, Gabriel Mariano | Conexão Terra | Caderno de Letras |
| Instituto verdade digital | Lucas Antônio, Cauan Victor, Enzo Novais, Enzo Ricci, Miguel Godke Silva, Ruan Ribeiro | EcoByte | Biblioteca da Informação |
| Os Bardenistas | Lavínnia, Julia Sophia, Vitor, Kauã Hentique | ecosofia | Flânerie |
| El Machos | Arthur Seiji, Luis Carlos, Davi Silva, Kauan Hideyuki | MinerTech | Límpidamente |
| Blue Flow | Geovanna Vital, Maria Eduarda Lira, Rhuan Fonseca, Marina Matos, Giovanna Fernandes, Luis Felipe | consumo de água da IA | trabalho de português |
| Um passo abaixo - Uma incrível potência ou uma possível venda? | Nicole, Miuke, Marcelo, Maria eduarda, Isabelly | Um passo abaixo - Uma incrível potência ou uma possível venda? | _a publicar_ |
| Oceon | Alexandra, Izabella, Eduarda R | Tecnologia-AZUL | _a publicar_ |
| gp8 | Daphne, Laura, Anna, Gaby | _a publicar_ | _a publicar_ |

Os links de cada site ficam em `js/config.js`.

## Páginas

| Página | Conteúdo |
|---|---|
| `index.html` | Início: campus, turma, professores, caminhos para as matérias, vídeo e QR Code "Veja no celular" |
| `portugues.html` | Grupos e sites de Língua Portuguesa |
| `geografia.html` | Grupos e sites de Geografia |
| `equipe.html` | Equipe do Portal e grupos produtores, com o link do código no GitHub |
| `estilo.html` | Guia de estilo: paleta, tipografia e componentes |
| `trabalho.html` | Página de detalhe de um trabalho |

## Estrutura do repositório

```
portal-148/
├── index.html
├── portugues.html  geografia.html  equipe.html  estilo.html  trabalho.html
├── css/
│   └── style.css        paleta (variáveis :root), tipografia e layout
├── js/
│   ├── config.js        turma, professores, grupos, links e itens do menu
│   ├── dados.js         trabalhos cadastrados (arrays de objetos)
│   └── main.js          menu, tema, cartões e interações
├── img/                 imagens, favicon e QR Code
└── README.md
```

## Como funciona

- **Dados em JavaScript:** os grupos, os professores e o menu ficam em arrays e objetos no `js/config.js`. Nenhum cartão é escrito à mão no HTML: o `js/main.js` monta o menu, as listas de grupos e a página Equipe com laços (`map`, `filter`) e funções.
- **Para mudar o portal:** edite só o `js/config.js` (por exemplo, ligar ou desligar uma matéria com `portugues: true/false`).
- **Interações:** menu responsivo (abre e fecha, e o Esc fecha), tema claro e escuro salvo no navegador e botão de voltar ao topo.
- **Acessibilidade:** link "Pular para o conteúdo", foco visível, navegação por teclado e imagens com texto alternativo.

## Identidade visual

A paleta de cores, a tipografia e a justificativa das escolhas estão na página `estilo.html`. As cores são variáveis CSS no `:root` do `css/style.css`, com um tema escuro e um claro.

## Fontes e créditos de terceiros

| Item | Origem | Licença |
|---|---|---|
| Fonte Inter | Google Fonts | SIL Open Font License |
| Fonte Poiret One | Google Fonts | SIL Open Font License |
| _Imagem do topo da página inicial_ | _PREENCHER: autor e link_ | _PREENCHER_ |
| _Vídeo de apresentação_ | _PREENCHER: link_ | _PREENCHER_ |
| QR Code | Gerado a partir do endereço do portal publicado | — |

As fontes de imagens, textos e vídeos de cada trabalho ficam nos READMEs e nas páginas dos sites de cada grupo.

## Registro de contribuições

Cada integrante da Equipe do Portal registra o que fez.

| Integrante | Data | O que fez | Tempo |
|---|---|---|---|
| Vinícius Ferreira | 10/11 | moutou estrutura base do HTML,CSS e JS,adicionou seus trabalhos | 1H30M |
|Lucas Antonio |19/11 |Criação das logotipos do projeto e implementação de script para alternar automaticamente as imagens de acordo com o tema claro ou escuro |1H|

## Como abrir o projeto

Basta abrir o `index.html` no navegador (um duplo clique), ou usar a extensão Live Server do VS Code. Não precisa instalar nada.

## Licença

Este repositório usa a licença MIT (arquivo `LICENSE`).
