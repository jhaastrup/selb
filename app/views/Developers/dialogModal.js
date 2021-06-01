import * as React from "react";
import cx from "classnames";

const Modal = ({children, ...props }) => {
    const style = cx("fixed", "z-50", "top-0", "overflow-y-scroll", "translate-y-full", "left-0", "right-0", "bottom-0","transition-all", {
        "visible": props.open,
        "translate-y-0": props.open,
        "invisible": !props.open,
    });
    return(
        <div className={`${style} bg-transluscent-black shadow flex justify-center items-center h-screen`}>
            {children}
        </div>
    )
}
export default Modal;