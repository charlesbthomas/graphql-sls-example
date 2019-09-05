import express from 'express';
import serverless from 'serverless-http';
import graphiql from 'graphql-playground-middleware-express';
import { ApolloServer, gql } from 'apollo-server-express';
import github from './githubAPI';

const typeDefs = gql`
  type Query {
    hello: String
    githubUser(login: String!): GithubUser
  }
  type GithubUser {
    login: String!
    url: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'world',
    githubUser: async (obj, args, {dataSources}) => {
      return dataSources.github.getUserByLogin(args.login).then(json => {
        console.log(json);
        return json;
      });
    }
  }
};

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    github
  }),
  path: '/graphql'
});

server.applyMiddleware({ app });

app.get('/playground', graphiql({ endpoint: '/sandbox/graphql' }));

const handler = serverless(app);

export { handler };
