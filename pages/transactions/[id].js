import * as React from "react";
import Detail from "app/views/Transactions/detail";
import Auth from "app/lib/auth";

const Page = (props) => {
  const {query} = props;
  const transactionId = query.id;
  return <Detail transactionId={transactionId}/>
}

export async function getServerSideProps(ctx) {
    
  if (Auth.redirectIfNotAuthenticated(ctx)) {
      return {props: {}};
  }
  const { query, resolvedUrl} = ctx;
  return { props: {query, resolvedUrl}};
}

export default Page;
