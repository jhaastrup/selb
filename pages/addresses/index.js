import * as React from "react";
import Addresses from "app/views/Addresses/list";
import Auth from "app/lib/auth";
import settings from "app/settings";

const Page = (props) => {
  return <Addresses {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;
