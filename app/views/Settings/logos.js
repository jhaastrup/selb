import { useRouter } from "next/router";

const generateLogos = (navigation) => {
    const router = useRouter();
    return [
        {
            title: 'Your Profile',
            name: 'profile',
            description: 'Your Profile',
            // Logo: TransferIcon,
            onClick: () => router.push("/settings/profile"),
        },
        {
            title: 'Bank Accounts',
            name: 'bank',
            description: 'Linked bank accounts',
            // Logo: TransferIcon,
            onClick: () => router.push("/settings/bank-account"),
        },
        {
            title: 'Debit Cards',
            name: 'cards',
            description: 'Linked cards',
            // Logo: WithdrawIcon,
            onClick: () => router.push("/settings/cards")
        },
        {
            title: 'Saved Addresses',
            name: 'address',
            description: 'Saved user addresses',
            // Logo: AirtimeIcon,
            onClick: () => router.push("/settings/addresses"),
        },
        {
            title: 'Account Verification',
            name: 'KYC',
            description: 'Link your BVN to your sendbox account',
            // Logo: TransactionsIcon,
            onClick: () => router.push("/settings/bvn"),
        },
        {
            title: 'Connect your store',
            name: 'Store',
            description: 'Connect your woocommerce or shopify.',
            // Logo: AirtimeIcon,
            onClick: () => router.push("/settings/connect-store"),
        },
        // {
        //     title: 'Help Center',
        //     name: 'center',
        //     description: 'Contact sendbox help center.',
        //     Logo: AirtimeIcon,
        //     onClick: () => {
        //         handleURL(helpCenterLink);
        //     },
        // },
        // {
        //     title: 'Report an issue',
        //     name: 'report',
        //     description: 'Complain about an issue.',
        //     Logo: AirtimeIcon,
        //     onClick: () => navigation.navigate('report'),
        // },
        {
            title: 'Legal',
            name: 'document',
            description: 'Sendbox terms and conditions',
            // Logo: ElectricityIcon,
            onClick: () => router.push("/legal"),
        },
        {
            title: 'Contact Us',
            name: 'contact',
            description: 'Contact sendbox',
            // Logo: TransactionsIcon,
            onClick: () => router.push("/contact-us"),
        },
        // {
        //     title: 'Log Out',
        //     name: 'logout',
        //     description: 'Log user out of the application',
        //     Logo: TransactionsIcon,
        //     onClick: () => {},
        // },
    ];
};

export default generateLogos;