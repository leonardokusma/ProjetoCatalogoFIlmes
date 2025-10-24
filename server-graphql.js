// Código de testes para transformar o nosso app dos filmes em uma API GraphQL
// Para rodar, é necessário instalar as dependências: npm install express express-graphql graphql

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

let filmes = [
  { id: 1, nome: "Onde os Fracos Não Têm Vez", anoLancamento: 2007 },
  { id: 2, nome: "O Iluminado", anoLancamento: 1980 },
  { id: 3, nome: "Interestelar", anoLancamento: 2014 },
];

// Definição do Schema GraphQL
// Aqui só expomos id e nome dos filmes
const schema = buildSchema(`
  type Filme {
    id: ID!
    nome: String!
  }

  type Query {
    filmes: [Filme]
    filme(id: ID!): Filme
  }
`);

// Resolvers: funções que vão retornar os dados
const root = {
  filmes: () => filmes,
  filme: ({ id }) => filmes.find(f => f.id === parseInt(id)),
};

// Criação do servidor Express + GraphQL
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Interface visual para podermos testar as consultas
  })
);

// Inicialização do servidor
const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Servidor GraphQL rodando em http://localhost:${PORT}/graphql`);
});