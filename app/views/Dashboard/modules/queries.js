import { gql } from '@apollo/client';

export const GET_PROFILE = gql`
    query {
        me: me {
            username
            name
            email
            photo
            social {
                name
                access_token
            }
            paymentProfile {
                funds
                escrow
                accounts {
                    pk
                    type
                    balance
                    key
                    currency
                }
                virtual_bank_accounts {
                    account_name
                    account_number
                    bank_name
                }
            }
            discoveryProfile {
                store_name
                username
                pk
                is_seller
            }
            referral_code
        }
    }
`;
