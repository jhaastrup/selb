import React from 'react';
import {useRouter} from "next/router";
import {useQuery, useMutation} from "@apollo/client";
import _ from "lodash";
import {DEPENDENCIES} from "./modules/queries";

import Wizard from "app/services/pagewizard";
import Start from './start';
import Success from "./success";
import Failed from "./error";

const pages = [
    {name: "default", page: Start},
    {name: "success", page: Success},
    {name: "failed", page: Failed}
];

const Page = ({onClose}) => {
    const router = useRouter();

    const { data, loading, error, refetch } = useQuery(DEPENDENCIES, {
        fetchPolicy: 'cache-and-network',
    });

    const onCancel = () => {
        router.push("/settings");
    };

    if(loading){
        return(
            <div style={{width: "60%", margin:"10rem auto"}}>
                Loading...
            </div>
        )
    }

    if(error){
        return(
            <div style={{width: "60%", margin:"10rem auto"}}>
                <p>An error occurred</p>
                <button 
                    onClick={() => refetch && refetch()} 
                    style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                >
                    Refetch
                </button>
            </div>
        )
    }

    return (
        <div style={{position: "relative"}}>
            <button onClick={onCancel} style={{position: "absolute", color: "#fff", backgroundColor:"black", width: "2rem", right: "4px", top: "4px"}}>X</button>
            <Wizard 
                onClose={onCancel}
                dependencies={data}
                pages={pages}
            />
        </div>
    );
};

export default Page;

