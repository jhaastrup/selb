import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import {useMutation} from "@apollo/client";
import {LINK_SOCIAL} from "../../../modules/mutations";

import { useRouter } from "next/router";

const Page = ({onChangePage}) => {

    const [authSocialLink, { loading, data, error }] = useMutation(LINK_SOCIAL, {
        onCompleted: (data) => {
            console.log('social link', { data });
            const { login_url } = data.authSocialLink;
            onChangePage('validate', {
                url: login_url,
                source: 'facebook',
            });
        },
        onError: (error) => {
            console.log('social link error', { error });
        },
    });

    const onSocialConnect = React.useCallback(() => {
        authSocialLink({
            variables: {
                url: 'facebook',
                channel: 'web',
                state: 'https://auth.staging.sendbox.co/socials/success',
            },
        });
    }, [authSocialLink]);

    return(
        <div>  
            <div style={{margin: "1rem auto", width: "50%"}}>
                
                <p>{"Connect to Facebook"}</p>
               
               
                <div style={{margin: "1rem"}}>
                {loading ? (
                    <p>Connecting to Facebook</p>
                ):(
                    <button
                    onClick={onSocialConnect} 
                        type={"submit"} 
                        style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                    >
                        {"CONNECT TO FACEBOOK"}
                    </button>
                )}
                 </div>
            </div>
        </div>
    )

}

export default Page;