import * as React from "react";
import Transactions from "app/views/Transactions/list";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Transactions {...props}/>
}
export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;