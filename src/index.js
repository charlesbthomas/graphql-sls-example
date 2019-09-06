import { ApolloServer, gql } from 'apollo-server-lambda';
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    github
  }),
  playground: true,
  introspection: true,
});

const handler = server.createHandler();

export { handler };
