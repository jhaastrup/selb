import * as React from "react";
import Foreign from "app/views/Quote/tabs/foreign";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Foreign {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl} = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;