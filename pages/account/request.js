import * as React from "react";
import {RequestFunds} from "app/views/Account";
import Auth from "app/lib/auth";

const Page = (props) => {
    return <RequestFunds {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;