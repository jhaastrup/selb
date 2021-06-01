import * as React from "react";
import ConnectStore from "app/views/Business/linkStore";
import Auth from "app/lib/auth";
import settings from "app/settings";

const Page = (props) => {
  return <ConnectStore {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;
