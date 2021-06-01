import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import cx from "classnames";

const ActivityIndicator = () => {
    return (
        <div className={"flex justify-center items-center"}>
            <ClipLoader size={35} margin={2} color={"rgba(237, 47, 89, 1)"} />
        </div>
    )
}

export default ActivityIndicator;