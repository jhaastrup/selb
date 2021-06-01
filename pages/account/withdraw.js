import * as React from "react";
import {WithdrawFunds} from "app/views/Account";
import Auth from "app/lib/auth";

const Page = (props) => {
    return <WithdrawFunds {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;