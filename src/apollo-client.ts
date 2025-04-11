import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: `https://graphql.prepr.io/${process.env.PREPR_GRAPHQL_URL}`,
  cache: new InMemoryCache(),
});

export default client;