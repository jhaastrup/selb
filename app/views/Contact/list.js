import * as React from "react";
import Loading from "app/components/loading"
import {Spacer} from "app/components/assets"
import {Button} from "app/components/forms";
import {ArrowLeft, ChevronForward} from "app/components/icons"
import { useRouter } from "next/router";
import TabLayout from "./tab";



const Page = () => {
    const telephone = "017006150";
    const supportEmail = "support@sendbox.ng";
    const twitterURL = 'https://twitter.com/sendboxng';
    const facebookURL = 'https://www.facebook.com/sendbox.ng';
    const instagramURL = 'https://www.instagram.com/sendbox.ng/';

    return(
        <TabLayout pageTitle={"Contact Us"}> 


<div className="p-5"> 
        <div className='flex justify-between items-center cursor-pointer py-4 border-b border-textGrey border-opacity-10'>
            <div  onClick={() => window.open(facebookURL, '_blank')}>
            <p className={"block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"}>{"Facebook"}</p>
                </div> 
            <div>
            <ChevronForward color={'rgba(217,48,37,1)'}/>
            </div>
        </div> 
        
        <div className='flex justify-between items-center cursor-pointer py-4 border-b border-textGrey border-opacity-10'>
            <div onClick={() => window.open(twitterURL, '_blank')}>
            <p className={"block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"}>{"Twitter"}</p>
                </div> 
            <div>
            <ChevronForward color={'rgba(217,48,37,1)'}/>
            </div>
        </div> 

        
        <div className='flex justify-between items-center cursor-pointer border-b border-textGrey py-4 border-opacity-10'>
            <div  onClick={() => window.open(instagramURL, '_blank')}>
            <p className={"block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"}>{"Instagram"}</p>
                </div> 
            <div>
            <ChevronForward color={'rgba(217,48,37,1)'}/>
            </div>
        </div> 

        <div className='flex justify-between items-center cursor-pointer border-b border-textGrey py-4 border-opacity-10'>
            <div>
            <p className={"block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"}>{"Support Phone"}</p>
            </div> 
            <div>
            <p className={"text-primary"}>
            <a href={`tel:${telephone}`}>{telephone}</a>
            </p>
            </div>
        </div> 

        <div className='flex justify-between items-center cursor-pointer border-b border-textGrey py-4 border-opacity-10'>
            <div>
            <p className={"block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"}>{"Support Email"}</p>
            </div> 
            <div>
            <p className={"text-primary"}>
            <a href={`mailto:${supportEmail}?cc=&subject=yourSubject&body=yourMessage`}>{supportEmail}</a>
            </p>
            </div>
        </div> 

        <div className='flex justify-between items-center cursor-pointer border-b border-textGrey py-4 border-opacity-10'>
            <div>
            <p className={"block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"}>{"Office Address"}</p>
            </div> 
            <div>
            <p className={"text-primary"}>{"62 Old Yaba Road, off Adekunle Street, Adekunle, Yaba Lagos, Nigeria. "}</p>
            </div>
        </div>


        </div>



           {/*  <div className={"flex flex-col max-w-lg mx-auto px-4"}>
                <Spacer className={"block h-14"} />
                <div>
                    <p className={"font-semibold tracking-wider"}>{"Office Address"}</p>
                    <Spacer className={"block h-3"} />
                    <p className={"text-xs"}>{"62 Old Yaba Road,"}</p>
                    <p className={"text-xs"}>{"off Adekunle Street, Adekunle, Yaba"}</p>
                    <p className={"text-xs"}>{"Lagos, Nigeria."}</p>
                </div>
                <Spacer className={"block h-10"} />
                <div>
                    <p className={"text-primary"}>
                        <a href={`tel:${telephone}`}>{telephone}</a>
                    </p>
                    <p>
                        <a href={`mailto:${supportEmail}?cc=&subject=yourSubject&body=yourMessage`}>{supportEmail}</a>
                    </p>
                </div>
                <Spacer className={"block h-10"} />
                <div className={"mb-2"}>
                    <p className={"font-semibold"}>{"Connect with us on Social Media"}</p>
                </div>
                <div 
                    onClick={() => window.open(facebookURL, '_blank')}
                    className={"flex flex-row justify-between py-4 border-b border-textGrey border-opacity-10 cursor-pointer"}>
                    <div className={"col-span-1"}>
                        <p>{"Facebook"}</p>
                    </div>
                    <div className={"col-span-1 flex justify-end"}>
                        <ChevronForward color={'rgba(217,48,37,1)'}/>
                    </div>
                </div>
                <div 
                    onClick={() => window.open(twitterURL, '_blank')}
                    className={"flex flex-row justify-between py-4 border-b border-textGrey border-opacity-10 cursor-pointer"}>
                    <div className={"col-span-1"}>
                        <p>{"Twitter"}</p>
                    </div>
                    <div className={"col-span-1 flex justify-end"}>
                        <ChevronForward color={'rgba(217,48,37,1)'}/>
                    </div>
                </div>
                <div 
                    onClick={() => window.open(instagramURL, '_blank')}
                    className={"flex flex-row justify-between py-4 border-b border-textGrey border-opacity-10 cursor-pointer"}>
                    <div className={"col-span-1"}>
                        <p>{"Instagram"}</p>
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