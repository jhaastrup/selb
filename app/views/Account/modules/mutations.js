import { gql } from '@apollo/client';
export const CREATE_TOPUP = gql`
    mutation CreateTopup($amount: Float!, $currency: String!, $payment_source_code: String, $card_key: String) {
        createTopUp(
            amount: $amount
            currency: $currency
            payment_source_code: $payment_source_code
            card_key: $card_key
        ) {
            amount
            fee
            payment_source_code
            payable
            domain
            narration
            currency
            reference_code
            action
            bank_code
            payment_instructions {
                message
                account_number
                account_name
                bank_name
                bank_code
                ussd_code
                reference
                amount
                mode
            }
        }
    }
`;

export const VALIDATE_TOPUP = gql`
    mutation validateTopUp($code: String!) {
        amount
        fee
        payment_source_code
        payable
        domain
        narration
        currency
        reference_code
        action
    }
`;

export const TRANSFER_FUND = gql`
    mutation createRequest(
        $amount: Float
        $rule: String
        $request_type: String
        $currency_code: String
        $target: String
        $description: String
        $country_code: String
        $items: [ItemInput]
    ) {
        createRequest(
            amount: $amount
            rule: $rule
            request_type: $request_type
            currency_code: $currency_code
            target: $target
            description: $description
            country_code: $country_code
            items: $items
        ) {
            code
            pk
            amount
            escrow_fee
            description
            url
            target {
                name
                username
                email
                pk
            }
            sender_actions {
                pk
                code
                name
                description
            }
            recipient {
                name
                email
                user_id
                phone
            }
            rule {
                name
                code
            }
            type {
                name
                code
            }
            currency {
                name
                code
                symbol
            }
            status {
                name
                code
                pk
            }
            payment_data {
                payable
                domain
                reference_code
                action
                narration
                amount
            }
        }
    }
`;

export const VERIFY_TRANSFER = gql`
    mutation verifyPayment($txref: String) {
        verifyPayment(txref: $txref) {
            status {
                name
                code
                pk
            }
            code
            request {
                pk
                code
            }
        }
    }
`;

// export const WITHDRAW = gql`
//     mutation requestWithdrawalByFranchise($amount: Float!, $currency: String!, $bank_account_id: String!) {
//         requestWithdrawalByFranchise(amount: $amount, currency: $currency, bank_account_id: $bank_account_id) {
//             status {
//                 name
//                 code
//             }
//             code
//             narration
//         }
//     }
// `;

export const REQUEST_BILL_PAYMENT = gql`
    mutation requestBillingPayment($amount: Float!, $service_id: String!, $customer_ref: String!) {
        requestBillingPayment(amount: $amount, service_id: $service_id, customer_ref: $customer_ref) {
            biller
            biller_status
            payment_code
            transaction_ref
            code
            user_id
            amount
            customer_id
            status
            payment_code
            transaction_ref
            payment_data {
                narration
                status_code
                currency
                amount
                type
                domain
                action
                reference_code
                name
                email
                phone
            }
        }
    }
`;

export const VERIFY_BILL_PAYMENT = gql`
    mutation verifyBillingPayment($txref: String!) {
        verifyBillingPayment(txref: $txref) {
            status {
                code
                description
                name
            }
            payment {
                pk
                _id
                biller
                biller_status
                code
                amount
                customer_id
                status
                payment_code
                transaction_ref
            }
            code
        }
    }
`;

export const VERIFY_BANK = gql`
    mutation verifyBankAccount($account_number: String!, $bank_code: String!) {
        verifyBankAccount(account_number: $account_number, bank_code: $bank_code) {
            message
            payload {
                bank_code
                account_name
                account_number
            }
            bank {
                code
                name
                description
                pay_with_bank
                pk
                bank_transfer
                ussd
            }
        }
    }
`;

export const TRANSFER_TO_BANK = gql`
    mutation bankTransfer(
        $rule: String
        $target_type: String
        $requires_shipping: Boolean
        $bank_account: BankDetailInput
        $request_type: String
        $country_code: String
        $amount: Float
        $description: String
        $currency_code: String
    ) {
        bankTransfer(
            rule: $rule
            target_type: $target_type
            requires_shipping: $requires_shipping
            bank_account: $bank_account
            request_type: $request_type
            country_code: $country_code
            amount: $amount
            description: $description
            currency_code: $currency_code
        ) {
            code
            pk
            amount
            escrow_fee
            recipient {
                name
                email
                user_id
                phone
            }
            rule {
                name
                code
            }
            type {
                name
                code
            }
            currency {
                name
                code
                symbol
            }
            status {
                name
                code
                pk
            }
            payment_data {
                payable
                domain
                reference_code
                action
                narration
                amount
            }
        }
    }
`;

export const WITHDRAW_FUND = gql`
    mutation requestWithdrawal($amount: Float!, $currency: String!, $bank_account_id: String!) {
        requestWithdrawal(amount: $amount, currency: $currency, bank_account_id: $bank_account_id) {
            status {
                code
                name
                pk
                description
            }
            code
            narration
        }
    }
`;
