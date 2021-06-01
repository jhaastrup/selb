import * as React from "react";
import Pickups from "app/views/Pickups/list";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Pickups {...props}/>
}
export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
