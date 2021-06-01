import { gql } from '@apollo/client';

export const DELETE_CARD = gql`
    mutation deleteCard($id: ID!) {
        deleteCard(id: $id) {
            title
            description
        }
    }
`;

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
                ussd_code
                reference
                amount
                mode
            }
        }
    }
`;