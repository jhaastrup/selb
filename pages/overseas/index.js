import * as React from "react";
import Overseas from "app/views/Overseas";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Overseas {...props}/>
}

export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;