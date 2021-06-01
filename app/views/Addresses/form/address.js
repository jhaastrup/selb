import * as React from "react";
import {useMutation} from "@apollo/client";
import {CREATE_ADDRESS  } from "../modules/mutations";
import AddressPlugin from "app/services/address";
import Modal from "app/services/modal";
import Loading from "app/components/loading"



const initialState = {
    street: "",
    country: "",
    name: "",
    email: "",
    phone: "",
    post_code: "",
    state: "",
    city: "",
}

const Page = ({dependencies, onChangePage, onClose}) => {
    const [formData, setFormData] = React.useState(initialState)
    const { destination_countries } = dependencies;
    const countries = destination_countries;

    const [createAddress, { loading, error, data }] = useMutation(CREATE_ADDRESS, {
        onCompleted: (data) => {
            onChangePage && onChangePage('success');
        },
        onError: (error) => {
            console.log('err==>', { error });
            onChangePage && onChangePage('error');
        },
    });


    const handleOnchange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
        
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const variables = {
            ...formData
        }
        createAddress({variables})

    }

    const _onClose = () => {
        onClose && onClose();
    };

    const onSuccess = (variables) => {
        console.log('data', { variables });
        createAddress({ variables });
    };

    // if(loading || !data){
    //     return(
    //         <div className={"flex h-screen justify-center items-center"}>
    //             <Loading />
    //         </div>
    //     )
    // }

    return(

        
        <AddressPlugin 
        onItemSelected={onSuccess}
        dependencies={dependencies.destination_countries}
        options={dependencies.addresses}
    />
       /*  <Modal
            onClose={_onClose}
            open={true}
        >
            <AddressPlugin 
                onItemSelected={onSuccess}
                dependencies={dependencies.destination_countries}
                options={dependencies.addresses}
            />
        </Modal> */
    )
}
export default Page;