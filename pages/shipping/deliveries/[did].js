import * as React from "react";
import Detail from "app/views/Deliveries/detail";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Detail {...props}/>
}
export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
