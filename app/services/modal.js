import * as React from 'react';
import ReactDom from "react-dom";
import cx from "classnames";
import { CloseIcon, ArrowLeft } from "app/components/icons";
import { Button } from "app/components/forms";
import { useWindowDimensions } from "app/lib/hooks";

const Portal = ({ children, ...props }) => {
    const style = cx("fixed", "z-50", "bg-white", "top-0", "overflow-y-scroll", "translate-y-full", "left-0", "right-0", "bottom-0", "transition-all", {
        "visible": props.open,
        "translate-y-0": props.open,
        "invisible": !props.open,
    });
    return (
        <div className={style}>
            {children}
        </div>
    )
}

const Modal = ({ title, isMulti, goBack, wizard, ...props }) => {
    const [open, setOpen] = React.useState(props.open);
    const { onClose, children } = props;

    React.useEffect(() => {
        setOpen(props.open);
    }, [props.open]);


    const onRequestClose = React.useCallback(() => {
        setOpen(false);

        onClose && onClose();
    }, [onClose]);

    const handleEscapeKey = React.useCallback(
        (event) => {
            if (event.keyCode === 27) {
                onRequestClose && onRequestClose();
            }
        },
        [onRequestClose],
    );

    // Manage event listener
    React.useEffect(() => {
        document.addEventListener("keydown", handleEscapeKey, false);
        return () => {
            document.removeEventListener("keydown", handleEscapeKey, false);
        };
    }, [handleEscapeKey]);

    React.useEffect(() => {
        if (open) {
            document.querySelector("body").style.overflow = "hidden";
        } else {
            document.querySelector("body").style.overflow = null;
        }
    });

    // memoized callback function. This is done to improve optimization

    const Component = (
        <Portal open={open}>
            <header className="text-black body-font sticky shadow">
                {!wizard ? (<div className="grid grid-cols-3 py-4">
                    <div className={"col-span-1 flex flex-col justify-center items-start px-5"}>
                        {isMulti ? (<Button
                            className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}
                            onClick={() => goBack && goBack()}
                        >
                            <ArrowLeft size={20} color={"rgba(6,15,33, 1)"} />
                        </Button>) : null}
                    </div>
                    <div className={"flex flex-col items-center justify-center col-span-1"}>
                        <h3 className={"uppercase font-bold text-xs md:text-base"}>{title || ""}</h3>
                    </div>
                    <div className={"flex col-span-1 flex-col px-1 items-end justify-center"}>
                        <Button
                            className={"w-9 md:w-10 bg-transparent focus:outline-none border-0 outline-none"}
                            onClick={onRequestClose}
                        >
                            <CloseIcon size={20} color={"rgba(6,15,33, 1)"} />
                        </Button>
                    </div>
                </div>) : null}
            </header>
            {children}
        </Portal>
    );

    const body = document.querySelector("body");

    return ReactDom.createPortal(Component, body);
};


export default Modal;