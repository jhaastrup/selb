import * as React from "react";
import Loading from "app/components/loading"
import {Spacer} from "app/components/assets"
import {Button} from "app/components/forms";
import {ArrowLeft, ChevronForward} from "app/components/icons"
import { useRouter } from "next/router";
import TabLayout from "./tab";



const Page = () => {
    const router = useRouter()
    const termsURL = 'https://sendbox.co/legal/terms';
    const policyURL = 'https://sendbox.co/legal/privacy';
    const bsURL = 'https://sendbox.co/legal/protection';
    return(
        <TabLayout pageTitle={"Legal"}> 
        <div className="p-5"> 
        <div className='flex justify-between items-center cursor-pointer py-4 border-b border-textGrey border-opacity-10'>
            <div  onClick={() => window.open(termsURL, '_blank')}>
            <p className={"block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"}>{"Terms and Conditions"}</p>
                </div> 
            <div>
            <ChevronForward color={'rgba(217,48,37,1)'}/>
            </div>
        </div> 
        
        <div className='flex justify-between items-center cursor-pointer py-4 border-b border-textGrey border-opacity-10'>
            <div onClick={() => window.open(policyURL, '_blank')}>
            <p className={"block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"}>{"Privacy and Policy"}</p>
                </div> 
            <div>
            <ChevronForward color={'rgba(217,48,37,1)'}/>
            </div>
        </div> 

        
        <div className='flex justify-between items-center cursor-pointer border-b border-textGrey py-4 border-opacity-10'>
            <div onClick={() => window.open(bsURL, '_blank')}>
            <p className={"block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"}>{"Buyer and Seller Protection"}</p>
                </div> 
            <div>
            <ChevronForward color={'rgba(217,48,37,1)'}/>
            </div>
        </div>


        </div>
           {/*  <div className={"flex flex-col max-w-lg mx-auto px-4"}>
                <Spacer className={"block h-6"} />
                <div 
                    onClick={() => window.open(termsURL, '_blank')}
                    className={"flex flex-row justify-between py-4 border-b border-textGrey border-opacity-10 cursor-pointer"}>
                    <div className={"col-span-1"}>
                        <p>{"Terms and Conditions"}</p>
                    </div>
                    <div className={"col-span-1 flex justify-end"}>
                        <ChevronForward color={'rgba(217,48,37,1)'}/>
                    </div>
                </div>
                <div 
                    onClick={() => window.open(policyURL, '_blank')}
                    className={"flex flex-row justify-between py-4 border-b border-textGrey border-opacity-10 cursor-pointer"}>
                    <div className={"col-span-1"}>
                        <p>{"Privacy Policy"}</p>
                    </div>
                    <div className={"col-span-1 flex justify-end"}>
                        <ChevronForward color={'rgba(217,48,37,1)'}/>
                    </div>
                </div>
                <div 
                    onClick={() => window.open(bsURL, '_blank')}
                    className={"flex flex-row justify-between py-4 border-b border-textGrey border-opacity-10 cursor-pointer"}>
                    <div className={"col-span-1"}>
                        <p>{"Buyer and Seller Protection"}</p>
                    </div>
                    <div className={"col-span-1 flex justify-end"}>
                        <ChevronForward color={'rgba(217,48,37,1)'}/>
                    </div>
                </div>
            </div> */}
        </TabLayout>
    )
}
export default Page;