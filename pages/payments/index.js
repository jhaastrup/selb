import * as React from "react";
import Payments from "app/views/Payments/list";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Payments {...props}/>
}
export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;