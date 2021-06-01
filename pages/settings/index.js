import * as React from "react";
import {SettingsDashboard} from "app/views/Settings";
import Auth from "app/lib/auth";

const Page = (props) => {
    return <SettingsDashboard {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;