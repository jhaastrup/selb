import WithdrawIcon from 'public/images/tabs/receive-money.svg';
import TransferIcon from 'public/images/tabs/send-money.svg';
import AirtimeIcon from 'public/images/tabs/airtime.svg';
import ElectricityIcon from 'public/images/tabs/electricity.svg';

import { useRouter } from "next/router";


const generateLogos = () => {
    const router = useRouter();
    return [
        {
            title: 'Withdraw Money',
            name: 'withdraw-money',
            description: 'Got items to sell? List your products for sale.',
            Logo: TransferIcon,
            onClick: () => {
                router.push("/account/withdraw");
            },
        },
        {
            title: 'Transfer Money',
            name: 'piggy-bank',
            description: 'Got items to sell? List your products for sale.',
            Logo: TransferIcon,
            onClick: () => {
                router.push("/account/transfer");
            },
        },
        {
            title: 'Request Money',
            name: 'bank-transfer-out',
            description: 'Request money from your friends and contacts',
            Logo: WithdrawIcon,
            onClick: () => {
                router.push("/account/request");
            },
        },
        // {
        //     title: 'Buy Airtime',
        //     name: 'transfer-right',
        //     description: 'Prepaid and postpaid electricity tokens available.',
        //     Logo: AirtimeIcon,
        //     onClick: () => {
        //         router.push("/account/billing/airtime");
        //     },
        // },
        // {
        //     title: 'Buy Electricity',
        //     name: 'transfer-right',
        //     description: 'Prepaid and postpaid electricity tokens available.',
        //     Logo: ElectricityIcon,
        //     onClick: () => {
        //         router.push("/account/billing/electricity");
        //     },
        // },
    ]
}

export default generateLogos;