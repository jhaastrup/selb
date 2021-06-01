import * as React from "react";
import {TopupDetail} from "app/views/Activities/details";
import Auth from "app/lib/auth";

const Page = (props) => {
    return <TopupDetail {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;