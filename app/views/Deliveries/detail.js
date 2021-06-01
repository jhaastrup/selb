import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useMutation } from '@apollo/client';
import {formatDate, formatPhone, formatString, formatNumber} from "app/lib/formatters";
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading";
import Modal from "app/services/modal";
import _ from "lodash";
import { DELIVERY } from './modules/queries';
import { DOWNLOAD_RECEIPT } from './modules/mutations';
import Alert from "app/services/alerts/simpleAlert";
import {Button} from "app/components/forms";
import {classNames} from "app/lib/utils";




const Page = ({query}) => {

    const [obj, setObj] = React.useState();
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [isDownloadError, setIsDownloadError] = React.useState(false);
    const router = useRouter();

    const { refetch, loading, error, data } = useQuery( DELIVERY , {
        fetchPolicy: 'cache-and-network',
        variables: { id: query.did },
        onCompleted: (payload) => {
            const { getDiscoverySale } = payload;
            setObj(getDiscoverySale);
        },
    });

    const [sendDeliveryReceipt, { loading: downloading, data: downloadData, error: downloadError }] = useMutation(
        DOWNLOAD_RECEIPT,
        {
            onCompleted: (data) => {
                setAlertVisible(true)
                setIsDownloadError(false)
                setAlertMessage("Receipt has been sent to your email")
            },
            onError: (err) => {
                console.log({ err });
                setIsDownloadError(true)
                setAlertMessage("Failed to send receipt, please try again later")
                setAlertVisible(true)
            },
        },
    );

    const downloadReceipt = (id, code) => {
        sendDeliveryReceipt({
            variables: {
                id,
                code,
            },
        });
    };

    

    

    

  

    if(loading){
        return(
            <Layout pathname={router.pathname}>
                <Loading />
            </Layout>
        )
    }

    if(error){
        return(
            <Layout pathname={router.pathname}>
                <div className={"h-40 mt-auto flex items-center justify-center"}>
                    <Button
                        onClick={() => refetch && refetch()} 
                    >
                       Try Again
                    </Button>
                </div>
            </Layout>
        )
    }

    

    const {
        pk,
        code,
        current_awb,
        awb_no,
        origin,
        destination,
        date_created,
        status,
        items = [],
        pieces = [],
        fee,
        fee_balance,
        partner = { pieces: [] },
        paid,
        total_value,
        insurance_option,
        incoming_option,
        weight,
        insurance_fee,
    } = data.delivery;



    const originMain = _.compact([
        origin?.street || '',
        origin?.city || '',
        formatString(origin?.state || '', 'capitalize'),
        origin?.country?.name || '',
        origin.post_code || '',
    ]).join(', ');
    const originSub = _.compact([origin?.name || '', formatPhone(origin?.phone, 'NATIONAL') || '']).join(' \u2022 ');

    const destinationMain = _.compact([
        destination?.street || '',
        destination?.city || '',
        formatString(destination?.state || '', 'capitalize'),
        destination?.country?.name || '',
        destination.post_code || '',
    ]).join(', ');
    const destinationSub = _.compact([destination?.name || '', formatPhone(destination?.phone, 'NATIONAL') || '']).join(
        ' \u2022 ',
    );

    const toTracking = (code) => {
        router.push({
            pathname: '/tracking',
            query: {code},
          })
    }


    return(
        <React.Fragment>
            <Layout back={router.back} isDynamic={true} pathname={router.pathname}>
                
                <div className="max-h-screen overflow-y-auto">
                    <div className={"max-w-3xl w-full relative p-2 pb-20 mx-auto"}> 
                        <div className={"mt-8 mb-4"}>
                            <p className={"text-primary text-xs md:text-sm font-semibold"}>
                                {`${formatString(
                                    'DELIVERY TO',
                                    'uppercase',
                                )}`}</p> 
                            <p className={"text-black capitalize text-sm md:text-base"}>{`${destination?.name }`}</p>
                        </div>
                        <div className={"mt-8 mb-4"}>
                            <p className={"text-gray-700 text-xs uppercase md:text-sm"}>{"Origin"}</p> 
                                <p className={"text-black capitalize text-sm md:text-base"}>{`${originMain}`}</p>                        
                                <p className={"text-gray-700 text-sm md:text-base"}>{`${originSub}`}</p>

                        </div>

                        <div className={"mt-8 mb-4"}>
                            <p className={"text-gray-700 text-xs md:text-sm font-semibold"}>
                                {`${formatString(
                                    'Destination',
                                    'uppercase',
                                )}`}</p> 
                                <p className={"text-black capitalize text-sm md:text-base"}>{`${destinationMain}`}</p>                        
                                <p className={"text-gray-700 text-sm md:text-base"}>{`${destinationSub}`}</p>

                        </div>
                        <div className={"my-4 py-4 text-xs font-semibold px-2 gap-6 md:flex grid grid-cols-2 md:justify-start"}>
                                <button
                                    disable={downloading}
                                    onClick={() => downloadReceipt(pk, code)}
                                    className={classNames("py-2 px-4 w-30 border border-black rounded-md shadow-sm text-sm font-medium text-black hover:bg-gray-100 focus:outline-none", downloading && "cursor-not-allowed opacity-50")}
                                >
                                   {downloading ?<><ClipLoader size={15} color={"rgba(237, 47, 89, 1)"}/> Send Receipt</> : "Send Receipt"}
                                </button>
                                <button
                                    onClick={() => toTracking(code)}
                                    className="bg-indigo-700 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {"Track History"}
                                </button>
                                
                        </div>
                    
                        <div>
                            <dl className="mt-2 border-t border-b border-gray-400 divide-y divide-gray-400">
                                    
                                <div className="py-3 flex justify-between flex-wrap text-sm font-medium">
                                    <dt className="text-textGrey">{"Tracking Code"}</dt>
                                    <dd className="text-black truncate">{`${formatString(
                                        code ?? '-',
                                        'uppercase',
                                    )}`}</dd>
                                </div>
                                <div className={"flex justify-between my-4"}>
                                    {items.map((opt, idx) => {
                                        const { name, item_type, quantity: q, post, unit_amount: value } = opt;
                                        const titleText = name;
                                        const subText = item_type?.name || '';
                                        const { weight: wgt = 0 } = post ?? {};

                                        const qty = parseInt(q, 10);
                                        const newQty = qty > 9 ? '9+' : qty;
                                        return(
                                            <div key={`${idx}-{${name}`} className={"grid grid-cols-7 gap-2 py-2 text-xs"}>
                                                <div className={"col-span-1 flex justify-center w-8 h-8 items-center rounded-full bg-gray-200"}>
                                                    <span>{newQty}</span>
                                                </div>
                                                <div className={"col-span-5 flex flex-col items-start justify-center"}>
                                                    <p className={"font-semibold "}>{titleText}</p>
                                                    <p className={"font-semibold  text-textGrey"} >{subText}</p>
                                                </div>
                                                
                                                <div className={" col-span-1 flex flex-col justify-end items-end"}>
                                                    <p className={"font-semibold "}>{`${formatNumber(value ?? 0, '0,0.00')}`}</p>
                                                    <p className={"font-semibold text-textGrey"}>{`${formatNumber(
                                                    wgt ?? 0,
                                                    '0.00',
                                                )}KG`}</p>

                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="py-3 flex justify-between  text-sm font-medium">
                                    <dt className="text-gray-600">{"Declared Weight"}</dt>
                                    <dd className="text-black truncate">{`${formatNumber(weight, '0.0')}`}</dd>
                                </div>
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-600">{"Declared Value"}</dt>
                                    <dd className="text-black truncate">{`${formatNumber(total_value, '0,0.00')}`}</dd>
                                </div>
                                       
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-600">{"Insurance"}</dt>
                                    <dd className="text-black truncate">{`${formatString(
                                        insurance_option?.name || '-',
                                        'uppercase',
                                        )}`}
                                    </dd>
                                </div>
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-600">{"Air Waybill"}</dt>
                                    <dd className="text-black truncate">{`${formatString(
                                        current_awb || '-',
                                        'uppercase',
                                    )}`}</dd>
                                </div>
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-600">{"Number of pieces"}</dt>
                                    <dd className="text-black truncate">{`${formatNumber(pieces.length || partner?.pieces?.length || 1, '0,0')}`}</dd>
                                </div>
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-600">{"Verified Weight"}</dt>
                                    <dd className="text-black truncate">{`${formatNumber(partner?.weight, '0.0')}`}</dd>
                                </div>
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-600">{"Volumetric Weight"}</dt>
                                    <dd className="text-black truncate">{`${formatNumber(
                                        partner?.dimension_weight,
                                        '0.0',
                                    )}`}</dd>
                                </div>
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-600">{"Billable Weight"}</dt>
                                    <dd className="text-black truncate">{`${formatNumber(
                                        partner?.billable_weight,
                                        '0.0',
                                    )}`}</dd>
                                </div>
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-600">{"Total Fee"}</dt>
                                    <dd className="text-black truncate">{`\u20a6${formatNumber(fee, '0,0.00')}`}</dd>
                                </div>
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-600">{"Amount Due"}</dt>
                                    <dd className="text-black truncate">{`\u20a6${formatNumber(fee_balance, '0,0.00')}`}</dd>
                                </div>
                                
                            </dl>
                        </div>
                    

                    </div>
                </div>
                {alertVisible && <Alert updateError={isDownloadError} description={alertMessage} show={alertVisible} onClose={setAlertVisible}/>}
            </Layout>
        </React.Fragment>
    )

}


export default Page;