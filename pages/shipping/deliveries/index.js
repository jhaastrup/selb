import * as React from "react";
import Delivery from "app/views/Deliveries/list";
import Auth from "app/lib/auth";

const Page = (props) => {
  const {view} = props.query
  return <Delivery view={view} {...props}/>
}

export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
