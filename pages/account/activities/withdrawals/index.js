import * as React from "react";
import {Withdrawals} from "app/views/Activities/list";
import Auth from "app/lib/auth";

const Page = (props) => {
    return <Withdrawals {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;