import React, {Fragment} from "react";
import { PublicLayout as Layout } from "app/views/Layout";
import {useQuery, useMutation} from "@apollo/client";
import {GET_PROFILE} from "./modules/queries";
import {formatNumber, formatString} from "app/lib/formatters";
import { useRouter } from "next/router";
import {Button} from "app/components/forms"
import Card from "app/components/homeCard";
import generateLogos from "./logos";
import Loading from "app/components/loading"
import { Spacer } from "app/components/assets";
import {ArrowRight} from "app/components/icons";


const Page = () => {
    const router = useRouter();

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(GET_PROFILE, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onError: (errors) => {
            console.log({ errors });
        },
    });

    if(loading){
        return(
            <Layout pageTitle={"Account"} pathname={router.pathname}>
                <Loading />
            </Layout>
        )
    }

    if (error) {
        return (
            <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                <div>
                    <p className={"text-center"}>{'unknown error occurred'}</p>
                    {/* <p className={"text-center text-textGrey"}>{'We could not find any tracking information for the reference code provided'}</p> */}
                </div>
                <Spacer className={"block h-5"} />
                <div>
                    <Button
                        onClick={() => refetch && refetch()}
                        uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                    >
                        {'Try Again'}
                    </Button>
                </div>
            </div>
        )
    }

    const fundAccount = () => {
        router.push("/account/fund-account");
    }

    const withdrawFunds = () => {
        router.push("/account/withdraw");
    }

    const { me = {}, kyc = {} } = data;
    const { paymentProfile = {} } = me;
    const { daily_withdrawal_limit = 0, monthly_withdrawal_limit = 0 } = kyc;
    const serviceLogos = generateLogos();

    return (
        <Layout pageTitle={"Account"} pathname={router.pathname}>
            <div className={"flex flex-col w-full"}>
                <div className={"bg-primary"}>
                    <div className={"container mx-auto"}>
                        <div>
                            <div className={"flex flex-col items-center pt-4 mt-11 mb-11"}>
                                <div className={"py-2"}>
                                    <p className={"text-white text-sm"}>FUNDS</p>
                                </div>
                                <div className={"py-2"}>
                                    <span className={"text-white font-extrabold md:text-9xl text-5xl"}>{`${formatNumber(
                                        paymentProfile.funds,
                                        '0,0.00',
                                    )}`}</span>
                                    <span className={"text-white md:text-xl text-xs"}>{"NGN"}</span>
                                </div>
                                <div className={"py-2"}>
                                    <Button 
                                        onClick={fundAccount}
                                        uclasses={"bg-transparent tracking-wider sm:font-normal md:font-normal border border-white mr-2 uppercase py-2 px-4 focus:ring-opacity-0"}
                                    >
                                        {"Add Money"}
                                    </Button>
                                    <Button
                                        onClick={withdrawFunds}
                                        uclasses={"bg-transparent tracking-wider sm:font-normal md:font-normal border border-white uppercase py-2 px-4"}
                                    >
                                        {"Withdraw"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"container mx-auto"}>
                    <div className={"grid grid-cols-2 lg:max-w-4xl mx-auto gap-2 md:gap-6 mt-4 p-2"}>
                        {serviceLogos.map((item, idx) => {
                            const {title, description, onClick, Logo} = item;
                            return (
                                <Fragment key={idx}>
                                    <Card 
                                        title={title}
                                        // description={description}
                                        onPress={onClick}
                                        Logo={Logo}
                                    />
                                </Fragment>
                            )
                        })} 
                    </div>
                </div>
                <div className={"flex flex-col md:w-1/2 md:mx-auto justify-center items-center px-4 mt-3"}>
                    <div className={"flex w-full flex-col"}>
                        <div className={"py-2 border-b border-textGrey border-opacity-10"}>
                            <p className={"text-primary text-xs tracking-wider"}>{formatString('transaction limits', 'uppercase')}</p>
                        </div>
                        <div>
                            <div className={"mb-1 pt-4 flex flex-row items-center justify-center"}>
                                <div className={"flex flex-row w-full justify-between border-b border-textGrey border-opacity-10 pb-4"}>
                                    <div className={"flex justify-center items-center uppercase text-xs text-textGrey tracking-wide"}>
                                        <p>{'DAILY LIMIT'}</p>
                                    </div>
                                    <div>
                                        <p>{`${formatNumber(daily_withdrawal_limit,'0,0.00',)}`}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={"mb-1 pt-4 flex flex-row items-center justify-center"}>
                                <div className={"flex flex-row w-full justify-between border-b border-textGrey border-opacity-10 pb-4"}>
                                    <div className={"flex justify-center items-center uppercase text-xs text-textGrey tracking-wide"}>
                                        <p>{'MONTHLY LIMIT'}</p>
                                    </div>
                                    <div>
                                        <p>{`${formatNumber(monthly_withdrawal_limit,'0,0.00',)}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Spacer className={"block h-5"} />
                    <div 
                        onClick={() => router.push("/account/activities/transfers")}
                        className={"cursor-pointer flex"}
                    >
                        <p className={"text-xs uppercase text-primary"}>{"View Transaction History"}</p>
                        <div className={"text-primary"}>
                            <ArrowRight size={15} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Page;