import * as React from "react";
import { ContactList} from "app/views/Contact";
import Auth from "app/lib/auth";
import settings from "app/settings";

const Page = (props) => {
  return < ContactList {...props}/>
}
export async function getServerSideProps(ctx) {
    
    if (Auth.redirectIfNotAuthenticated(ctx)) {
        return {props: {}};
    }
    const { query, resolvedUrl } = ctx;
    return { props: {query, resolvedUrl}};
}

export default Page;
