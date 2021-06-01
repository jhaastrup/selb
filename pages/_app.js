import React from "react";
import "../styles/globals.css";
import "tailwindcss/tailwind.css";

import { ApolloProvider } from "@apollo/client";
import { useApollo } from "app/lib/apollo";

function MyApp({ Component, pageProps }) {
    const apolloClient = useApollo(pageProps);

    return (
        <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
        </ApolloProvider>
    );
}

export default MyApp;
