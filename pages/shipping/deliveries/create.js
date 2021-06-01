import * as React from "react";
import Ship from "app/views/Deliveries/ship";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Ship {...props}/>
}

export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
