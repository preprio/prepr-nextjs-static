import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Apollo Client v4 no longer accepts a `uri` shorthand on the constructor;
// the terminating HttpLink must be provided explicitly.
const client = new ApolloClient({
  link: new HttpLink({ uri: process.env.PREPR_GRAPHQL_URL }),
  cache: new InMemoryCache(),
});

export default client;
