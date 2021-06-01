import * as React from "react";
import CreateOrder from "app/views/Business/createNewOrder/generateOrder";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <CreateOrder {...props}/>
}

export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
