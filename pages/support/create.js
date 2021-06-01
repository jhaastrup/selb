import * as React from "react";
import SupportCreate from "app/views/Support/complain";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <SupportCreate {...props}/>
}


export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;






