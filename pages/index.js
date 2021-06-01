import * as React from "react";
import Dashboard from "app/views/Dashboard";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <Dashboard {...props}/>
}
export async function getServerSideProps(ctx) {
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl } = ctx;
  return { props: {query, resolvedUrl }};
}

export default Page;