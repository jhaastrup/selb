import DeliveryIcon from 'public/images/tabs/disabled/delivery.svg';
import QuoteIcon from 'public/images/tabs/quote.svg';
import TrackingIcon from 'public/images/tabs/tracking.svg';
import ImportIcon from 'public/images/tabs/import.svg';

const generateLogos = (router) => {

    return [
        {
            title: 'Book Delivery',
            description: 'Request local and international deliveries.',
            Logo: DeliveryIcon,
            mainColor: true,
            onPress:  () => router.push("/deliveries/create"),
        },
        
        {
            title: 'Delivery Rates',
            description: 'Check prices for shipping to local and international destinations.',
            Logo: QuoteIcon,
            onPress: () => router.push("/quote"),
        },
        {
            title: 'Track Deliveries',
            description: 'Keep track of your local and international shipments.',
            Logo: TrackingIcon,
            onPress: () => router.push("/tracking"),
        },
        {
            title: 'Overseas Imports',
            description: 'Import your packages and orders from other countries.',
            Logo: ImportIcon,
            onPress:  () => router.push("/overseas"),
        },
        // {
        //     title: 'Send or Request Money',
        //     description: 'View and manage orders for your products.',
        //     Logo: TransferIcon,
        //     onPress: () => {
        //         navigation.navigate('account.actions', {
        //             screen: 'account.transfer',
        //         });
        //     },
        // },
        // {
        //     title: 'Buy Airtime',
        //     description: 'MTN, Airtel, Glo and 9Mobile airtime available.',
        //     Logo: AirtimeIcon,
        //     onPress: () => {
        //         navigation.navigate('account.actions', {
        //             screen: 'account.billing',
        //             params: {
        //                 category: 'airtime',
        //             },
        //         });
        //     },
        // },
        // {
        //     title: 'Buy Electricity',
        //     description: 'Prepaid and postpaid electricity tokens available.',
        //     Logo: ElectricityIcon,
        //     onPress: () => {
        //         navigation.navigate('account.actions', {
        //             screen: 'account.billing',
        //             params: {
        //                 category: 'electricity',
        //             },
        //         });
        //     },
        // },
        // {
        //     title: 'Add Products for Sale',
        //     description: 'Add new product to your store',
        //     Logo: ProductIcon,
        //     onPress: () => {
        //         navigation.navigate('business.list', {
        //             screen: 'business.product.form',
        //         });
        //     },
        // },

        // {
        //     title: 'Contact Us',
        //     description: 'Prepaid and postpaid electricity tokens available.',
        //     Logo: QuoteIcon,
        //     onPress: () => {
        //         navigation.navigate('contact-us');
        //     },
        // },
    ];
};
export default generateLogos;