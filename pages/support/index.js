import * as React from "react";
import Support from "app/views/Support/list";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Support {...props}/>
}


export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;






