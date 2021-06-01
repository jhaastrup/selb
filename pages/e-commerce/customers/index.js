import * as React from "react";
import {List as Customers } from "app/views/Customers";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Customers {...props}/>
}
export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
