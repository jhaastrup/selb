import * as React from "react";
import CreateProduct from "app/views/Business/createNewProduct/generateProduct";
import Auth from "app/lib/auth";

const Page = (props) => {
  return <CreateProduct {...props}/>
}

export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
