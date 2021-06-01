import * as React from "react";
import International from "app/views/Quote/tabs/international";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <International {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl} = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;