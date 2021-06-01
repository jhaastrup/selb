import * as React from "react";
import Modal from "app/services/modal";
import Import from "./importOrder";
import Manual from "./generateOrder";
import Link from "next/link";

const Page = () => {
    const [importVisible, setImportVisible] = React.useState(false);
    const [manualVisible, setManualVisible] = React.useState(false);

    const closeModal = () => {
        setImportVisible(false);
        setManualVisible(false);
    }
    return(
        <div style={{display: "flex"}}>
            <div style={{flex: "1"}}>
                    <nav>
                        <div style={{padding: "5px 10px", margin:"10px"}}><Link style={{textDecoration: "none"}} href={"/"} passHref={true}>Dashboard</Link></div>

                        <div style={{padding: "5px 10px", margin:"10px"}}><Link  href={"/account"} passHref={true}>Accounts</Link></div>
                        <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/business"} passHref={true}>Business</Link></div>
                        <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/deliveries"} passHref={true}>Deliveries</Link></div>
                        <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/quote"} passHref={true}>Quote</Link></div>
                        <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/tracking"} passHref={true}>Track</Link></div>
                        <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/transactions"} passHref={true}>Transactions</Link></div>
                        <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/settings"} passHref={true}>Settings</Link></div>


                    </nav>
            </div>
            <div style={{padding:"1rem", height:"100vh", flex:"4", borderLeft: "1px solid"}}>

                {/* <div style={{padding:"1rem"}}>create New order Page</div> */}
                {/* <div style={{display: "flex"}}>
                    <button 
                        onClick={() => setImportVisible(true)} 
                        style={{color: "#fff", backgroundColor:"black", padding: "5px", marginRight: "10px"}}
                    >
                        {"Import from connected stores"}
                    </button>
                    <button 
                        onClick={() => setManualVisible(true)} 
                        style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                    >
                        {"Generate Manually"}
                    </button>
                </div> */}
                <Manual onClose />
            
            </div>
            {/* {importVisible &&(
                    <Modal onClose={closeModal}>
                        <Import onClose />
                    </Modal>
                )}
                {manualVisible && (
                    <Modal onClose={closeModal}>
                        <Manual onClose />
                    </Modal>
                )} */}
        </div>
    )
}
export default Page;
// {modalVisible && (
//     <Modal>
//         <Locations onCompleted={onCompleted} initialData={modalData}/>
//     </Modal>
// )}