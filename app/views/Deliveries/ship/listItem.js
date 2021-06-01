import * as React from "react";
import { ChevronRightIcon, MailIcon } from '@heroicons/react/solid'
import {classNames} from "app/lib/utils";
const ListItem = ({item, onItemSelected}) => {
    
    const {
        titleText,
        subText
    } = item;
    
    return(
        
        
        <React.Fragment>
            
            <li className="relative hover:bg-gray-50">
                <div  onClick={() =>onItemSelected(item)} className={classNames("block cursor-pointer")}>
                    <div className="flex items-center py-4">
                           
                        <div className="min-w-0 flex-1 md:grid md:gap-4">
                            
                        
                            <div>
                                <p className={classNames("flex items-center text-sm ")}>{titleText}</p>
                                <p className={classNames("flex text-gray-500 items-center text-sm ")}>
                                    {subText}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </li>
        </React.Fragment>

    )
}

export default ListItem;