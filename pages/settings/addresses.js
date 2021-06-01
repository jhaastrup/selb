import * as React from "react";
import {List} from "app/views/Addresses";
import Auth from "app/lib/auth";
import settings from "app/settings";

const Page = (props) => {
  return <List {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;
