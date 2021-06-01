import * as React from "react";
import { useRouter } from "next/router";
import Wizard from "app/services/pagewizard";
import Form from "./form";
import { ADDRESS_DEPENDENCIES } from "./modules/queries";
import {useQuery} from "@apollo/client";

const pages = [
    {name: "default", page: Form},
   
]

const Page = ({onItemSelected, dependencies, options, initialData}) => {
       

    return(
            <div>
                <Form
                    dependencies={dependencies}
                    onTransition={onItemSelected}
                    options={options}
                    initialData={initialData}
                />
            </div>
        
    )
}
export default Page;