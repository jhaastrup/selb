import React, { Fragment, useState, useCallback, useEffect, useRef } from 'react';
import _ from 'lodash';
import ActivityIndicator from 'app/components/activityIndicator';

const Page = ({onProceed, onSuccess, transData, dependencies = {}}) => {
    const [counter, setCounter] = useState(3);

    useEffect(() => {
        const timer =
            counter > 0 &&
            setInterval(() => {
                if (counter === 1) {
                    console.log('calling the onsuccess now');
                    onSuccess && onSuccess(transData);
                }
                setCounter(counter - 1);
            }, 30);

        return () => clearInterval(timer);
    }, [counter, onSuccess, transData]);

    return (
        <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
            <div>
                <p className={"text-center"}>
                    <ActivityIndicator />
                </p>
                <p className={"text-center text-textGrey"}>{'Success, Redirecting...'}</p>
            </div>
        </div>
    );
};

export default Page;
