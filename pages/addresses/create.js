import * as React from "react";
import Form from "app/views/Addresses/form";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Form {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl} = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;
