export const domainIssues = (type = 'sendbox_payments') => {
    let results = [];
    if (type === 'sendbox_payments') {
        results = [
            {
                id: 1,
                name: 'Airtime purchase error',
            },
            {
                id: 2,
                name: 'Electricity purchase error',
            },
            {
                id: 3,
                name: 'Wallet topup error',
            },
            {
                id: 4,
                name: 'Withdrawal Failure',
            },
            {
                id: 5,
                name: 'Transfer Failure',
            },
            {
                id: 6,
                name: 'Wallet debited',
            },
        ];
    } else if (type === 'sendbox_shipping') {
        results = [
            {
                id: 1,
                name: 'Wrong delivery address',
            },
            {
                id: 2,
                name: 'Item has not been Picked up',
            },
            {
                id: 3,
                name: 'Shipping charge has not been refunded',
            },
            {
                id: 4,
                name: 'Wrongly delivered item',
            },
            {
                id: 5,
                name: 'Misplaced goods',
            },
            {
                id: 6,
                name: 'Damaged goods',
            },
            {
                id: 7,
                name: 'Delayed delivery',
            },
        ];
    } else {
        results = [
            {
                id: 1,
                name: 'Request Failed',
            },
        ];
    }
    return results;
};
