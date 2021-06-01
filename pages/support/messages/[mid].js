import * as React from "react";
import SupportDetail from "app/views/Support/detail";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <SupportDetail {...props}/>
}
export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
