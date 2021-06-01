import * as React from "react";
import Report from "app/views/Report";
import Auth from "app/lib/auth";

const Page = (props) => {
    return <Report {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;