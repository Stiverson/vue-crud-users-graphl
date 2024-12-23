const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { v4: uuidv4 } = require('uuid');

// Banco de dados em memória
let users = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

// Definição do esquema GraphQL
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    addUser(name: String!): User!
  }
`;

// Resolvers: implementações das operações
const resolvers = {
  Query: {
    users: () => users,
  },
  Mutation: {
    addUser: (_, { name }) => {
      const newUser = { id: uuidv4(), name };
      users.push(newUser);
      return newUser;
    },
  },
};

// Configuração do servidor Apollo
async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Servidor GraphQL rodando em http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
