import * as React from "react";
import {RequestDetail} from "app/views/Activities/details";
import Auth from "app/lib/auth";

const Page = (props) => {
    return <RequestDetail {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;