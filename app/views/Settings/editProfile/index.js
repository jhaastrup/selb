import React from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import _ from "lodash";
//import {DEPENDENCIES} from "../modules/queries";
import Loading from "app/components/loading";
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";

import Wizard from "app/services/pagewizard";
import Start from "./start";
import Email from "./email";
import Password from "./password";
import Username from "./username";
import Phone from "./phone";
import Name from "./name";
import Otp from "./otp";
import Success from "./success";
import Failed from "./error";

const pages = [
  { name: "default", page: Start },
  { name: "name", page: Name },
  { name: "email", page: Email },
  { name: "phone", page: Phone },
  { name: "username", page: Username },
  { name: "password", page: Password },
  { name: "otp", page: Otp },
  { name: "failed", page: Failed },
  { name: "success", page: Success },
];

const Page = ({ onClose, dependencies }) => {
  const router = useRouter();

  /*  const { data, loading, error, refetch } = useQuery(DEPENDENCIES, {
        fetchPolicy: 'cache-and-network',
    });
 */
  const onCancel = () => {
    router.push("/settings");
  };

  /*  if(loading){
        return(
            <div className={"flex h-screen justify-center items-center"}>
                <Loading />
            </div>
        )
    } */

  /*  if (error) {
        return (
            <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                <div>
                    <p className={"text-center"}>{'unknown error occurred'}</p>
                    { <p className={"text-center text-textGrey"}>{'We could not find any tracking information for the reference code provided'}</p> 
                </div>
                <Spacer className={"block h-5"} />
                <div>
                    <Button
                        onClick={() => refetch && refetch()}
                        uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                    >
                        {'Try Again'}
                    </Button>
                </div>
            </div>
        )
    } */
  console.log(dependencies);
  return (
    <div className={"px-4"}>
      <Name dependencies={dependencies} />
      <Spacer className={"block h-4"} />
      <hr />
      <Email dependencies={dependencies} />
      <Spacer className={"block h-4"} />
      <hr />
      <Username dependencies={dependencies} />
      <Spacer className={"block h-4"} />
      <hr />
      <Phone dependencies={dependencies} />
      <Spacer className={"block h-4"} />
      <hr />
      <Password dependencies={dependencies} />
    </div>
    /*  <div style={{position: "relative"}}>
            <button onClick={onCancel} style={{position: "absolute", color: "#fff", backgroundColor:"black", width: "2rem", right: "4px", top: "4px"}}>X</button>
            <Wizard 
                onClose={onCancel}
                pageClose={onCancel}
                dependencies={data}
                pages={pages}
            />
        </div> */
  );
};

export default Page;
