import * as React from "react";
import Cards from "app/views/Cards/list";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Cards {...props}/>
}

export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl} = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;
