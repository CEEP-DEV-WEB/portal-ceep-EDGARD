# Portal CEEP

Sistema web de acompanhamento escolar desenvolvido com **HTML, CSS e JavaScript**.

## Funcionalidades

- Dashboard responsivo para pais/alunos.
- Área do professor.
- Cadastro/edição de nome, matrícula e turma.
- Edição das notas das disciplinas.
- Controle de frequência.
- Gráfico de desempenho por disciplina.
- Gráfico de frequência.
- Boletim em tabela.
- Observação pedagógica.
- Média geral calculada automaticamente.
- Situação acadêmica calculada automaticamente.
- Salvamento dos dados no `localStorage`.
- Modo claro/escuro.
- Layout adaptado para celular e computador.

## Estrutura

```text
portal-ceep/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Como executar

### Opção 1 — abrir diretamente

Abra o arquivo `index.html` no navegador.

### Opção 2 — GitHub Pages

1. Crie um repositório no GitHub.
2. Envie `index.html`, `styles.css`, `script.js` e `README.md`.
3. Vá em **Settings > Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/root`.
6. Salve e aguarde a publicação.

## Observação

O projeto usa Chart.js por CDN. Por isso, os gráficos precisam de conexão com a internet quando o sistema é aberto.

Os dados editados pelo professor ficam salvos apenas no navegador através do `localStorage`. Isso é adequado para uma demonstração/protótipo, mas não substitui um banco de dados e um sistema de autenticação em um ambiente escolar real.

## Próximos passos possíveis

- Login real para professor e família.
- Banco de dados com alunos.
- Backend com Python/Flask ou FastAPI.
- Cadastro de várias turmas.
- Controle de frequência por data.
- Histórico de notas por bimestre.
- Exportação de boletim em PDF.
- Área administrativa.
