import * as React from "react";

const Card = ({title, Logo, description, mainColor, onPress}) => {
    return (
        
        <div onClick={() => onPress()} className="bg-white relative overflow-hidden  shadow rounded-lg">
            <div className="p-5">
                <div className="flex mb-5 items-center">
                   
                    <div className={"w-16 h-12"}>
                        <Logo />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-bold text-black truncate">
                                {title}
                            </dt>
                            <dd>
                                <div className="text-sm font-medium text-textGrey">
                                    {description}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className="bg-backgroundGrey absolute w-full h-6 bottom-0 px-5 py-3">
                
            </div>
        </div>
    )
}

export default Card;