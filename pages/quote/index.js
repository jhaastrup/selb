import * as React from "react";
import Quote from "app/views/Deliveries/quote";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Quote {...props}/>
}

export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
