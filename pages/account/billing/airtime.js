import * as React from "react";
import {Billing} from "app/views/Account";
import Auth from "app/lib/auth";

const Page = (props) => {
    return <Billing category="airtime" {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;