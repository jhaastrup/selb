import { useMemo } from 'react'
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, from } from '@apollo/client'
import fetch from "isomorphic-unfetch";
import { setContext } from "apollo-link-context";

import settings from "../../settings";
import Auth from "../auth";


let apolloClient

function createApolloClient() {
    const isBrowser = typeof window !== "undefined";

    const link = new HttpLink({
        uri: settings.uri, // Server URL (must be absolute)
        fetch: !isBrowser && fetch,
        credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
        // Use fetch() polyfill on the server
    });

    const authLink = setContext((_, { headers }) => {
        // fetch the authToken from here and include it in the headers
        const token = Auth.getCookie(settings.cookieId, {});
        return {
            headers: {
                ...headers,
                authorization: token ? `${token}` : "",
            },
        };
    });


    return new ApolloClient({
        ssrMode: !isBrowser,
        link: authLink.concat(link),
        cache: new InMemoryCache({}),
    })
}

export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient()

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // gets hydrated here
    if (initialState) {
        // Restore the cache
        _apolloClient.cache.restore(initialState)
    }
    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}


export function useApollo(initialState) {
    const store = useMemo(() => initializeApollo(initialState), [initialState])
    return store
}