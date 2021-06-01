import * as React from "react";
import { useRouter } from "next/router";
import Wizard from "app/services/pagewizard";
import Images from './images';
import Options from './options';
import Pages from './pages';
import Validate from "./validate";
import {useQuery} from "@apollo/client";
import {GET_PROFILE} from "../../../modules/queries";



const Page = ({onClose, transition}) => {
    const [initialData, setInitialData] = React.useState({});
    const [pages, setPages] = React.useState([]);
    const [facebook, setFaceBook] = React.useState("");
    const { loading, error, refetch } = useQuery(GET_PROFILE, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (data) => {
            
            const {social=[]} = data.me;
            console.log('completed', social);
            if(social.length){
                for(let i = 0; i < social.length; i++){
                    if (social[i].code.toLowerCase() === 'facebook') {
                        console.log('completed on loop', social[i].code.toLowerCase());
                        setFaceBook("facebook")
                        setInitialData({source: "facebook"});
                        setPages([
                            {name: "default", page: Pages},
                            {name: "images", page: Images},
                            {name: "options", page: Options},
                            {name: "validate", page: Validate}
                        ]);
                        break;
                    }
                }                
            }else{
                setPages([
                    {name: "default", page: Options},
                    {name: "images", page: Images},
                    {name: "pages", page: Pages},
                    {name: "validate", page: Validate}
                ])
            }
        },
        onError: () => {},
    });

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
   
    return(
        <div style={{position: "relative"}}>
            {/* <button onClick={onClose} style={{position: "absolute", color: "#fff", backgroundColor:"black", width: "2rem", right: "4px", top: "4px"}}>X</button> */}
            <Wizard 
                pages={pages}
                onClose={onClose}
                transition={transition}
                initialData={initialData}
             />
        </div>
        
    )
}
export default Page;