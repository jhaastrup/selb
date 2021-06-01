import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import {formatDate, formatPhone, formatString, formatNumber} from "app/lib/formatters";
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading";
import Modal from "app/services/modal";
import _ from "lodash";
import { MERCHANT_SALE } from '../modules/queries';
import {Button} from "app/components/forms";
import FulFillOrder from "./fulfill";
import Alert from "app/services/alerts/simpleAlert";



const Page = ({query}) => {

    const [obj, setObj] = React.useState();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [fullfillmentError, setFullfillmentError] = React.useState(false);

    const router = useRouter();

    const { refetch, loading, error, data } = useQuery( MERCHANT_SALE , {
        fetchPolicy: 'cache-and-network',
        variables: { id: query.oid },
        onCompleted: (payload) => {
            const { getDiscoverySale } = payload;
            setObj(getDiscoverySale);
        },
    });

    

    const _onOrderCompleted = () => {
        setModalVisible(false);
        setAlertVisible(true);
        setFullfillmentError(false);
        setAlertMessage("Order has been fullfilled successfully")
        refetch && refetch();
    };
    const _onOrderError = () => {
        setModalVisible(false);
        setAlertVisible(true);
        setAlertMessage('Order fullfillment failed');
        setFullfillmentError(true);
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
        tracking_code,
        total_weight,
        code,
        name,
        email,
        phone,
        status,
        amount_paid,
        fulfillment_status,
        description,
        transaction_reference,
        disbursement_date,
        disbursement_reference,
        // amount,
        discount,
        shipment_id,
        shipment_ref,
        shipment_ready,
        shipping_method,
        date_created,
        profile,
        tracking,
        delivery_address,
        custom_category,
        items,
        buyer_profile,
    } = data.getDiscoverySale;
    const { store_location } = profile;
    const addressList = [
        formatString(delivery_address?.street ?? '', 'capitalize'),
        formatString(delivery_address?.city ?? '', 'capitalize'),
        formatString(delivery_address?.state ?? '', 'capitalize'),
        formatString(delivery_address?.country?.name ?? '', 'capitalize'),
        formatString(delivery_address?.post_code ?? '', 'uppercase'),
    ];

    const originAddressList = [
        formatString(store_location?.street ?? '', 'capitalize'),
        formatString(store_location?.city ?? '', 'capitalize'),
        formatString(store_location?.state ?? '', 'capitalize'),
        formatString(store_location?.country?.name ?? '', 'capitalize'),
        formatString(store_location?.post_code ?? '', 'uppercase'),
    ];

    const quantity = _.sumBy(items, 'quantity');
    const amount = _.sumBy(items, 'amount');
    const weight = _.sumBy(items, 'weight');
    const addressString = _.compact(addressList).join(', ');
    const originAddressString = _.compact(originAddressList).join(', ');
    const destinationSub = _.compact([
        delivery_address?.email || '',
        formatPhone(delivery_address?.phone, 'NATIONAL') || '',
    ]).join(' \u2022 ');
    const originSub = _.compact([
        store_location?.email || '',
        formatPhone(store_location?.phone, 'NATIONAL') || '',
    ]).join(' \u2022 ');

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
                            <p className={"text-black capitalize text-sm md:text-base"}>{`${delivery_address?.name ?? ''}`}</p>
                        </div>
                        <div className={"mt-8 mb-4"}>
                            <p className={"text-gray-700 text-xs uppercase md:text-sm"}>{"Origin"}</p> 
                                <p className={"text-black capitalize text-sm md:text-base"}>{`${originAddressString}`}</p>                        <p className={"text-black capitalize text-sm md:text-base font-bold"}>{`${delivery_address?.name ?? ''}`}</p>
                                <p className={"text-gray-700 text-sm md:text-base"}>{`${originSub}`}</p>

                        </div>

                        <div className={"mt-8 mb-4"}>
                            <p className={"text-gray-700 text-xs md:text-sm font-semibold"}>
                                {`${formatString(
                                    'Destination',
                                    'uppercase',
                                )}`}</p> 
                                <p className={"text-black capitalize text-sm md:text-base"}>{`${addressString}`}</p>                        <p className={"text-black capitalize text-sm md:text-base font-bold"}>{`${delivery_address?.name ?? ''}`}</p>
                                <p className={"text-gray-700 text-sm md:text-base"}>{`${destinationSub}`}</p>

                        </div>
                        <div className={"my-4 py-4 text-xs font-semibold px-2 gap-6 md:flex grid grid-cols-2 md:justify-start"}>
                            {['pending', 'assigned_for_pickup'].includes(fulfillment_status.code) ? (
                                <Button
                                    onClick={() => setModalVisible(true)}
                                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"

                                >
                                    {"Fullfill Order"}
                                </Button>
                            ):null}
                            <Link href={`mailto:${delivery_address?.email || ""}`} passHref={true}>
                            <Button
                                className="bg-indigo-700 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {"Send Message"}
                            </Button>
                            </Link>
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
                                    <dt className="text-gray-600">{"Sku"}</dt>
                                    <dd className="text-black truncate">{`${formatString(fulfillment_status?.code ?? 'pending', 'uppercase')}`}</dd>
                                </div>
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-600">{"Category"}</dt>
                                    <dd className="text-black truncate">{`${formatString(
                                        custom_category?.name ?? '-',
                                        'uppercase',
                                    )}`}</dd>
                                </div>
                                       
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-600">{"Total Weight"}</dt>
                                    <dd className="text-black truncate">{`${formatNumber(
                                        weight ?? 0,
                                        '0,0.[00]',
                                    )}KG`}</dd>
                                </div>
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-600">{"Toatl Value"}</dt>
                                    <dd className="text-black truncate">{`${formatNumber(
                                        amount ?? 0,
                                        '0,0.[00]',
                                    )}KG`}</dd>
                                </div>
                                <div className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-600">{"Number of Items"}</dt>
                                    <dd className="text-black truncate">{`${formatNumber(
                                        quantity ?? 0,
                                        '0,0',
                                    )}`}</dd>
                                </div>
                            </dl>
                        </div>
                    

                    </div>
                </div>
                
                
                {modalVisible ? (
                    <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
                        <FulFillOrder 
                            orderObject={obj} 
                            onSuccess={_onOrderCompleted}
                            onError={_onOrderError}
                        />
                    </Modal>

                ): null}
                {alertVisible && <Alert updateError={fullfillmentError} description={alertMessage} show={alertVisible} onClose={setAlertVisible}/>}
            </Layout>
        </React.Fragment>
    )

}


export default Page;