import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";




const Page = () => {
    const router = useRouter();
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
                <p>Get Shipment Quote</p>
                <div style={{display:"flex"}}>
                        <div style={{margin: "1rem"}}>
                            <button onClick={() => router.push("/quote/foreign") } style={{color: "#fff", backgroundColor:"black", padding: "5px",}}>
                                Foreign Quote
                            </button>
                        </div>
                        <div style={{margin: "1rem"}}>
                            <button 
                                type={"button"}
                                onClick={() => router.push("/quote/nationwide") }
                                style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                            >
                                Nationwide Quote
                            </button>
                        </div>
                        <div style={{margin: "1rem"}}>
                            <button 
                                type={"button"}
                                onClick={() => router.push("/quote/international") }
                                style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                            >
                                international Quote
                            </button>
                        </div>
                        <div style={{margin: "1rem"}}>
                            <button 
                                type={"button"}
                                onClick={() => router.push("/quote/sameday") }
                                style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                            >
                                SameDay Quote
                            </button>
                        </div>
                    </div>
            </div>
        </div>
    )
}
export default Page;