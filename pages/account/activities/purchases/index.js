import * as React from "react";
import {Utilities} from "app/views/Activities/list";
import Auth from "app/lib/auth";

const Page = (props) => {
    return <Utilities {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;