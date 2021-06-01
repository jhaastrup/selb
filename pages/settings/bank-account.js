import * as React from "react";
import BankAccount from "app/views/BankAccount";
import Auth from "app/lib/auth";

const Page = (props) => {
    return <BankAccount {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;