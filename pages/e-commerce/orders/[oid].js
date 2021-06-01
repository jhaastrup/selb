import * as React from "react";
import {OrderDetail} from "app/views/Business/details";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <OrderDetail {...props}/>
}
export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
