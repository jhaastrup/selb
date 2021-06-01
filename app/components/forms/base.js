import * as React from "react";
import cx from "classnames";
import {useWindowDimensions} from "app/lib/hooks";

export const Label = ({labelText, resize}) => {
    const {width} = useWindowDimensions();
    const style = cx("not-sr-only", "text-xs", "md:text-sm",  "text-transluscent-textGrey",{
        "text-sm": resize,
        "text-xs": width < 768,
    });
   
    return(
        <React.Fragment>
            {labelText ? (
                <label className={style}>{labelText}</label>
            ): null}
        </React.Fragment>
    )
}

export const ErrorText = ({errorText}) => {
    return (
        <React.Fragment>
        {errorText ? (
            <p className={"text-xs p-2 text-red"}>
                {errorText}
            </p>
        ): null}
             
        </React.Fragment>
       
    )
}
