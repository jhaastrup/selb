import * as React from "react";
import Track from "app/services/tracking";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Track {...props}/>
}

export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;