import * as React from "react";
import {ProductDetail} from "app/views/Business/details";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <ProductDetail {...props}/>
}
export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
