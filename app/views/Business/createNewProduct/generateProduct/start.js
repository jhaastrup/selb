import * as React from "react";
import {CloseIcon, ChevronForward} from "app/components/icons";
import { Button} from "app/components/forms";





const Page = ({
    dependencies, 
    onChangePage, 
}) => {
   
    const { discoveryProfile={} } = dependencies.me;
    const {connected_stores} = discoveryProfile;
   
    

    return(
        
        <div className={"max-w-3xl p-2 md:p-0 mx-auto"}> 
            
            <div className={"col-span-5 flex flex-col items-start  justify-end"}>
                <p className={"font-semibold text-sm uppercase text-primary"}>{"Create Product"}</p>
                <p className={"font-semibold text-base text-black"} >{"How do you want to create your product?"}</p>
            </div>

            <div 
                onClick={() => onChangePage("description")} 
                className={"grid mt-4 grid-cols-7 gap-2 py-2 text-xs border-b border-transluscent-grey"}
            >
               
                <div className={"col-span-6 uppercase flex flex-col items-start  justify-end"}>
                    <p className={"font-semibold text-sm uppercase text-black"}>{"From Media"}</p>
                </div>
                
                <div className={"col-span-1 flex justify-end items-center"}>
                    <div className={"flex justify-center h-8 w-8 items-cente"}>

                        <Button 
                            className={"flex flex-col md:py-3 md:px-3 px-2 py-2 focus:border-opacity-0 focus:outline-none border-0 outline-none"}
                        >
                            <ChevronForward size={20} color={"rgba(6,15,33, 1)"}/>
                        </Button>
                    </div>
                </div>
                                        
            </div>
            <div
                onClick={() => onChangePage("social")}
                className={"grid grid-cols-7 gap-2 py-2 text-xs border-b border-transluscent-grey"}
            >
                
                <div className={"col-span-6 flex flex-col items-start  justify-end"}>
                    <p className={"font-semibold uppercase text-sm text-black"}>{"Instagram/Facebook"}</p>
                   
                </div>
                
                <div className={"col-span-1 flex justify-end items-center"}>
                    <div className={"flex justify-center h-8 w-8 "}>

                        <Button 
                            className={"flex flex-col md:py-3 md:px-3 px-2 py-2 focus:border-opacity-0 focus:outline-none border-0 outline-none"}
                        >
                            <ChevronForward size={20} color={"rgba(6,15,33, 1)"}/>
                        </Button>
                    </div>
                </div>
                                        
            </div>
            <div 
                onClick={() => onChangePage("stores")}
                className={"grid grid-cols-7 gap-2 py-2 text-xs border-b border-transluscent-grey"}>
                
                <div className={"col-span-5 flex flex-col items-start  justify-end"}>
                    <p className={"font-semibold uppercase text-sm text-black"}>{"Connected Stores"}</p>
                    
                </div>
                
                <div className={"col-span-2 flex justify-end items-center"}>
                    <div className={"flex justify-center h-8 w-8 items-center bg-transluscent-grey rounded-full"}>
                        <p className={"font-semibold text-sm text-black"}>{connected_stores.length}</p>
                    </div>
                    <div className={"flex justify-center h-8 w-8 items-center"}>
                        <Button 
                            className={"flex flex-col md:py-3 md:px-3 px-2 py-2 focus:border-opacity-0 focus:outline-none border-0 outline-none"}
                        >
                            <ChevronForward size={20} color={"rgba(6,15,33, 1)"}/>
                        </Button>
                    </div>
                    
                </div>
                                        
            </div>
        </div>
    )
}
export default Page;