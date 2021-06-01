import * as React from "react";
import cx from "classnames";


const Button = ({children, onClick, showLoading=false, disabled, uclasses, ...props}) => {
    const childComponent = showLoading ? "Please Wait" : children;
    
    return(
        <button
            // className={`text-white py-2 text-xs font-semibold border-2 border-black md:text-sm bg-black min-h-0 focus:outline-none outline-none rounded cursor-pointer px-2 
            //     ${style} 
            //     ${uclasses}`
            // }
            disabled={disabled}
            className={`${
               disabled || showLoading ? "bg-gray-400 cursor-not-allowed" : null
                }  flex flex-1 sm:w-auto rounded-sm justify-center uppercase tracking-wider text-sm text-center font-bold bg-black text-white px-6 py-3 ${uclasses}`}
            onClick={onClick}
           {...props}

        >
            {childComponent}
        </button>
    )
}
export default Button;
