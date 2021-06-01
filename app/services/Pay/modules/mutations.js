import { gql } from '@apollo/client';

export const PREPARE_TRANSACTION = gql`
    mutation PrepareTransaction(
        $domain: String!
        $reference_code: String!
        $payment_source_code: String!
        $amount: Float!
        $action: String!
        $narration: String!
        $name: String
        $email: String
        $phone: String
        $country_code: String
        $gateway_code: String
        $card_key: String
    ) {
        prepareTransaction(
            domain: $domain
            reference_code: $reference_code
            payment_source_code: $payment_source_code
            amount: $amount
            action: $action
            narration: $narration
            name: $name
            email: $email
            phone: $phone
            country_code: $country_code
            gateway_code: $gateway_code
            card_key: $card_key
        ) {
            data {
                order_reference
                amount
                txref
            }
            page
            txref
            message
            payment_source_code
            amount
            commission
            domain
            reference_code
            name
            email
            phone
            virtual_bank_accounts {
                bank_name
                account_name
                account_number
            }
            payment_instructions {
                bank_name
                bank_code
                account_name
                account_number
                message
                account_name
                virtual_bank_accounts {
                    bank_name
                    account_name
                    account_number
                }
            }
        }
    }
`;

export const CHARGE_CARD = gql`
    mutation ChargeCard($txref: String!, $card: CardDetails!, $amount: Float!) {
        chargeCard(txref: $txref, card: $card, amount: $amount) {
            reference
            amount
            payment_source_code
            message
            data
            page
            txref
        }
    }
`;

export const CARD_PIN = gql`
    mutation CardPin($txref: String!, $reference: String!, $pin: String!) {
        cardPin(txref: $txref, reference: $reference, pin: $pin) {
            reference
            amount
            payment_source_code
            message
            data
            page
            txref
        }
    }
`;

export const CARD_OTP = gql`
    mutation CardOtp($txref: String!, $reference: String!, $otp: String!) {
        cardOtp(txref: $txref, reference: $reference, otp: $otp) {
            reference
            amount
            payment_source_code
            message
            data
            page
            txref
        }
    }
`;

export const VALIDATE_CARD_CHARGE = gql`
    mutation ValidateCardCharge($txref: String!, $reference: String!) {
        validateCardCharge(txref: $txref, reference: $reference) {
            reference
            amount
            payment_source_code
            message
            data
            page
            txref
        }
    }
`;

export const VALIDATE_TRANSACTION = gql`
    mutation ValidateTransaction($txref: String!, $reference: String) {
        validateTransaction(txref: $txref, reference: $reference) {
            reference
            amount
            payment_source_code
            message
            data
            page
            txref
        }
    }
`;
