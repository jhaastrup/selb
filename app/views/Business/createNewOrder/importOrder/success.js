import * as React from "react";
import { useRouter } from "next/router";


const Page = ({onClose}) => {
    const [counter, setCounter] = React.useState(10);

    React.useEffect(() => {
        const timer =
        counter > 0 &&
        setInterval(() => {
            if (counter === 1) {
                onClose && onClose();
            }
            setCounter(counter - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [counter, onClose]);

    return(
        <div style={{width: "60%", margin:"1rem auto"}}>
            <p> orders imported successsfully</p>
            <p>{`Redirecting in ${counter} seconds`}</p>
        </div>
    )

}

export default Page;