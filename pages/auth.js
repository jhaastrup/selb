import React, { useEffect } from "react";
import Auth from "../app/lib/auth";
import Loading from "app/components/loading"

const Page = ({ query }) => {
    useEffect(() => {
        const { token, redirect_to = "/" } = query;
        if (token) {
            Auth.loginUser(token, redirect_to);
        }
    }, [query]);

    return (
        <Loading />
    );
};

export async function getServerSideProps(ctx) {
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl }};
}

export default Page;
