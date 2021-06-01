import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {formatDate} from "app/lib/formatters";
import Modal from "app/services/modal";
import ActivationForm from "./form";
import {Button} from "app/components/forms";


const Page = () => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const router = useRouter()
    const openForm = () => {
        setModalVisible(true);
    }
    const closeForm = () => {
        setModalVisible(false);
    }

    return(
        <React.Fragment>
            <div className={"max-w-3xl p-2 md:p-0 mx-auto"}> 
                <div className={"my-4"}>
                    <p className={"text-primary text-xs md:text-sm font-semibold"}>{'SENDBOX FOR BUSINESS'}</p> 
                    <p className={"text-black mt-2 text-sm md:text-base font-bold"}> {'Upgrade to a business account to access to discounts and services'}</p>
                    <p className={"text-xs mt-4 md:text-sm text-textGrey"}>{
                        'With a Sendbox Business account, we offer you discounted shipping, an online store and other value added services.'
                    }</p>
                    
                </div>
                <div className={"my-4 py-4 text-xs font-semibold px-2  md:flex md:justify-start"}>
                    <Button
                        onClick={() => router.push('/business/activate')}
                        className={"rounded w-full md:w-auto py-2  text-white appearance-none shadow-none uppercase px-2 focus:border-opacity-0 outline-none bg-black"}
                    >
                        {"UPGRADE MY ACCOUNT"}
                    </Button>
                    
                </div>
                <div className={"mt-4"}>
                    <p className={"text-primary text-xs md:text-sm font-semibold"}>{`${'Extended shipping discounts'}`}</p> 
                    <p className={"text-xs mt-4 md:text-sm text-textGrey"}>{`${'Get discounts for your local and international deliveries.'}`}</p>
                </div>
                <div className={"mt-4"}>
                    <p className={"text-primary text-xs md:text-sm font-semibold"}>{`${'Get a free online store'}`}</p> 
                    <p className={"text-xs mt-4 md:text-sm text-textGrey"}>{`${'Reach new customers globally.'}`}</p>
                </div>
                   
                    
                    
            </div>
            {modalVisible && (
                 <Modal title={"Activate Business Account"} open={modalVisible} onClose={closeForm}>
                   <ActivationForm />
                 </Modal>
             )}
       </React.Fragment>
    )
}
export default Page;
