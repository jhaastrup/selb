import React, { Fragment, useEffect } from "react";

import Auth from "app/lib/auth";

const Page = () => {
    useEffect(() => {
        Auth.logoutUser();
    }, [Auth])
    return <Fragment />;
};

export default Page;
