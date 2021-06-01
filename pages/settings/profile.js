import * as React from "react";
import EditProfile from "app/views/Settings/editProfile";
import Auth from "app/lib/auth";

const Page = (props) => {
    return <EditProfile {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;