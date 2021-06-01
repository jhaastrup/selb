import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import {useLazyQuery} from "@apollo/client";
import {GET_PROFILE} from "../../../modules/queries";


const Page = ({onChangePage, pageData, updatePageData}) => {
    // const url = pageData.url.trim();
    const [socialState, setsocialState] = React.useState(false);
    console.log({pageData})

    const [me, { loading, data, error, networkStatus, refetch }] = useLazyQuery(GET_PROFILE, {
        onCompleted: (data) => {
            const { social } = data.me;
            if(social.length){
                for(const item of social){
                    if (item.code.toLowerCase() === 'facebook') {
                        onChangePage("pages")
                        break;
                    }
                }
            }else{
                setsocialState(true)
            }
           
        },
        onError: (error) => {
            console.log('error in profile', { error });
        },
    });

    
    const linkAccount = () => {
        me({});
    };


    // https://dev-myteststore.pantheonsite.io/
    // 9Zu9k$p%Iy8PNEjft!
    // Mohammed
    //
    // https://finalmohammedstore.myshopify.com/
    //tweuyi
    //aminuolawaleji@gmail.com
    //aminuolawaleji
    //Jhaastrup21@gmail.com

    //  haastrup001
    //https://sendbox-stores.myshopify.com/

    if(loading){
        return(
            <div style={{width: "60%", margin:"10rem auto"}}>
                Loading...
            </div>
        )
    }

   

    return(
        <div>  
            <div style={{margin: "1rem auto", width: "50%"}}>
                
                <p>{"Link Account"}</p>
               
                <div>
                   
                    <div style={{width: "60%", margin:"1rem auto"}}>
                        {socialState ? (
                            <div>
                                <p>{'Please try again...unable to link account'}</p>
                                <button onClick={linkAccount}>Retry Linking</button>
                            </div>
                        ): (<div>
                        <p>{'Please click to link social account'}</p>
                        <button onClick={linkAccount}>Link Account</button>
                        </div>)}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Page;