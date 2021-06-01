import * as React from "react";
import Sameday from "app/views/Quote/tabs/sameday";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Sameday {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl} = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;