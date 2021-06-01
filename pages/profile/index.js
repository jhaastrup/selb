import * as React from "react";
import Profile from "app/views/Profile/list";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Profile {...props}/>
}

export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl} = ctx;
    return { props: {query, resolvedUrl}};
}


export default Page;