import * as React from "react";
import {Orders} from "app/views/Business/tabs";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Orders {...props}/>
}
export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
