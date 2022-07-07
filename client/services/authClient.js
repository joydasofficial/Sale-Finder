import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import fetch from "node-fetch";


const httpLink = createHttpLink({
  uri: 'http://localhost:8000/',
  fetch,
});

const authLink = setContext((_, { headers }) => {
    return {}
});   

export const authClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  credentials: 'include',
});

