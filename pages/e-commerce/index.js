import * as React from "react";
import Business from "app/views/Business/start";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Business {...props}/>
}
export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
